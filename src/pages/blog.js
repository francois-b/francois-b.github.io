import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import SemanticSearch from "../components/SemanticSearch"
import TopicClusters from "../components/TopicClusters"
import "../styles/blog.css"

// Tags to exclude from display
const HIDDEN_TAGS = ["featured", "project"]

const BlogPage = ({ data }) => {
  const [activeCluster, setActiveCluster] = React.useState(null)
  const [activeTags, setActiveTags] = React.useState([])
  const [clusters, setClusters] = React.useState([])

  // Load clusters on mount
  React.useEffect(() => {
    fetch("/clusters.json")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.clusters) {
          setClusters(data.clusters)
        }
      })
      .catch(() => {
        // Clusters will remain empty, filtering by cluster disabled
      })
  }, [])

  // Filter out project posts
  const allPosts = React.useMemo(
    () => data.allMarkdownRemark.edges.filter(
      ({ node }) => !node.frontmatter.tags?.includes("project")
    ),
    [data.allMarkdownRemark.edges]
  )

  // Get all slugs for TopicClusters component
  const allSlugs = React.useMemo(
    () => allPosts.map(({ node }) => node.frontmatter.slug),
    [allPosts]
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

  // Get active cluster data
  const activeClusterData = React.useMemo(() => {
    if (!activeCluster) return null
    return clusters.find(c => c.id === activeCluster)
  }, [activeCluster, clusters])

  // Filter posts based on active cluster or tags
  const filteredPosts = React.useMemo(() => {
    if (activeTags.length > 0) {
      return allPosts.filter(({ node }) =>
        activeTags.every(tag => node.frontmatter.tags?.includes(tag))
      )
    }
    if (activeClusterData) {
      return allPosts.filter(({ node }) =>
        activeClusterData.articles.includes(node.frontmatter.slug)
      )
    }
    return allPosts
  }, [allPosts, activeClusterData, activeTags])

  // Get all tags with counts from filtered posts
  const visibleTagCounts = React.useMemo(() => {
    const tags = {}
    filteredPosts.forEach(({ node }) => {
      node.frontmatter.tags?.forEach(tag => {
        if (!HIDDEN_TAGS.includes(tag)) {
          tags[tag] = (tags[tag] || 0) + 1
        }
      })
    })
    return tags
  }, [filteredPosts])

  // Build tag list: active tags first, then co-occurring tags, sorted by count
  const visibleTags = React.useMemo(() => {
    // When tags are selected, show active tags + co-occurring tags only
    if (activeTags.length > 0) {
      const result = []
      // Add active tags first
      activeTags.forEach(tag => {
        result.push([tag, visibleTagCounts[tag] || 0])
      })
      // Add co-occurring tags (sorted by count)
      Object.entries(visibleTagCounts)
        .filter(([tag]) => !activeTags.includes(tag))
        .sort((a, b) => b[1] - a[1])
        .forEach(([tag, count]) => {
          result.push([tag, count])
        })
      return result
    }
    // No active tags - show all tags sorted by count
    return Object.entries(tagCounts).sort((a, b) => b[1] - a[1])
  }, [activeTags, visibleTagCounts, tagCounts])

  // Get co-occurring tags (tags that appear with all active tags)
  const coOccurringTags = React.useMemo(() => {
    if (activeTags.length === 0) return new Set()
    return new Set(
      Object.keys(visibleTagCounts).filter(tag => !activeTags.includes(tag))
    )
  }, [visibleTagCounts, activeTags])

  const handleClusterClick = (cluster) => {
    if (activeCluster === cluster) {
      setActiveCluster(null)
    } else {
      setActiveCluster(cluster)
      setActiveTags([]) // Clear tag filter when switching clusters
    }
  }

  const handleTagClick = (tag) => {
    if (activeTags.includes(tag)) {
      // Remove tag from active tags
      setActiveTags(activeTags.filter(t => t !== tag))
    } else {
      // Add tag to active tags
      setActiveTags([...activeTags, tag])
      setActiveCluster(null) // Clear cluster filter when selecting tags
    }
  }

  const clearFilters = () => {
    setActiveCluster(null)
    setActiveTags([])
  }

  const hasActiveFilter = activeCluster || activeTags.length > 0

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
            <TopicClusters
              onClusterSelect={handleClusterClick}
              activeCluster={activeCluster}
              articleSlugs={allSlugs}
            />

            {/* Tag Filter */}
            <div className="blog-tags-filter">
              {visibleTags.map(([tag, count]) => {
                const isActive = activeTags.includes(tag)
                const isCoOccurring = coOccurringTags.has(tag)
                return (
                  <button
                    key={tag}
                    className={`blog-tag-filter ${isActive ? "blog-tag-filter--active" : ""} ${isCoOccurring ? "blog-tag-filter--co-occurring" : ""}`}
                    onClick={() => handleTagClick(tag)}
                    aria-pressed={isActive}
                  >
                    {tag}
                    <span className="blog-tag-filter__count">{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Active Filter Indicator */}
            {hasActiveFilter && (
              <div className="blog-filter-status">
                <span>
                  Showing {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
                  {activeClusterData && ` in "${activeClusterData.label}"`}
                  {activeTags.length > 0 && ` tagged "${activeTags.join(" + ")}"`}
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
                        {node.frontmatter.vimeoId && (
                          <span className="blog-post-card__media-icon" title="Has video">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </span>
                        )}
                        {node.frontmatter.hasAudio && (
                          <span className="blog-post-card__media-icon" title="Has audio">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                          </span>
                        )}
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
                                className={`blog-post-card__tag ${activeTags.includes(tag) ? "blog-post-card__tag--active" : ""}`}
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
            vimeoId
            hasAudio
          }
        }
      }
    }
  }
`
