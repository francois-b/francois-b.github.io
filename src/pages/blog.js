import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "2rem" }}>Blog</h1>

        {posts.length === 0 ? (
          <p>No blog posts found.</p>
        ) : (
          <div>
            {posts.map(({ node }) => (
              <article
                key={node.id}
                style={{
                  marginBottom: "3rem",
                  padding: "1.5rem",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <header>
                  <h2 style={{ marginBottom: "0.5rem" }}>
                    <Link
                      to={`/blog/${node.frontmatter.slug}`}
                      style={{
                        textDecoration: "none",
                        color: "#333",
                      }}
                    >
                      {node.frontmatter.title}
                    </Link>
                  </h2>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}>
                    {node.frontmatter.date} · {node.timeToRead} min read
                  </p>
                </header>

                <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                  {node.excerpt}
                </p>

                {node.frontmatter.tags && (
                  <div style={{ marginBottom: "1rem" }}>
                    {node.frontmatter.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          marginRight: "0.5rem",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  to={`/blog/${node.frontmatter.slug}`}
                  style={{
                    color: "#667eea",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Blog" />

export default BlogPage

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { fileAbsolutePath: { regex: "/blog/" } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 200)
          timeToRead
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            slug
            tags
          }
        }
      }
    }
  }
`
