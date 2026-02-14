import axios from "axios";
import type { Movie } from "../types/movie"

interface FetchMoviesResult {
    page: number,
    results: Movie[],
    total_pages: number,
    total_results: number,
}

export interface MovieServiceProps {
    query: string;
    include_adult?: boolean;
    language?: string;
    primary_release_year?: string;
    page?: number;
    region?: string;
    year?: string;
}

interface MovieServiceResponse {
  results: Movie[],
  total_pages: number,
};

const myKey = import.meta.env.VITE_TMDB_TOKEN;

export default async function fetchMovies(params: MovieServiceProps): Promise<MovieServiceResponse> {
    const response = await axios.get<FetchMoviesResult>("https://api.themoviedb.org/3/search/movie", {
        params,
        headers: {
            Authorization: `Bearer ${myKey}`,
        }
    }
    );
    const { results, total_pages } = response.data;
    return {
        results,
        total_pages,
    };
};