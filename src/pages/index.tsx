import * as React from "react"
import { graphql, Link } from "gatsby"
import type { PageProps } from "gatsby"
import ThemeToggle from "../components/ThemeToggle"
import projectAnalyticsImg from "../images/project-analytics.svg"
import projectDesignSystemImg from "../images/project-design-system.svg"
import projectStoreImg from "../images/project-store.svg"
import profileAvatar from "../images/1690328982193.jpeg"
import "../styles/cv.css"

type BlogPostsQuery = {
  allMarkdownRemark: {
    nodes: Array<{
      id: string
      frontmatter: {
        title: string
        date: string
        slug: string
      }
      excerpt: string
    }>
  }
}

const CVPage: React.FC<PageProps<BlogPostsQuery>> = ({ data }) => {
  const [selectedJob, setSelectedJob] = React.useState<number>(0)
  const [selectedSkill, setSelectedSkill] = React.useState<number>(0)
  const posts = data.allMarkdownRemark.nodes

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

  return (
    <div className="cv-container">
      {/* Print Button */}
      <div style={{ display: "flex", justifyContent: "space-between" , alignItems: "center", padding: "1rem"}}>
        <button
          className="print-button"
          onClick={handlePrint}
          aria-label="Print CV"
          title="Print CV"
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
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
      </div>

      {/* Main Content */}
      <header className="cv-header">
        <div className="header-content">
          <div className="identity">
            <div className="profile-photo">
              <img
                src={profileAvatar}
                alt="Portrait of Your Name"
                loading="lazy"
              />
            </div>
            <div className="identity-text">
              <h1 className="name">Your Name</h1>
              <p className="title">
                Full Stack Developer & Creative Technologist
              </p>
            </div>
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
        {/* Summary Section */}
        <section className="cv-section summary-section">
          <h2>Summary</h2>
          <p className="summary-text">
            Passionate developer with 5+ years of experience building scalable
            web applications and crafting delightful user experiences.
            Specializing in modern JavaScript frameworks, cloud architecture,
            and design systems.
          </p>
        </section>

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
                {/* Details hidden on screen, shown in print */}
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

          {/* Common details box below - only for screen */}
          <div className="skill-details-box screen-only">
            <ul className="skill-list">
              {skills[selectedSkill].technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Education Section */}
        <section className="cv-section education-section">
          <h2>Education</h2>
          <div className="education-item">
            <h3>B.S. Computer Science</h3>
            <p className="institution">University Name</p>
            <p className="period">2015 - 2019</p>
            <p className="details">Honors • GPA: 3.8/4.0</p>
          </div>
        </section>

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

        <section className="cv-section blog-section">
          <h2>Latest Blog Posts</h2>
          {posts.length === 0 ? (
            <p className="summary-text">
              New articles are on the way. Please check back soon.
            </p>
          ) : (
            <div className="blog-list">
              {posts.map(post => (
                <article key={post.id} className="blog-card">
                  <header>
                    <p className="blog-card-date">{post.frontmatter.date}</p>
                    <h3>
                      <Link to={`/blog/${post.frontmatter.slug}`}>
                        {post.frontmatter.title}
                      </Link>
                    </h3>
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
      </main>

      <footer className="cv-footer">
        <p>References available upon request</p>
      </footer>
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
        }
        excerpt(pruneLength: 140)
      }
    }
  }
`

export default CVPage
