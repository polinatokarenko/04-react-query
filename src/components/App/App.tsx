import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

/*API*/
import fetchMovies from '../../services/movieService';

/*components*/
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

/*types*/
import type { Movie } from '../../types/movie';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const handleAction = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const {
    data,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  useEffect(() => {
  if (isSuccess && movies.length === 0) {
    toast.error('No movies found for your request.', {
      style: { fontFamily: 'Montserrat' },
    });
    }
  }, [isSuccess, movies.length]);

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleAction} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setCurrentMovie(movie)}
        />
      )}

      {currentMovie && (
        <MovieModal
          movie={currentMovie}
          onClose={() => setCurrentMovie(null)}
        />
      )}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </>
  );
}