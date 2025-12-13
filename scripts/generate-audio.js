#!/usr/bin/env node

/**
 * Generate audio narration for blog posts using ElevenLabs API
 *
 * Usage:
 *   node scripts/generate-audio.js                    # Process all posts without audio
 *   node scripts/generate-audio.js --slug my-post    # Process specific post
 *   node scripts/generate-audio.js --force           # Regenerate all audio
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = 'eleven_multilingual_v2';

if (!ELEVENLABS_API_KEY) {
  console.error('Error: ELEVENLABS_API_KEY not set in .env');
  process.exit(1);
}

if (!VOICE_ID) {
  console.error('Error: ELEVENLABS_VOICE_ID not set in .env');
  process.exit(1);
}

// Parse CLI arguments
const args = process.argv.slice(2);
const forceRegenerate = args.includes('--force');
const slugIndex = args.indexOf('--slug');
const targetSlug = slugIndex !== -1 ? args[slugIndex + 1] : null;

/**
 * Strip markdown formatting to get plain text for TTS
 * Removes code blocks, tables, and sections marked with <!-- no-narrate -->
 */
function stripMarkdown(text) {
  return text
    // Remove explicitly marked no-narrate sections
    .replace(/<!--\s*no-narrate\s*-->[\s\S]*?<!--\s*\/no-narrate\s*-->/gi, '')
    // Remove <details> collapsible sections (often contain code/schemas)
    .replace(/<details[\s\S]*?<\/details>/gi, '')
    // Remove code blocks (fenced with ```)
    .replace(/```[\s\S]*?```/g, '')
    // Remove code blocks (indented 4+ spaces)
    .replace(/^( {4}|\t).+$/gm, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove tables (lines starting with |)
    .replace(/^\|.+\|$/gm, '')
    // Remove table separator lines
    .replace(/^\s*\|?[-:| ]+\|?\s*$/gm, '')
    // Convert links to just text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove headers but keep text
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove any remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Split text into chunks that fit within ElevenLabs' character limit
 */
function chunkText(text, maxLength = 4500) {
  const chunks = [];
  const paragraphs = text.split('\n\n');
  let current = '';

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).length > maxLength && current) {
      chunks.push(current.trim());
      current = para;
    } else {
      current = current ? current + '\n\n' + para : para;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Call ElevenLabs API to generate audio
 */
async function generateAudioChunk(text) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${error}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

/**
 * Generate audio for a single blog post
 */
async function processPost(filePath, outputDir) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);

  const slug = frontmatter.slug || path.basename(filePath, '.md');
  const outputPath = path.join(outputDir, `${slug}.mp3`);

  // Skip if audio already exists (unless --force)
  if (fs.existsSync(outputPath) && !forceRegenerate) {
    console.log(`⏭️  Skipping "${slug}" (audio exists, use --force to regenerate)`);
    return null;
  }

  console.log(`🎙️  Generating audio for "${frontmatter.title}"...`);

  // Prepare text: title + body
  const cleanBody = stripMarkdown(body);
  const fullText = `${frontmatter.title}.\n\n${cleanBody}`;

  console.log(`   📝 ${fullText.length} characters`);

  // Check if we need to chunk
  const chunks = chunkText(fullText);

  if (chunks.length > 1) {
    console.log(`   📦 Split into ${chunks.length} chunks`);
  }

  // Generate audio for each chunk
  const audioBuffers = [];
  for (let i = 0; i < chunks.length; i++) {
    if (chunks.length > 1) {
      console.log(`   🔊 Processing chunk ${i + 1}/${chunks.length}...`);
    }
    const buffer = await generateAudioChunk(chunks[i]);
    audioBuffers.push(buffer);

    // Rate limiting between chunks
    if (i < chunks.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Concatenate buffers (simple concatenation works for MP3)
  const finalBuffer = Buffer.concat(audioBuffers);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, finalBuffer);

  console.log(`   ✅ Saved to ${outputPath} (${(finalBuffer.length / 1024).toFixed(1)} KB)`);

  return outputPath;
}

/**
 * Main entry point
 */
async function main() {
  const blogDir = path.join(__dirname, '../src/blog');
  const outputDir = path.join(__dirname, '../static/audio');

  // Get all markdown files
  let posts = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(blogDir, f));

  // Filter to specific slug if requested
  if (targetSlug) {
    posts = posts.filter(f => {
      const content = fs.readFileSync(f, 'utf-8');
      const { data } = matter(content);
      return data.slug === targetSlug;
    });

    if (posts.length === 0) {
      console.error(`Error: No post found with slug "${targetSlug}"`);
      process.exit(1);
    }
  }

  console.log(`\n🎧 ElevenLabs Audio Generator`);
  console.log(`   Voice ID: ${VOICE_ID}`);
  console.log(`   Posts to process: ${posts.length}\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const postPath of posts) {
    try {
      const result = await processPost(postPath, outputDir);
      if (result) {
        generated++;
      } else {
        skipped++;
      }
      // Rate limiting between posts
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
