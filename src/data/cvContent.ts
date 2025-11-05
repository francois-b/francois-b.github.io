export type Job = {
  title: string
  company: string
  period: string
  achievements: string[]
}

export type Skill = {
  category: string
  technologies: string[]
}

export const jobs: Job[] = [
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

export const skills: Skill[] = [
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
