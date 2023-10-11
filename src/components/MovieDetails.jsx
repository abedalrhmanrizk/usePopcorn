import React, { useState } from 'react';
import StarRating from './StarRating';
import { useKey } from '../hooks/useKey';
import { Loader } from './Loader';

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatch,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const countRef = React.useRef(0);

  React.useEffect(() => {
    if (userRating) {
      countRef.current += 1;
    }
  }, [userRating]);

  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    imdbRating,
    Released: released,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef,
    };

    onAddWatch(newWatchedMovie);
    onCloseMovie();
  }
  React.useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=dc4ffd1c&i=${selectedId}`
      );
      const date = await res.json();
      setMovie(date);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selectedId]);

  React.useEffect(() => {
    if (!title) return;
    document.title = `Movie || ${title}`;

    return () => (document.title = 'usePopcorn');
  }, [title]);

  useKey('Escape', onCloseMovie);

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />

            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    defaultRating={5}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating}{' '}
                  <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
