/**
 * Generate topic clusters using curated tag-based definitions.
 *
 * Usage: node scripts/generate-clusters.js
 */

const fs = require('fs');
const path = require('path');

// Curated cluster definitions
// Articles are assigned to the FIRST cluster whose tags match
const CLUSTER_DEFINITIONS = [
  {
    id: 'ai-psychology',
    label: 'AI & Psychology',
    // Articles with AI + psychology/cognition/philosophy themes
    matchTags: ['cognition', 'psychology', 'philosophy', 'ethics', 'attention', 'epistemology'],
    requireTags: ['ai'],
  },
  {
    id: 'ai-technology',
    label: 'AI & Technology',
    // Articles with AI + tech/tools/dev themes
    matchTags: ['ai'],
    requireTags: [],
  },
  {
    id: 'aws',
    label: 'AWS',
    matchTags: ['aws', 'vpc', 'cloud', 'infrastructure'],
    requireTags: [],
  },
  {
    id: 'programming',
    label: 'Programming',
    matchTags: ['compilers', 'programming-languages', 'computer-science', 'typescript', 'javascript', 'parsing', 'gatsby', 'react'],
    requireTags: [],
  },
];

// Check if a post matches a cluster definition
function postMatchesCluster(post, clusterDef) {
  const postTags = post.tags || [];

  // Must have all required tags
  const hasRequired = clusterDef.requireTags.every(tag => postTags.includes(tag));
  if (!hasRequired) return false;

  // Must have at least one match tag
  const hasMatch = clusterDef.matchTags.some(tag => postTags.includes(tag));
  return hasMatch;
}

async function generateClusters(options = {}) {
  const {
    outputPath = path.join(__dirname, '../public/clusters.json')
  } = options;

  // Read blog posts for tag information
  const blogDir = path.join(__dirname, '../src/blog');
  const posts = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const slugMatch = frontmatter.match(/slug:\s*['"]?([^'"\n]+)['"]?/);
        const tagsMatch = frontmatter.match(/tags:\s*\n((?:\s+-\s+.+\n?)+)/);

        if (slugMatch) {
          const slug = slugMatch[1].trim();
          const tags = tagsMatch
            ? tagsMatch[1].match(/-\s+['"]?([^'"\n]+)['"]?/g)?.map(t =>
                t.replace(/^-\s+['"]?/, '').replace(/['"]?$/, '').trim()
              ) || []
            : [];

          // Skip project posts
          if (!tags.includes('project')) {
            posts.push({ slug, tags });
          }
        }
      }
    }
  }

  console.log(`\nFound ${posts.length} blog posts\n`);

  // Assign posts to clusters (first match wins)
  const clusterArticles = {};
  CLUSTER_DEFINITIONS.forEach(def => {
    clusterArticles[def.id] = [];
  });

  const assigned = new Set();

  for (const clusterDef of CLUSTER_DEFINITIONS) {
    for (const post of posts) {
      if (!assigned.has(post.slug) && postMatchesCluster(post, clusterDef)) {
        clusterArticles[clusterDef.id].push(post.slug);
        assigned.add(post.slug);
      }
    }
  }

  // Build output clusters (only include non-empty clusters)
  const clusters = CLUSTER_DEFINITIONS
    .filter(def => clusterArticles[def.id].length > 0)
    .map(def => ({
      id: def.id,
      label: def.label,
      articles: clusterArticles[def.id]
    }));

  // Log cluster summary
  console.log('Clusters generated:\n');
  clusters.forEach(cluster => {
    console.log(`  "${cluster.label}" (${cluster.articles.length} articles)`);
    cluster.articles.forEach(slug => console.log(`    - ${slug}`));
  });

  // Report unassigned posts
  const unassigned = posts.filter(p => !assigned.has(p.slug));
  if (unassigned.length > 0) {
    console.log(`\n  Unassigned (${unassigned.length}):`);
    unassigned.forEach(p => console.log(`    - ${p.slug} [${p.tags.join(', ')}]`));
  }

  // Write output
  const output = {
    generated: new Date().toISOString(),
    clusters
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Clusters saved to ${outputPath}\n`);

  return output;
}

// Run if called directly
if (require.main === module) {
  generateClusters().catch(console.error);
}

module.exports = { generateClusters };
