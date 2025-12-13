import * as React from "react"

interface Cluster {
  id: string
  label: string
  topTags: string[]
  articles: string[]
}

interface ClusterData {
  generated: string
  k: number
  silhouetteScore: number
  clusters: Cluster[]
}

interface TopicClustersProps {
  onClusterSelect: (clusterId: string | null) => void
  activeCluster: string | null
  articleSlugs?: string[] // Optional: filter to show only relevant clusters
}

export function TopicClusters({
  onClusterSelect,
  activeCluster,
  articleSlugs,
}: TopicClustersProps) {
  const [clusters, setClusters] = React.useState<Cluster[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch("/clusters.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load clusters")
        return r.json()
      })
      .then((data: ClusterData) => {
        setClusters(data.clusters)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load clusters:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Filter clusters to only show those with articles in the current view
  const visibleClusters = React.useMemo(() => {
    if (!articleSlugs) return clusters

    return clusters.filter((cluster) =>
      cluster.articles.some((slug) => articleSlugs.includes(slug))
    )
  }, [clusters, articleSlugs])

  // Get article count for each cluster (respecting any article filter)
  const clusterCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}

    visibleClusters.forEach((cluster) => {
      if (articleSlugs) {
        counts[cluster.id] = cluster.articles.filter((slug) =>
          articleSlugs.includes(slug)
        ).length
      } else {
        counts[cluster.id] = cluster.articles.length
      }
    })

    return counts
  }, [visibleClusters, articleSlugs])

  const handleClick = (clusterId: string) => {
    if (activeCluster === clusterId) {
      onClusterSelect(null)
    } else {
      onClusterSelect(clusterId)
    }
  }

  if (loading) {
    return (
      <nav className="blog-clusters" aria-label="Loading topic clusters">
        <span className="blog-clusters__loading">Loading topics...</span>
      </nav>
    )
  }

  if (error) {
    // Fallback: don't show clusters if loading failed
    return null
  }

  if (visibleClusters.length === 0) {
    return null
  }

  return (
    <nav className="blog-clusters" aria-label="Filter by topic">
      {visibleClusters.map((cluster) =>
        clusterCounts[cluster.id] > 0 ? (
          <button
            key={cluster.id}
            className={`blog-cluster ${
              activeCluster === cluster.id ? "blog-cluster--active" : ""
            }`}
            onClick={() => handleClick(cluster.id)}
            aria-pressed={activeCluster === cluster.id}
            title={`Articles about ${cluster.topTags.join(", ")}`}
          >
            {cluster.label}
            <span className="blog-cluster__count">
              {clusterCounts[cluster.id]}
            </span>
          </button>
        ) : null
      )}
    </nav>
  )
}

export default TopicClusters
