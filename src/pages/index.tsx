import * as React from "react"
import { graphql, Link } from "gatsby"
import type { PageProps } from "gatsby"
import FloatingControls from "../components/FloatingControls"
import DiyToolsGraphic from "../components/DiyToolsGraphic"
import PapersAndBooksGraphic from "../components/PapersAndBooksGraphic"
import EmailIcon from "../components/icons/EmailIcon"
import GitHubIcon from "../components/icons/GitHubIcon"
import LinkedInIcon from "../components/icons/LinkedInIcon"
import TimelineVideoPlayer from "../components/TimelineVideoPlayer"
import { jobs, skills } from "../data/cvContent"
import projectAnalyticsImg from "../images/project-analytics.svg"
import projectDesignSystemImg from "../images/project-design-system.svg"
import projectStoreImg from "../images/project-store.svg"
import summaryBackgroundImg from "../images/transparent_screen.png"
import timelineVideo from "../images/Timeline2.mp4"
import sideIntroImg from "../images/side_intro.svg"
import sideMattersImg from "../images/side_matters.svg"
import sideAiImg from "../images/side_ai.svg"
import "../styles/cv.css"

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
  const [selectedJob, setSelectedJob] = React.useState<number>(0)
  const [selectedSkill, setSelectedSkill] = React.useState<number>(0)
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
              <TimelineVideoPlayer src={timelineVideo} />
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
                    <article key={post.id} className="blog-card">
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

          {/* Experience Section */}
          <section className="cv-section experience-section">
            <h2>Experience</h2>

            <div className="experience-horizontal">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className={`job-card ${
                    selectedJob === index ? "active" : ""
                  }`}
                  onMouseEnter={() => setSelectedJob(index)}
                >
                  <div className="job-title">
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                    <p className="period">{job.period}</p>
                  </div>
                  {/* Details hidden on screen, shown in print */}
                  <div className="job-card-print-details">
                    <ul className="achievements">
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Common details box below - only for screen */}
            <div className="job-details-box screen-only">
              <ul className="achievements">
                {jobs[selectedJob].achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
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
                    className={`skill-card ${
                      selectedSkill === index ? "active" : ""
                    }`}
                    onMouseEnter={() => setSelectedSkill(index)}
                  >
                    <h3>{skill.category}</h3>
                    <div className="skill-card-print-details">
                      <ul className="skill-list">
                        {skill.technologies.map((tech, idx) => (
                          <li key={idx}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="skill-details-box screen-only">
                <ul className="skill-list">
                  {skills[selectedSkill].technologies.map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Projects Section */}
          <section className="cv-section projects-section">
            <h2>Notable Projects</h2>
            <div className="projects-compact">
              <article className="project-item">
                <div className="project-visual">
                  <img
                    src={projectStoreImg}
                    alt="Preview of the e-commerce platform"
                    loading="lazy"
                  />
                </div>
                <div className="project-content">
                  <h3>E-Commerce Platform</h3>
                  <p>
                    Full-featured online store with payment integration and
                    admin dashboard
                  </p>
                  <span className="project-tech">
                    React • Node.js • Stripe • AWS
                  </span>
                </div>
              </article>
              <article className="project-item">
                <div className="project-visual">
                  <img
                    src={projectAnalyticsImg}
                    alt="Analytics dashboard visual"
                    loading="lazy"
                  />
                </div>
                <div className="project-content">
                  <h3>Analytics Dashboard</h3>
                  <p>
                    Real-time data visualization dashboard processing millions
                    of events
                  </p>
                  <span className="project-tech">
                    Next.js • GraphQL • D3.js • PostgreSQL
                  </span>
                </div>
              </article>
              <article className="project-item">
                <div className="project-visual">
                  <img
                    src={projectDesignSystemImg}
                    alt="Design system components"
                    loading="lazy"
                  />
                </div>
                <div className="project-content">
                  <h3>Design System</h3>
                  <p>
                    Component library and documentation site used across product
                    teams
                  </p>
                  <span className="project-tech">
                    React • Storybook • TypeScript
                  </span>
                </div>
              </article>
            </div>
          </section>
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
