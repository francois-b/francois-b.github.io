import * as React from "react"
import { graphql, Link } from "gatsby"
import type { PageProps } from "gatsby"
import ReactPlayer from "react-player"
import FloatingControls from "../components/FloatingControls"
import DiyToolsGraphic from "../components/DiyToolsGraphic"
import PapersAndBooksGraphic from "../components/PapersAndBooksGraphic"
import EmailIcon from "../components/icons/EmailIcon"
import GitHubIcon from "../components/icons/GitHubIcon"
import LinkedInIcon from "../components/icons/LinkedInIcon"
import { jobs, skills } from "../data/cvContent"
import projectAnalyticsImg from "../images/project-analytics.svg"
import projectDesignSystemImg from "../images/project-design-system.svg"
import projectStoreImg from "../images/project-store.svg"
import summaryBackgroundImg from "../images/transparent_screen.png"
import timelineVideo from "../images/Timeline2.mp4"
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

  const handlePrint = () => {
    window.print()
  }

  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  return (
    <div className="cv-container">
      <FloatingControls onPrintClick={handlePrint} />

      {/* Main Content */}
      <header className="cv-header">
        <div className="header-content">
          <div className="identity">
            <div className="identity-text">
              <h1 className="name">François Bouet</h1>
              <p className="title">
                Full Stack Developer & Creative Technologist
              </p>
            </div>
          </div>

          <div className="contact-info">
            <a
              className="contact-icon"
              href="mailto:your.email@example.com"
              aria-label="Email"
              title="Email"
            >
              <span className="sr-only">Email</span>
              <EmailIcon width={22} height={22} />
            </a>
            <a
              className="contact-icon"
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <span className="sr-only">LinkedIn</span>
              <LinkedInIcon width={22} height={22} />
            </a>
            <a
              className="contact-icon"
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <span className="sr-only">GitHub</span>
              <GitHubIcon width={22} height={22} />
            </a>
          </div>
        </div>
      </header>

      <main className="cv-main">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            marginBottom: "40px",
          }}
        >
          <div
            className="timeline-player"
            aria-label="Project timeline preview video"
            style={{
              width: "652px",
              height: "367px",
              position: "relative",
              overflow: "hidden",
              borderRadius: "16px",
            }}
          >
            <button
              type="button"
              className={`timeline-player__toggle ${
                isVideoPlaying ? "timeline-player__toggle--active" : ""
              }`}
              onClick={() => setIsVideoPlaying(prev => !prev)}
              aria-label={
                isVideoPlaying
                  ? "Pause timeline video"
                  : "Play timeline video"
              }
              aria-pressed={isVideoPlaying}
            >
              {isVideoPlaying ? (
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
                  <rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    d="M8 5.5v13l10-6.5-10-6.5Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <ReactPlayer
              src={timelineVideo}
              controls={false}
              playing={isVideoPlaying}
              width="100%"
              height="100%"
              preload
              className="timeline-player__embed"
              playsinline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
              fallback={<div className="timeline-player__fallback">Video not supported</div>}
            />
          </div>
          <div
            style={{
              width: "200px",
              flex: "0 0 200px",
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: "20px",
              msFlexDirection: "column",
              justifyItems: "center",
            }}
          >
            <div style={{ marginBottom: "30px" }}>Intro</div>
            <div style={{ marginBottom: "30px" }}>What matters</div>
            <div>AI literacy</div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="section-shell">
          <div
            className="section-parallax section-parallax--summary"
            aria-hidden="true"
          >
            <img src={summaryBackgroundImg} alt="" loading="lazy" />
          </div>

          <section className="cv-section summary-section">
            <p style={{ fontSize: "medium" }}>
              Passionate developer with 5+ years of experience building scalable
              web applications and crafting delightful user experiences.
              Specializing in modern JavaScript frameworks, cloud architecture,
              and design systems.
            </p>
          </section>
        </div>

        <div className="section-shell">
          <div
            className="section-parallax section-parallax--blog"
            aria-hidden="true"
          >
            <PapersAndBooksGraphic />
          </div>
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
                      <p className="blog-card-date">{post.frontmatter.date}</p>
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
                className={`job-card ${selectedJob === index ? "active" : ""}`}
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
          <div
            className="section-parallax section-parallax--skills"
            aria-hidden="true"
          >
            <DiyToolsGraphic />
          </div>
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
                  Full-featured online store with payment integration and admin
                  dashboard
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
                  Real-time data visualization dashboard processing millions of
                  events
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
  )
}

export const Head = () => (
  <>
    <title>Your Name - Full Stack Developer</title>
    <meta
      name="description"
      content="Professional CV of Your Name - Full Stack Developer & Creative Technologist"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap"
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
