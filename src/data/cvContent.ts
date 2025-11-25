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
  }
]
