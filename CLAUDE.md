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
tags: ["tag1", "tag2"]
type: "blog" | "project"  # Filters display location
author: "persona-name"    # Required when written by a persona
---
```

## Notes
- Video placeholder exists but actual video not yet implemented
- Project icons use theme-aware filtering (black in light mode, white in dark)
- Highlight styles use gradient underline effect

## Image Generation (MCP Gemini Server)

**MANDATORY: ASCII-First Workflow for Diagrams**

When generating technical diagrams via `mcp__gemini-image__generate_image`, you MUST follow this two-step process:

### Step 1: Create ASCII Diagram First
Before ANY image generation, create a detailed ASCII diagram that defines:
- Exact spatial layout and positioning of all elements
- All labels, text, and annotations
- Connection lines and arrows showing relationships
- Grouping boxes and boundaries

### Step 2: Prompt Gemini with ASCII + Style Instructions
Structure the prompt as:
```
[STYLE INSTRUCTIONS]
Brief description of visual style, colors, icon style.

[LAYOUT SPECIFICATION]
<paste ASCII diagram here>

[RENDERING RULES]
- Preserve exact spatial arrangement from ASCII
- Keep all labels exactly as written
- Use [specific icon style] for components
- [Color scheme instructions]
```

### Why This Matters
- Claude excels at conceptual layout and information architecture
- Gemini excels at visual rendering and aesthetics
- Letting Gemini decide layout produces inconsistent, often incorrect diagrams
- ASCII-first ensures the diagram accurately represents the intended architecture

### Example Prompt Structure
```
Professional AWS architecture diagram with official AWS icons.
Orange for compute, blue for networking, green for databases.
White background, clean lines.

LAYOUT (render this exactly):
┌─────────────────────────┐
│        VPC              │
│  ┌─────┐    ┌─────┐    │
│  │ EC2 │───▶│ RDS │    │
│  └─────┘    └─────┘    │
└─────────────────────────┘

Render as a polished diagram preserving this exact layout.
```

### Enforcement
This is a STRICT requirement. Never call `generate_image` for technical diagrams without first creating and including an ASCII layout in the prompt.
