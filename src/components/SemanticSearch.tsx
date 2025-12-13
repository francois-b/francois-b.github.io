import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'gatsby';

interface ArticleEmbedding {
  slug: string;
  title: string;
  embedding: number[];
}

interface SearchResult {
  slug: string;
  title: string;
  score: number;
}

// Cosine similarity for pre-normalized vectors
function cosineSimilarity(a: number[] | Float32Array, b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

interface SemanticSearchProps {
  onResultsChange?: (hasResults: boolean) => void;
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({ onResultsChange }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [embeddings, setEmbeddings] = useState<ArticleEmbedding[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const embedderRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load embeddings on mount
  useEffect(() => {
    fetch('/embeddings.json')
      .then(r => r.json())
      .then(data => setEmbeddings(data))
      .catch(() => setError('Could not load article embeddings'));
  }, []);

  // Load the embedding model (lazy, on first search or focus)
  const loadEmbedder = useCallback(async () => {
    if (embedderRef.current) return embedderRef.current;

    setModelLoading(true);
    try {
      const transformers = await import('@xenova/transformers');

      // Configure environment for browser usage
      transformers.env.allowLocalModels = false;
      transformers.env.useBrowserCache = true;

      embedderRef.current = await transformers.pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );
      setModelLoading(false);
      return embedderRef.current;
    } catch (err) {
      console.error('Model loading error:', err);
      setModelLoading(false);
      setError('Could not load search model');
      return null;
    }
  }, []);

  // Perform semantic search
  const search = useCallback(async () => {
    if (!query.trim() || !embeddings) return;

    setLoading(true);
    setError(null);

    try {
      const embedder = await loadEmbedder();
      if (!embedder) {
        setLoading(false);
        return;
      }

      // Embed the query
      const queryOutput = await embedder(query, {
        pooling: 'mean',
        normalize: true
      });

      // Score all articles
      const scored = embeddings.map(article => ({
        slug: article.slug,
        title: article.title,
        score: cosineSimilarity(queryOutput.data, article.embedding)
      }));

      // Sort by similarity and take top 10
      const topResults = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setResults(topResults);
      onResultsChange?.(topResults.length > 0);
    } catch (err) {
      setError('Search failed. Please try again.');
    }

    setLoading(false);
  }, [query, embeddings, loadEmbedder, onResultsChange]);

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      search();
    }
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    onResultsChange?.(false);
    inputRef.current?.focus();
  };

  // Pre-load model on focus (better UX - model loads while user types)
  const handleFocus = () => {
    if (!embedderRef.current && !modelLoading) {
      loadEmbedder();
    }
  };

  const hasResults = results.length > 0;
  const showClear = query.length > 0 || hasResults;

  return (
    <div className="semantic-search">
      <div className="semantic-search__input-wrapper">
        <input
          ref={inputRef}
          type="search"
          className="semantic-search__input"
          placeholder="Search by meaning... (e.g., 'how to think about AI and careers')"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          disabled={!embeddings}
          aria-label="Semantic search"
        />
        {showClear && (
          <button
            className="semantic-search__clear"
            onClick={clearSearch}
            aria-label="Clear search"
            type="button"
          >
            ×
          </button>
        )}
        <button
          className="semantic-search__button"
          onClick={search}
          disabled={loading || !query.trim() || !embeddings}
          type="button"
        >
          {loading || modelLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {modelLoading && (
        <p className="semantic-search__status">
          Loading search model (first time only)...
        </p>
      )}

      {error && (
        <p className="semantic-search__error">{error}</p>
      )}

      {hasResults && (
        <div className="semantic-search__results" role="region" aria-label="Search results">
          <div className="semantic-search__results-header">
            <span>Found {results.length} related articles</span>
            <button
              className="semantic-search__results-clear"
              onClick={clearSearch}
              type="button"
            >
              Clear
            </button>
          </div>
          <ul className="semantic-search__results-list">
            {results.map(result => (
              <li key={result.slug} className="semantic-search__result">
                <Link
                  to={`/blog/${result.slug}`}
                  className="semantic-search__result-link"
                >
                  {result.title}
                </Link>
                <span className="semantic-search__result-score">
                  {Math.round(result.score * 100)}% match
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;
