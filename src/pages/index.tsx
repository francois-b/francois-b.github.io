import * as React from "react"
import { graphql, Link } from "gatsby"
import type { PageProps } from "gatsby"
import ReactPlayer from "react-player"
import ThemeToggle from "../components/ThemeToggle"
import projectAnalyticsImg from "../images/project-analytics.svg"
import projectDesignSystemImg from "../images/project-design-system.svg"
import projectStoreImg from "../images/project-store.svg"
import profileAvatar from "../images/yellow_profile.png"
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

const PapersAndBooksGraphic: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="32"
      y="52"
      width="156"
      height="132"
      rx="16"
      fill="currentColor"
      opacity="0.07"
    />
    <g opacity="0.85">
      <rect
        x="100"
        y="34"
        width="132"
        height="150"
        rx="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        transform="rotate(-6 166 109)"
      />
      <rect
        x="108"
        y="54"
        width="120"
        height="120"
        rx="10"
        fill="currentColor"
        opacity="0.2"
        transform="rotate(-6 168 114)"
      />
    </g>
    <g opacity="0.7">
      <rect
        x="70"
        y="38"
        width="132"
        height="150"
        rx="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        transform="rotate(8 136 113)"
      />
      <rect
        x="84"
        y="66"
        width="110"
        height="120"
        rx="10"
        fill="currentColor"
        opacity="0.18"
        transform="rotate(8 139 126)"
      />
    </g>
    <rect
      x="58"
      y="110"
      width="140"
      height="24"
      rx="6"
      fill="currentColor"
      opacity="0.35"
    />
    <path
      d="M72 122h108"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="12 10"
      opacity="0.6"
    />
    <rect
      x="210"
      y="70"
      width="52"
      height="140"
      rx="10"
      stroke="currentColor"
      strokeWidth="6"
    />
    <rect
      x="222"
      y="86"
      width="28"
      height="112"
      rx="6"
      fill="currentColor"
      opacity="0.3"
    />
    <path
      d="M216 96h40"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.7"
    />
    <path
      d="M216 112h40"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
)

const DiyToolsGraphic: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="28"
      y="34"
      width="264"
      height="168"
      rx="28"
      fill="currentColor"
      opacity="0.06"
    />
    <path
      d="M82 58l72 72"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
    <circle
      cx="82"
      cy="58"
      r="18"
      stroke="currentColor"
      strokeWidth="6"
      fill="none"
      opacity="0.7"
    />
    <circle cx="154" cy="130" r="14" fill="currentColor" opacity="0.3" />
    <rect
      x="162"
      y="92"
      width="24"
      height="72"
      rx="12"
      fill="currentColor"
      opacity="0.35"
    />
    <path d="M174 60l16 28h-32z" fill="currentColor" opacity="0.28" />
    <path
      d="M174 60v34"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle
      cx="232"
      cy="122"
      r="28"
      stroke="currentColor"
      strokeWidth="6"
      opacity="0.8"
    />
    <circle cx="232" cy="122" r="14" fill="currentColor" opacity="0.32" />
    <line
      x1="206"
      y1="150"
      x2="258"
      y2="150"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M122 170l-22 22"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
)

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

  const jobs = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Company Inc.",
      period: "2022 - Present",
      achievements: [
        "Led development of microservices architecture serving 1M+ daily active users",
        "Reduced application load time by 60% through performance optimization",
        "Mentored team of 4 junior developers in best practices and code review",
      ],
    },
    {
      title: "Full Stack Developer",
      company: "Digital Agency Ltd.",
      period: "2020 - 2022",
      achievements: [
        "Built 15+ responsive websites and web applications for diverse clients",
        "Integrated third-party APIs including Stripe, SendGrid, and AWS services",
        "Maintained 99.9% uptime across production applications",
      ],
    },
    {
      title: "Junior Web Developer",
      company: "Startup Innovations",
      period: "2019 - 2020",
      achievements: [
        "Developed interactive features using React and Redux",
        "Wrote unit and integration tests achieving 85% code coverage",
      ],
    },
    {
      title: "Frontend Developer",
      company: "Creative Studio",
      period: "2017 - 2019",
      achievements: [
        "Delivered accessible component libraries adopted across three product teams",
        "Collaborated with designers to prototype and ship interactive marketing experiences",
        "Optimized bundle size by 35% through code splitting and asset audits",
      ],
    },
    {
      title: "Web Developer",
      company: "Freelance",
      period: "2015 - 2017",
      achievements: [
        "Implemented custom CMS features for small business clients using Gatsby and Netlify",
        "Automated deployment pipelines to improve release cadence by 50%",
        "Provided long-term maintenance and analytics reporting for recurring customers",
      ],
    },
    {
      title: "Support Engineer",
      company: "Tech Support Co.",
      period: "2013 - 2015",
      achievements: [
        "Resolved complex customer issues, maintaining a 4.8/5 satisfaction score",
        "Documented troubleshooting playbooks adopted by the wider support organization",
        "Built internal dashboards to track response times and ticket volumes",
      ],
    },
  ]

  const skills = [
    {
      category: "Frontend",
      technologies: [
        "React, TypeScript, Next.js",
        "Gatsby, CSS/SASS, Tailwind",
        "Redux, React Query, Context API",
        "Responsive Design, Accessibility",
      ],
    },
    {
      category: "Backend",
      technologies: [
        "Node.js, Express, NestJS",
        "PostgreSQL, MongoDB, Redis",
        "GraphQL, REST APIs",
        "Authentication & Authorization",
      ],
    },
    {
      category: "Tools & DevOps",
      technologies: [
        "AWS, Docker, Kubernetes",
        "Git, CI/CD, GitHub Actions",
        "Jest, Testing Library, Cypress",
        "Webpack, Vite, Build Tools",
      ],
    },
  ]

  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  return (
    <div className="cv-container">
      {/* Print Button */}
      <div className="floating-controls">
        <button
          className="print-button"
          onClick={handlePrint}
          aria-label="Print CV"
          title="Print CV"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            style={{ height: "20px" }}
          >
            <rect
              x="8"
              y="4"
              width="16"
              height="6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="4"
              y="10"
              width="24"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="8"
              y="18"
              width="16"
              height="10"
              fill="currentColor"
              opacity="0.3"
            />
            <line
              x1="10"
              y1="21"
              x2="22"
              y2="21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="10"
              y1="24"
              x2="18"
              y2="24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <ThemeToggle />

        <div className="floating-contact-links">
          <a
            className="floating-icon"
            href="mailto:your.email@example.com"
            aria-label="Email"
            title="Email"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
              <polyline points="3 7 12 13 21 7" />
            </svg>
          </a>
          <a
            className="floating-icon"
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm.02 6H3v11h2V9.5Zm4 0H7v11h2v-6.1c0-1.63.7-2.4 2.06-2.4 1.26 0 1.94.86 1.94 2.4V20.5h2v-6.6c0-2.86-1.5-4.4-3.77-4.4-1.73 0-2.23.95-2.73 1.6V9.5Z" />
            </svg>
          </a>
        </div>
      </div>

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
            {/* <div className="profile-photo">
              <img
                src={profileAvatar}
                alt="Portrait of Your Name"
                loading="lazy"
              />
            </div> */}
          </div>

          <div className="contact-info">
            <a href="mailto:your.email@example.com">your.email@example.com</a>
            <span className="separator">•</span>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
            <span className="separator">•</span>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <span className="separator">•</span>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
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
