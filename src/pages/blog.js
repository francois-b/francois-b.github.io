import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Tags from "../components/Tags"
import "../styles/blog.css"

const BlogPage = ({ data }) => {
  const posts = React.useMemo(
    () => data.allMarkdownRemark.edges,
    [data.allMarkdownRemark.edges]
  )

  return (
    <Layout>
      <div className="blog-page">
        <h1 className="blog-page__title">Articles</h1>

        {posts.length === 0 ? (
          <p className="blog-page__empty">No blog posts found.</p>
        ) : (
          <div className="blog-post-list">
            {posts.map(({ node }) => (
              <article key={node.id} className="blog-post-card">
                <header>
                  <h2 className="blog-post-card__title">
                    <Link to={`/blog/${node.frontmatter.slug}`}>
                      {node.frontmatter.title}
                    </Link>
                  </h2>
                  <p className="blog-post-card__meta">
                    {node.frontmatter.date}
                  </p>
                </header>

                <p className="blog-post-card__excerpt">{node.excerpt}</p>

                <Tags tags={node.frontmatter.tags} />
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Articles" />

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
