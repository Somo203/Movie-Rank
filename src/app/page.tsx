"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageSlider from '../components/ImageSlider';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';

const OMDB_API_KEY = '1e06618';

interface MovieData {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  Genre: string;
  Plot: string;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams?.get('q') ?? '';

  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialSearchQuery);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);

  const sliderImages = [
    '/assets/is1.jpeg',
    '/assets/is2.jpg',
    '/assets/is3.jpg',
  ];

  const fetchMovies = useCallback(async (query: string, limitResults: number = 20) => {
    if (!query.trim()) {
      setMovies([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const maxPages = Math.ceil(limitResults / 10);
      const allSearchResults: any[] = [];

      for (let page = 1; page <= maxPages; page++) {
        const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}&type=movie&page=${page}`);
        const data = await res.json();

        if (data.Response === 'True' && data.Search) {
          allSearchResults.push(...data.Search);
        } else {
          break;
        }
      }

      const limitedResults = allSearchResults.slice(0, limitResults);
      const detailPromises = limitedResults.map(async (movie: { imdbID: string }) => {
        const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&plot=short&apikey=${OMDB_API_KEY}`);
        const data = await res.json();

        if (data.Response === 'True') {
          return {
            imdbID: data.imdbID,
            Title: data.Title,
            Year: data.Year,
            Poster: data.Poster,
            Type: data.Type,
            Genre: data.Genre,
            Plot: data.Plot,
          };
        }
        return null;
      });

      const detailedMovies = (await Promise.all(detailPromises)).filter(Boolean) as MovieData[];
      setMovies(detailedMovies);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch movies.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopularMovies = useCallback(async () => {
    const keywords = ['avengers', 'inception', 'joker', 'titanic', 'spiderman'];
    const allResults: MovieData[] = [];
    setLoading(true);
    setError(null);

    try {
      for (const keyword of keywords) {
        const res = await fetch(`https://www.omdbapi.com/?s=${keyword}&apikey=${OMDB_API_KEY}&type=movie&page=1`);
        const data = await res.json();
        if (data.Response === 'True' && data.Search) {
          const limited = data.Search.slice(0, 3);
          for (const movie of limited) {
            const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&plot=short&apikey=${OMDB_API_KEY}`);
            const detail = await res.json();
            if (detail.Response === 'True') {
              allResults.push({
                imdbID: detail.imdbID,
                Title: detail.Title,
                Year: detail.Year,
                Poster: detail.Poster,
                Type: detail.Type,
                Genre: detail.Genre,
                Plot: detail.Plot,
              });
            }
          }
        }
      }
      setMovies(allResults);
    } catch (err) {
      setError('Error loading popular movies.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialSearchQuery) {
      setCurrentSearchTerm(initialSearchQuery);
      fetchMovies(initialSearchQuery, 20);
    } else {
      setCurrentSearchTerm('');
      setError(null);
      fetchPopularMovies();
    }
  }, [initialSearchQuery, fetchMovies, fetchPopularMovies]);

  // Handle user clicking "Rate" button on MovieCard
  const handleRateClick = (movie: MovieData) => {
    setSelectedMovie(movie);
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Image Slider Section */}
      <section className="w-full">
        <ImageSlider images={sliderImages} interval={4000} />
      </section>

      {/* Main Content */}
      <main className="flex flex-col items-center p-8 max-w-7xl mx-auto w-full">
        {currentSearchTerm ? (
          <h1 className="text-4xl font-bold mb-6 mt-8 text-center">
            Search Results for "{currentSearchTerm}"
          </h1>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-6 mt-12 text-center text-orange-400">Welcome to MovieRank</h1>
            <p className="text-lg text-orange-300 mb-8 max-w-2xl text-center italic">
              Movie lovers&apos; hub for honest reviews and rankings.
            </p>
          </>
        )}

        {loading && <p className="text-center text-blue-400 text-xl py-8">Loading movies...</p>}
        {error && <p className="text-center text-red-400 text-xl py-8">{error}</p>}

        {movies.length > 0 && !loading && !error && (
          <section className="w-full mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onRate={() => handleRateClick(movie)}
                />
              ))}
            </div>
          </section>
        )}

        {!currentSearchTerm && movies.length === 0 && !loading && !error && (
          <p className="text-center text-gray-400 mt-8">No movies to display.</p>
        )}
      </main>

      {/* Movie Detail & Review Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={handleCloseModal}
      />
    </div>
  );
}
