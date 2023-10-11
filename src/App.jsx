import React from 'react';

import { MovieList } from './components/MovieList';
import { MovieDetails } from './components/MovieDetails';
import { WatchedSummary } from './components/WatchedSummary';
import { WatchedMoviesList } from './components/WatchedMoviesList';
import { Box } from './components/Box';
import { Search } from './components/Search';
import { Main } from './components/Main';
import { NumResults } from './components/NumResults';
import { NavBar } from './components/NavBar';
import { ErrorMessage } from './components/ErrorMessage';
import { Loader } from './components/Loader';

import { useMovies } from './hooks/useMovies';
import { useLocalStorageState } from './hooks/useLocalStorage';

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);
  const { movies, isLoading, error } = useMovies(
    query,
    handleCloseMovie
  );

  const [watched, setWatched] = useLocalStorageState([], 'watched');

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== id)
    );
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectedId}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatch={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteMovie={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
