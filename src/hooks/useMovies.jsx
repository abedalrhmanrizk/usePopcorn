import React from 'react';

export function useMovies(query, callback) {
  const [movies, setMovies] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    callback?.();
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=dc4ffd1c&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error(
            'Something went wrong with fetching movies'
          );

        const data = await res.json();
        if (data.Response === 'False')
          throw new Error('Movie not found');

        setMovies(data.Search);
        setError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovies();

    return () => controller.abort();
  }, [query]);
  return { movies, isLoading, error };
}
