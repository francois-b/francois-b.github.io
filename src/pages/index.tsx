import * as React from "react"
import { graphql, Link } from "gatsby"
import type { PageProps } from "gatsby"
import FloatingControls from "../components/FloatingControls"
// import TimelineVideoPlayer from "../components/TimelineVideoPlayer"
import { jobs, skills } from "../data/cvContent"
// import timelineVideo from "../images/Timeline2.mp4"
import "../styles/cv.css"

const AchievementList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="achievements">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
)

const SkillList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="skill-list">
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
  const [selected, setSelected] = React.useState({ job: 0, skill: 0 })
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
        <FloatingControls />
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
              <div style={{ background: 'var(--color-bg-subtle)', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <p style={{ color: 'var(--color-text-lighter)' }}>Video placeholder</p>
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
                <span className="highlight highlight--ai">AI literacy</span>,
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
                Hi there! Thanks for stopping by. On this page, you'll find more
                about myself, what I'm working on, and past projects. I am
                passonate about knowledge management, technical communication,
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
              <h2>Notable Projects</h2>
              <div className="projects-compact">
                <article className="card-base project-item">
                  <h3>E-Commerce Platform</h3>
                  <p>
                    Full-featured online store with payment integration and
                    admin dashboard
                  </p>
                  <span className="project-tech">
                    React • Node.js • Stripe • AWS
                  </span>
                </article>
                <article className="card-base project-item">
                  <h3>Analytics Dashboard</h3>
                  <p>
                    Real-time data visualization dashboard processing millions
                    of events
                  </p>
                  <span className="project-tech">
                    Next.js • GraphQL • D3.js • PostgreSQL
                  </span>
                </article>
                <article className="card-base project-item">
                  <h3>Design System</h3>
                  <p>
                    Component library and documentation site used across product
                    teams
                  </p>
                  <span className="project-tech">
                    React • Storybook • TypeScript
                  </span>
                </article>
              </div>
            </section>
          </div>

          {/* Experience Section */}
          <section className="cv-section experience-section">
            <h2>Experience</h2>

            <div className="experience-horizontal">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className={`card-base job-card ${
                    selected.job === index ? "active" : ""
                  }`}
                  onMouseEnter={() => setSelected(prev => ({ ...prev, job: index }))}
                >
                  <div className="job-title">
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                    <p className="period">{job.period}</p>
                  </div>
                  {/* Details hidden on screen, shown in print */}
                  <div className="job-card-print-details">
                    <AchievementList items={job.achievements} />
                  </div>
                </div>
              ))}
            </div>

            {/* Common details box below - only for screen */}
            <div className="job-details-box screen-only">
              <AchievementList items={jobs[selected.job].achievements} />
            </div>
          </section>

          {/* Skills Section */}
          <div className="section-shell">
            <section className="cv-section skills-section">
              <h2>Skills</h2>

              <div className="skills-horizontal">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`card-base skill-card ${
                      selected.skill === index ? "active" : ""
                    }`}
                    onMouseEnter={() => setSelected(prev => ({ ...prev, skill: index }))}
                  >
                    <h3>{skill.category}</h3>
                    <div className="skill-card-print-details">
                      <SkillList items={skill.technologies} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="skill-details-box screen-only">
                <SkillList items={skills[selected.skill].technologies} />
              </div>
            </section>
          </div>

        </main>

        <footer className="cv-footer"></footer>
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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
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
