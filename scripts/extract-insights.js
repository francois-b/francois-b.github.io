#!/usr/bin/env node

/**
 * Extract "a-ha" quotes and summaries from blog posts using Claude API
 *
 * Usage:
 *   node scripts/extract-insights.js                    # Process posts missing insights
 *   node scripts/extract-insights.js --slug my-post    # Process specific post
 *   node scripts/extract-insights.js --force           # Regenerate all insights
 *   node scripts/extract-insights.js --dry-run         # Preview without writing
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY not set in .env');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// Parse CLI arguments
const args = process.argv.slice(2);
const forceRegenerate = args.includes('--force');
const dryRun = args.includes('--dry-run');
const slugIndex = args.indexOf('--slug');
const targetSlug = slugIndex !== -1 ? args[slugIndex + 1] : null;

/**
 * Extract insights from a blog post using Claude
 */
async function extractInsights(title, content) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Analyze this blog post and extract:

1. **Quote**: The single most insightful "a-ha moment" sentence from the article - something that makes readers think differently. Extract it verbatim if possible, or slightly paraphrase if needed for clarity. Should be 1-2 sentences max.

2. **Summary**: A high-level one-line summary (10-20 words) that captures the core insight or takeaway.

Respond in JSON format only:
{
  "quote": "The extracted quote here",
  "summary": "The one-line summary here"
}

---

Title: ${title}

${content}`
      }
    ]
  });

  const text = response.content[0].text;

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response');
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Process a single blog post
 */
async function processPost(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);

  const slug = frontmatter.slug || path.basename(filePath, '.md');

  // Skip if already has insights (unless --force)
  if (frontmatter.quote && frontmatter.summary && !forceRegenerate) {
    console.log(`⏭️  Skipping "${slug}" (already has insights)`);
    return { skipped: true };
  }

  // Skip project posts
  if (frontmatter.tags?.includes('project')) {
    console.log(`⏭️  Skipping "${slug}" (project post)`);
    return { skipped: true };
  }

  console.log(`🔍 Extracting insights for "${frontmatter.title}"...`);

  try {
    const insights = await extractInsights(frontmatter.title, body);

    if (dryRun) {
      console.log(`   📝 Quote: "${insights.quote}"`);
      console.log(`   📝 Summary: "${insights.summary}"`);
      return { dryRun: true };
    }

    // Update frontmatter
    const updatedFrontmatter = {
      ...frontmatter,
      quote: insights.quote,
      summary: insights.summary
    };

    // Rebuild the file
    const updatedContent = matter.stringify(body, updatedFrontmatter);
    fs.writeFileSync(filePath, updatedContent);

    console.log(`   ✅ Quote: "${insights.quote.substring(0, 60)}..."`);
    console.log(`   ✅ Summary: "${insights.summary}"`);

    return { success: true, insights };
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    return { error: err.message };
  }
}

/**
 * Main entry point
 */
async function main() {
  const blogDir = path.join(__dirname, '../src/blog');

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

  console.log(`\n🧠 Blog Insights Extractor`);
  console.log(`   Posts to process: ${posts.length}`);
  if (dryRun) console.log(`   Mode: DRY RUN (no files will be modified)`);
  if (forceRegenerate) console.log(`   Mode: FORCE (regenerating all)`);
  console.log('');

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const postPath of posts) {
    const result = await processPost(postPath);

    if (result.skipped) {
      skipped++;
    } else if (result.error) {
      errors++;
    } else {
      processed++;
    }

    // Rate limiting between API calls
    if (!result.skipped) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
