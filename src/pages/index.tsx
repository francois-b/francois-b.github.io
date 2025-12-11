import * as React from "react"
import { graphql, Link } from "gatsby"
import type { PageProps } from "gatsby"
import SideMenu from "../components/SideMenu"
// import TimelineVideoPlayer from "../components/TimelineVideoPlayer"
import { jobs } from "../data/cvContent"
// import timelineVideo from "../images/Timeline2.mp4"
import graphIcon from "../images/graph.svg"
import tacticIcon from "../images/tactic.svg"
import albumIcon from "../images/album.svg"
import "../styles/cv.css"

const AchievementList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="achievements">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
)

type BlogPostsQuery = {
  allMarkdownRemark: {
    nodes: Array<{
      id: string
      frontmatter: {
        title: string
        date: string
        slug: string
        tags?: string[] | null
      }
      excerpt: string
    }>
  }
}

const CVPage: React.FC<PageProps<BlogPostsQuery>> = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const featuredPosts = React.useMemo(
    () =>
      posts
        .filter(post => post.frontmatter.tags?.includes("featured"))
        .slice(0, 3),
    [posts]
  )

  return (
    <div className="cv-container">
      <aside className="cv-sidebar">
        <SideMenu />
      </aside>

      <div className="cv-content">
        {/* Main Content */}
        <header className="cv-header">
          <div className="header-content">
            <div className="identity">
              <div className="identity-text">
                <h1 className="name">François Bouet</h1>
                <p className="title">Web & AI engineering</p>
              </div>
            </div>
          </div>
        </header>

        <main className="cv-main">
          <div id="video-and-pitch" className="video-and-pitch">
            <div className="video-and-pitch__video">
              {/* <TimelineVideoPlayer src={timelineVideo} /> */}
              <div className="video-placeholder">
                <button className="video-placeholder__play" aria-label="Play video">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div id="helping" className="video-and-pitch__text">
              <div>
                Helping align business and engineering, so everbody can work
                better together.
              </div>
              <div id="bringing" className="video-and-pitch__text-secondary">
                Combining
                <br />
                <span className="highlight highlight--engineering">
                  engineering expertise
                </span>
                ,
                <br />
                <span className="highlight highlight--ai">AI-native development</span>,
                <br />
                and{" "}
                <span className="highlight highlight--domain">
                  domain-driven design
                </span>
                .
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="section-shell">
            <section className="summary-section">
              <p style={{ fontSize: "medium" }}>
                Hi there! On this page, you'll find a bit
                about myself, what I'm working on, and past projects. I am
                focused on knowledge management, technical communication,
                and product design. I have been working in tech since 2010 in
                Paris, London, Boston, and Chicago.
              </p>
            </section>
          </div>

          <div className="section-shell">
            <section className="cv-section blog-section">
              <h2>Featured articles</h2>
              {featuredPosts.length === 0 ? (
                <p className="summary-text">
                  New articles are on the way. Please check back soon.
                </p>
              ) : (
                <div className="blog-list">
                  {featuredPosts.map(post => (
                    <article key={post.id} className="card-base blog-card">
                      <header>
                        <h3>
                          <Link to={`/blog/${post.frontmatter.slug}`}>
                            {post.frontmatter.title}
                          </Link>
                        </h3>
                        <p className="blog-card-date">
                          {post.frontmatter.date}
                        </p>
                      </header>
                      <p>{post.excerpt}</p>
                      <Link
                        className="blog-card-link"
                        to={`/blog/${post.frontmatter.slug}`}
                      >
                        Read more →
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Projects Section */}
          <div className="section-shell">
            <section className="cv-section projects-section">
              <h2>Projects</h2>
              <div className="projects-compact">
                <article className="card-base project-item">
                  <h3>
                    <img src={graphIcon} alt="" className="project-icon" />
                    Hygge Cards: Mindful flashcards
                  </h3>
                  <p>
                    A non-flashy flashcard app with spaced-repetition and AI-generated Q&As.
                  </p>
                  <span className="project-tech">
                    LLM • AWS CDK • Embeddings in dynamoDB
                  </span>
                </article>
                 <article className="card-base project-item">
                  <h3>
                    <img src={graphIcon} alt="" className="project-icon" />
                    <Link to="/blog/mmx">mmx: Memex-like journaling</Link>
                  </h3>
                  <p>
                    This is a lightweight and versatile tool to map the reasoning behind decisions, such as Archetictural Decision Records, or any kind of discussion or debate.
                  </p>
                  <span className="project-tech">
                    LLM • AWS CDK • PostgreSQL • Embeddings with pgvector
                  </span>
                </article>
                <article className="card-base project-item">
                  <h3>
                    <img src={tacticIcon} alt="" className="project-icon" />
                    Chess openings helper
                  </h3>
                  <p>
                    Memorizing chess openings and why they work can be daunting. I endeavored to make that experience more fun and engaging.
                  </p>
                  <span className="project-tech">
                    React • Node.js • AWS
                  </span>
                </article>
                <article className="card-base project-item">
                  <h3>
                    <img src={albumIcon} alt="" className="project-icon" />
                    Privacy-first family journal
                  </h3>
                  <p>
                    I didn't want to rely on 3rd-party services with unknown privacy guarantees. This project stands up a private journal on AWS that is auditable and secure.
                  </p>
                  <span className="project-tech">
                    AWS CDK • React
                  </span>
                </article>
              </div>
            </section>
          </div>

          {/* Experience Section */}
          <div className="section-shell">
            <section className="cv-section experience-section">
              <h2>Experience</h2>

              <div className="experience-grid">
                {jobs.map((job, index) => (
                  <article key={index} className="card-base experience-card">
                    <div className="job-title">
                      <h3>{job.title}</h3>
                      <p className="company">{job.company}</p>
                      <p className="period">{job.period}</p>
                    </div>
                    <AchievementList items={job.achievements} />
                  </article>
                ))}
              </div>
            </section>
          </div>

        </main>
      </div>
    </div>
  )
}

export const Head = () => (
  <>
    <title>Francois Bouet</title>
    <meta
      name="description"
      content="Professional CV of Francois Bouet - Software engineer"
    />
  </>
)

export const query = graphql`
  query CVPageBlogPosts {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { fileAbsolutePath: { regex: "/blog/" } }
    ) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
          slug
          tags
        }
        excerpt(pruneLength: 140)
      }
    }
  }
`

export default CVPage
