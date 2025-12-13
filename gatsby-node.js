/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const fs = require("fs")

exports.onPreBootstrap = () => {
  try {
    require.resolve("html-entities")
  } catch (error) {
    const distEntry = require.resolve("html-entities")
    const libDir = path.join(__dirname, "node_modules", "html-entities", "lib")
    const libEntry = path.join(libDir, "index.js")
    const libTypes = path.join(libDir, "index.d.ts")

    fs.mkdirSync(libDir, { recursive: true })
    fs.writeFileSync(
      libEntry,
      `module.exports = require(${JSON.stringify(distEntry)});\n`,
      "utf8"
    )
    fs.writeFileSync(
      libTypes,
      `export * from ${JSON.stringify(distEntry.replace(/\.js$/, ".d.ts"))};\n`,
      "utf8"
    )
  }
}

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  // Ignore native node modules that shouldn't be bundled
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      externals: getConfig().externals.concat(function(context, request, callback) {
        // Exclude onnxruntime-node and sharp native modules from SSR bundle
        if (/onnxruntime-node|sharp/.test(request)) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      }),
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {},
      fallback: {
        // Polyfills for @xenova/transformers in browser
        fs: false,
        path: false,
        crypto: false,
      },
    },
  })
}

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })

  // Query for all markdown blog posts
  const result = await graphql(`
    query {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        filter: { fileAbsolutePath: { regex: "/blog/" } }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              tags
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  // Create blog post pages and project pages
  const posts = result.data.allMarkdownRemark.edges
  const blogPostTemplate = path.resolve("./src/templates/blog-post.js")
  const projectTemplate = path.resolve("./src/templates/project.js")

  posts.forEach(({ node }) => {
    const isProject = node.frontmatter.tags?.includes("project")
    
    if (isProject) {
      createPage({
        path: `/projects/${node.frontmatter.slug}`,
        component: projectTemplate,
        context: {
          slug: node.frontmatter.slug,
        },
      })
    }
    
    createPage({
      path: `/blog/${node.frontmatter.slug}`,
      component: blogPostTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    })
  })
}

/**
 * Generate article embeddings after the build completes
 * Uses dynamic import to avoid bundling onnxruntime with webpack
 */
exports.onPostBuild = async ({ graphql }) => {
  console.log("\n🔍 Starting semantic embedding generation...")

  // Query all blog posts with full content
  const result = await graphql(`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/blog/" } }
      ) {
        nodes {
          frontmatter {
            title
            slug
            tags
          }
          excerpt(pruneLength: 500)
        }
      }
    }
  `)

  if (result.errors) {
    console.error("Error querying posts for embeddings:", result.errors)
    return
  }

  const posts = result.data.allMarkdownRemark.nodes
    .filter(node => !node.frontmatter.tags?.includes("project"))
    .map(node => ({
      title: node.frontmatter.title,
      slug: node.frontmatter.slug,
      tags: node.frontmatter.tags,
      excerpt: node.excerpt
    }))

  if (posts.length === 0) {
    console.log("No posts found for embedding generation.")
    return
  }

  try {
    // Dynamic import to avoid webpack bundling issues with native modules
    const { generateEmbeddings } = require("./scripts/generate-embeddings")
    await generateEmbeddings(
      posts,
      path.join(__dirname, "public", "embeddings.json")
    )

    // Generate topic clusters from tags
    console.log("\n🏷️  Generating topic clusters...")
    const { generateClusters } = require("./scripts/generate-clusters")
    await generateClusters({
      outputPath: path.join(__dirname, "public", "clusters.json")
    })
  } catch (error) {
    console.error("Error generating embeddings or clusters:", error)
  }
}
