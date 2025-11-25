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

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {},
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
