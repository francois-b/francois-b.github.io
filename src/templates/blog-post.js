import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Tags from "../components/Tags"
import RelatedArticles from "../components/RelatedArticles"
import AudioPlayer from "../components/AudioPlayer"
import "../styles/blog.css"

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout>
      <article className="blog-post-article">
        <Link to="/blog" className="blog-post-back-link">
          ← Back to the list of articles
        </Link>
        <header className="blog-post-header">
          <h1 className="blog-post-title" style={{ marginBottom: "0.5rem" }}>{post.frontmatter.title}</h1>
          <p className="blog-post-card__meta">
            {post.frontmatter.date}
          </p>
          <Tags tags={post.frontmatter.tags} />
        </header>
        <AudioPlayer slug={post.frontmatter.slug} title={post.frontmatter.title} />
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <RelatedArticles currentSlug={post.frontmatter.slug} maxArticles={5} />

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
        slug
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`
