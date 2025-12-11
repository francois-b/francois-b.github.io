# CV Website - Claude Code Reference

## Project Overview
Personal CV/portfolio website for Francois Bouet built with Gatsby 5 (React-based static site generator).

## Tech Stack
- **Framework**: Gatsby 5.14
- **Language**: TypeScript + JavaScript (mixed)
- **Styling**: Plain CSS (no CSS-in-JS or preprocessors)
- **Blog**: Markdown files with gatsby-transformer-remark
- **Code Highlighting**: PrismJS via gatsby-remark-prismjs

## Commands
```bash
npm run develop    # Start dev server (localhost:8000)
npm run build      # Production build to /public
npm run serve      # Serve production build locally
npm run clean      # Clear Gatsby cache (.cache, public)
npm run format     # Prettier formatting
```

## Deployment
- **Host**: GitHub Pages
- **Repo**: github.com/francois-b/francois-b.github.io
- **Auto-deploy**: Push to `master` triggers GitHub Actions workflow
- **Workflow**: `.github/workflows/deploy.yml`

## Project Structure
```
src/
├── blog/           # Markdown blog posts
├── components/     # React components
│   ├── layout.js   # Main layout wrapper
│   ├── SideMenu.tsx
│   ├── TimelineVideoPlayer.tsx
│   └── icons/      # SVG icon components
├── context/        # React context providers
├── data/
│   └── cvContent.ts  # Job history and skills data
├── images/         # Static images and SVGs
├── pages/
│   ├── index.tsx   # Main CV page (homepage)
│   ├── blog.js     # Blog listing page
│   ├── projects.js # Projects page
│   └── 404.js
├── styles/
│   ├── cv.css      # Main CV page styles (largest file)
│   ├── blog.css    # Blog-specific styles
│   ├── theme.css   # Theme variables
│   └── prism-theme.css  # Code syntax highlighting
├── templates/      # Gatsby page templates
└── types/          # TypeScript type definitions
```

## Key Files
- `src/pages/index.tsx` - Main CV page with all sections
- `src/styles/cv.css` - Primary stylesheet (~22KB, contains theme variables)
- `src/data/cvContent.ts` - Structured job/skills data
- `gatsby-config.js` - Site metadata and plugin configuration
- `gatsby-node.js` - Dynamic page generation (blog posts)

## Theming
Three themes available (defined in cv.css):
- `theme-sun` - Light theme (amber/yellow accents)
- `theme-night` - Dark theme
- `theme-rain` - Alternative light theme

CSS variables used throughout:
- `--color-bg`, `--color-text`, `--color-border`
- `--highlight-engineering`, `--highlight-ai`, `--highlight-domain`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

## Blog Posts
Markdown files in `src/blog/` with frontmatter:
```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
slug: "url-slug"
excerpt: "Short description"
type: "blog" | "project"  # Filters display location
---
```

## Notes
- Video placeholder exists but actual video not yet implemented
- Project icons use theme-aware filtering (black in light mode, white in dark)
- Highlight styles use gradient underline effect
