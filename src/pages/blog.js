import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import SemanticSearch from "../components/SemanticSearch"
import "../styles/blog.css"

// Topic clusters - group related tags under broader themes
const TOPIC_CLUSTERS = {
  "AI & Tools": ["ai", "claude-code", "llm", "developer-tools", "automation"],
  "Web Development": ["gatsby", "react", "typescript", "javascript", "graphql", "static-site-generators"],
  "Infrastructure": ["aws", "vpc", "networking", "infrastructure"],
  "Knowledge": ["productivity", "writing", "knowledge-management", "nlp"],
}

// Tags to exclude from display
const HIDDEN_TAGS = ["featured", "project"]

const BlogPage = ({ data }) => {
  const [activeCluster, setActiveCluster] = React.useState(null)
  const [activeTag, setActiveTag] = React.useState(null)

  // Filter out project posts
  const allPosts = React.useMemo(
    () => data.allMarkdownRemark.edges.filter(
      ({ node }) => !node.frontmatter.tags?.includes("project")
    ),
    [data.allMarkdownRemark.edges]
  )

  // Get all unique tags with counts (excluding hidden tags)
  const tagCounts = React.useMemo(() => {
    const counts = {}
    allPosts.forEach(({ node }) => {
      node.frontmatter.tags?.forEach(tag => {
        if (!HIDDEN_TAGS.includes(tag)) {
          counts[tag] = (counts[tag] || 0) + 1
        }
      })
    })
    return counts
  }, [allPosts])

  // Get cluster counts
  const clusterCounts = React.useMemo(() => {
    const counts = {}
    Object.entries(TOPIC_CLUSTERS).forEach(([cluster, clusterTags]) => {
      const postsInCluster = allPosts.filter(({ node }) =>
        node.frontmatter.tags?.some(tag => clusterTags.includes(tag))
      )
      counts[cluster] = postsInCluster.length
    })
    return counts
  }, [allPosts])

  // Filter posts based on active cluster or tag
  const filteredPosts = React.useMemo(() => {
    if (activeTag) {
      return allPosts.filter(({ node }) =>
        node.frontmatter.tags?.includes(activeTag)
      )
    }
    if (activeCluster) {
      const clusterTags = TOPIC_CLUSTERS[activeCluster]
      return allPosts.filter(({ node }) =>
        node.frontmatter.tags?.some(tag => clusterTags.includes(tag))
      )
    }
    return allPosts
  }, [allPosts, activeCluster, activeTag])

  // Get tags relevant to current view (for secondary filtering)
  const visibleTags = React.useMemo(() => {
    const tags = {}
    const postsToCount = activeCluster ? filteredPosts : allPosts
    postsToCount.forEach(({ node }) => {
      node.frontmatter.tags?.forEach(tag => {
        if (!HIDDEN_TAGS.includes(tag)) {
          tags[tag] = (tags[tag] || 0) + 1
        }
      })
    })
    // Sort by count descending
    return Object.entries(tags).sort((a, b) => b[1] - a[1])
  }, [allPosts, filteredPosts, activeCluster])

  const handleClusterClick = (cluster) => {
    if (activeCluster === cluster) {
      setActiveCluster(null)
    } else {
      setActiveCluster(cluster)
      setActiveTag(null) // Clear tag filter when switching clusters
    }
  }

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setActiveTag(null)
    } else {
      setActiveTag(tag)
      setActiveCluster(null) // Clear cluster filter when selecting a tag
    }
  }

  const clearFilters = () => {
    setActiveCluster(null)
    setActiveTag(null)
  }

  const hasActiveFilter = activeCluster || activeTag

  const [searchActive, setSearchActive] = React.useState(false)

  // Get random highlights (posts with quotes) - pick 3 random ones
  const highlights = React.useMemo(() => {
    const postsWithQuotes = allPosts.filter(({ node }) => node.frontmatter.quote)
    // Shuffle and take 3
    const shuffled = [...postsWithQuotes].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [allPosts])

  return (
    <Layout>
      <div className="blog-page">
        <h1 className="blog-page__title">Articles</h1>

        {/* Semantic Search */}
        <SemanticSearch onResultsChange={setSearchActive} />

        {/* Highlights Section - show when no search or filters active */}
        {!searchActive && !hasActiveFilter && highlights.length > 0 && (
          <section className="blog-highlights" aria-label="Article highlights">
            <h2 className="blog-highlights__title">Highlights</h2>
            <div className="blog-highlights__grid">
              {highlights.map(({ node }) => (
                <blockquote key={node.id} className="blog-highlight">
                  <p className="blog-highlight__quote">"{node.frontmatter.quote}"</p>
                  <footer className="blog-highlight__source">
                    <Link to={`/blog/${node.frontmatter.slug}`}>
                      {node.frontmatter.title}
                    </Link>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* Topic Clusters, Tag Filter, and Posts List - hide when search results are shown */}
        {!searchActive && (
          <>
            <nav className="blog-clusters" aria-label="Filter by topic">
              {Object.entries(TOPIC_CLUSTERS).map(([cluster, _]) => (
                clusterCounts[cluster] > 0 && (
                  <button
                    key={cluster}
                    className={`blog-cluster ${activeCluster === cluster ? "blog-cluster--active" : ""}`}
                    onClick={() => handleClusterClick(cluster)}
                    aria-pressed={activeCluster === cluster}
                  >
                    {cluster}
                    <span className="blog-cluster__count">{clusterCounts[cluster]}</span>
                  </button>
                )
              ))}
            </nav>

            {/* Tag Filter */}
            <div className="blog-tags-filter">
              {visibleTags.map(([tag, count]) => (
                <button
                  key={tag}
                  className={`blog-tag-filter ${activeTag === tag ? "blog-tag-filter--active" : ""}`}
                  onClick={() => handleTagClick(tag)}
                  aria-pressed={activeTag === tag}
                >
                  {tag}
                  <span className="blog-tag-filter__count">{count}</span>
                </button>
              ))}
            </div>

            {/* Active Filter Indicator */}
            {hasActiveFilter && (
              <div className="blog-filter-status">
                <span>
                  Showing {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
                  {activeCluster && ` in "${activeCluster}"`}
                  {activeTag && ` tagged "${activeTag}"`}
                </span>
                <button className="blog-filter-clear" onClick={clearFilters}>
                  Clear filter
                </button>
              </div>
            )}

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <p className="blog-page__empty">No posts match the current filter.</p>
            ) : (
              <div className="blog-post-list">
                {filteredPosts.map(({ node }) => (
                  <article key={node.id} className="blog-post-card">
                    <header>
                      <h2 className="blog-post-card__title">
                        <Link to={`/blog/${node.frontmatter.slug}`}>
                          {node.frontmatter.title}
                        </Link>
                      </h2>
                      <p className="blog-post-card__meta">
                        {node.frontmatter.date}
                      </p>
                    </header>

                    <p className="blog-post-card__excerpt">{node.excerpt}</p>

                    {/* Inline clickable tags */}
                    {node.frontmatter.tags && node.frontmatter.tags.length > 0 && (
                      <ul className="blog-post-card__tags">
                        {node.frontmatter.tags
                          .filter(tag => !HIDDEN_TAGS.includes(tag))
                          .map(tag => (
                            <li key={tag}>
                              <button
                                className={`blog-post-card__tag ${activeTag === tag ? "blog-post-card__tag--active" : ""}`}
                                onClick={() => handleTagClick(tag)}
                              >
                                {tag}
                              </button>
                            </li>
                          ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Articles" />

export default BlogPage

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { fileAbsolutePath: { regex: "/blog/" } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 200)
          timeToRead
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            slug
            tags
            quote
          }
        }
      }
    }
  }
`
