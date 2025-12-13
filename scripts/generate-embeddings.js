/**
 * Generate embeddings for all blog posts using Transformers.js
 * This script runs during the Gatsby build process via gatsby-node.js
 */

const { pipeline } = require('@huggingface/transformers');
const fs = require('fs');
const path = require('path');

// Cosine similarity helper for pre-normalized vectors
function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

async function generateEmbeddings(posts, outputPath) {
  console.log(`\n📚 Generating embeddings for ${posts.length} articles...`);

  // Load the embedding model
  console.log('Loading embedding model (all-MiniLM-L6-v2)...');
  const embedder = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2',
    { progress_callback: null } // Suppress progress for cleaner output
  );
  console.log('Model loaded.\n');

  const embeddings = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    // Build text to embed: title + excerpt + tags
    const textParts = [
      post.title,
      post.excerpt || '',
      post.tags ? post.tags.join(' ') : ''
    ].filter(Boolean);

    const text = textParts.join('. ');

    // Generate embedding
    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true
    });

    embeddings.push({
      slug: post.slug,
      title: post.title,
      embedding: Array.from(output.data)
    });

    // Progress indicator
    if ((i + 1) % 10 === 0 || i === posts.length - 1) {
      console.log(`  Embedded ${i + 1}/${posts.length} articles`);
    }
  }

  // Write embeddings to output file
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));

  const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`\n✅ Embeddings saved to ${outputPath} (${fileSizeKB} KB)`);

  return embeddings;
}

module.exports = { generateEmbeddings, cosineSimilarity };
