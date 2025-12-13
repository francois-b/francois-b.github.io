import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Tags from "../components/Tags"
import RelatedArticles from "../components/RelatedArticles"
import AudioPlayer from "../components/AudioPlayer"
import "../styles/blog.css"

// Map persona names to their departments for display
const PERSONA_DEPARTMENTS = {
  "Nora": "content",
  "Theo": "content",
  "Eli": "content",
  "Jake": "design",
  "Mira": "design",
}

// Vimeo embed component
const VimeoEmbed = ({ vimeoId, title }) => {
  React.useEffect(() => {
    // Load Vimeo player API script if not already loaded
    if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://player.vimeo.com/api/player.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div className="blog-post-video">
      <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          title={title || 'Video'}
        />
      </div>
    </div>
  )
}

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark
  const author = post.frontmatter.author
  const vimeoId = post.frontmatter.vimeoId
  const isPersona = author && PERSONA_DEPARTMENTS[author]

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
            {isPersona && (
              <>
                {" · "}
                <span className="blog-post-author">
                  Co-authored with{" "}
                  <Link to="/colophon#personas" className="blog-post-author__link">
                    {author} ({PERSONA_DEPARTMENTS[author]})
                  </Link>
                </span>
              </>
            )}
          </p>
          <Tags tags={post.frontmatter.tags} />
        </header>
        {vimeoId && <VimeoEmbed vimeoId={vimeoId} title={post.frontmatter.title} />}
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
        author
        vimeoId
      }
    }
  }
`
