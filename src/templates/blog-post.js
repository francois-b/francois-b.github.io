import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout>
      <article style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>{post.frontmatter.title}</h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            {post.frontmatter.date} · {post.timeToRead} min read
          </p>
          {post.frontmatter.tags && (
            <div style={{ marginTop: "1rem" }}>
              {post.frontmatter.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    marginRight: "0.5rem",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div
          dangerouslySetInnerHTML={{ __html: post.html }}
          style={{
            lineHeight: "1.7",
            fontSize: "1.1rem",
          }}
        />
        <hr style={{ margin: "3rem 0" }} />
        <Link to="/blog" style={{ textDecoration: "none" }}>
          ← Back to all posts
        </Link>
      </article>
    </Layout>
  )
}

export const Head = ({ data }) => (
  <Seo
    title={data.markdownRemark.frontmatter.title}
    description={data.markdownRemark.excerpt}
  />
)

export default BlogPostTemplate

export const query = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      excerpt
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`
