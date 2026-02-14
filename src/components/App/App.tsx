import css from './App.module.css'
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

/*API fetch*/
import fetchMovies from '../../services/movieService';

/*components*/
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

/*types*/
import type { Movie } from '../../types/movie';
import type { MovieServiceProps } from '../../services/movieService';


export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const handleAction = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };
  
  useEffect(() => {
  if (!query) return;

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);
    setMovies([]);

    try {
      const params: MovieServiceProps = { query, page };
      const moviesData = await fetchMovies(params);

      if (moviesData.results.length === 0) {
        toast.error('No movies found for your request.', {
          style: { fontFamily: 'Montserrat' },
        });
      } else {
        setMovies(moviesData.results);
      }

      if (moviesData.total_pages > 1) {
        setTotalPages(moviesData.total_pages);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

    fetchData();
  }, [query, page]);


  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const handleSelect = (movie: Movie) => {
    setCurrentMovie(movie);
  }

  const closeModal = () => {
    setCurrentMovie(null);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleAction} />
      {isLoading ? <Loader /> : isError ? <ErrorMessage /> : <MovieGrid movies={movies} onSelect={handleSelect} />}
      {currentMovie !== null && <MovieModal movie={currentMovie} onClose={closeModal} />}
      {totalPages > 1 && <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←" />
      }
    </>
  )
};
