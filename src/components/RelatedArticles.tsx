import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';

interface ArticleEmbedding {
  slug: string;
  title: string;
  embedding: number[];
}

interface RelatedArticle {
  slug: string;
  title: string;
  score: number;
}

// Cosine similarity for pre-normalized vectors
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

interface RelatedArticlesProps {
  currentSlug: string;
  maxArticles?: number;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentSlug,
  maxArticles = 5
}) => {
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndCompute = async () => {
      try {
        const response = await fetch('/embeddings.json');
        if (!response.ok) {
          throw new Error('Embeddings not available');
        }

        const articles: ArticleEmbedding[] = await response.json();
        const current = articles.find(a => a.slug === currentSlug);

        if (!current) {
          setLoading(false);
          return;
        }

        // Score all other articles by similarity
        const scored = articles
          .filter(a => a.slug !== currentSlug)
          .map(a => ({
            slug: a.slug,
            title: a.title,
            score: cosineSimilarity(current.embedding, a.embedding)
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, maxArticles);

        setRelated(scored);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load related articles');
        setLoading(false);
      }
    };

    fetchAndCompute();
  }, [currentSlug, maxArticles]);

  // Don't render anything if loading, error, or no related articles
  if (loading || error || related.length === 0) {
    return null;
  }

  return (
    <aside className="related-articles" aria-labelledby="related-articles-heading">
      <h3 id="related-articles-heading" className="related-articles__heading">
        Related Reading
      </h3>
      <ul className="related-articles__list">
        {related.map(article => (
          <li key={article.slug} className="related-articles__item">
            <Link
              to={`/blog/${article.slug}`}
              className="related-articles__link"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default RelatedArticles;
