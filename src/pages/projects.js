import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Tags from "../components/Tags"
import "../styles/blog.css"

const ProjectsPage = ({ data }) => {
  const posts = React.useMemo(
    () => data.allMarkdownRemark.edges,
    [data.allMarkdownRemark.edges]
  )

  return (
    <Layout>
      <div className="blog-page">
        <h1 className="blog-page__title">Projects</h1>

        {posts.length === 0 ? (
          <p className="blog-page__empty">No projects found.</p>
        ) : (
          <div className="blog-post-list">
            {posts.map(({ node }) => (
              <article key={node.id} className="blog-post-card">
                <header>
                  <h2 className="blog-post-card__title">
                    <Link to={`/projects/${node.frontmatter.slug}`}>
                      {node.frontmatter.title}
                    </Link>
                  </h2>
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

export const Head = () => <Seo title="Projects" />

export default ProjectsPage

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { 
        fileAbsolutePath: { regex: "/blog/" }
        frontmatter: { tags: { in: ["project"] } }
      }
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
