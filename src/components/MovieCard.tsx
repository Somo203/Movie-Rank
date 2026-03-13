// src/components/MovieCard.tsx
import Image from 'next/image';
import { useState } from 'react';

interface MovieCardProps {
  movie: {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
    Genre?: string;
    Plot?: string;
  };
  onRate?: () => void;  // Add optional onRate callback
}

export default function MovieCard({ movie, onRate }: MovieCardProps) {
  const [currentPosterSrc, setCurrentPosterSrc] = useState(
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : '/assets/no-poster.png'
  );
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (!imageError && currentPosterSrc !== '/assets/no-poster.png') {
      setCurrentPosterSrc('/assets/no-poster.png');
      setImageError(true);
    }
  };

  const getCategory = (genre?: string, type?: string) => {
    if (genre) {
      if (genre.includes('Korean') || genre.includes('K-Drama') || genre.includes('Asia'))
        return 'K-Drama';
      if (genre.includes('Chinese') || genre.includes('C-Drama')) return 'C-Drama';
    }
    return '';
  };

  const category = getCategory(movie.Genre, movie.Type);

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200 cursor-pointer">
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src={currentPosterSrc}
          alt={movie.Title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover rounded-t-lg"
          priority
          onError={handleImageError}
        />
        {movie.Type === 'series' && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            EP {movie.Year}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-md font-semibold text-white mb-1 truncate" title={movie.Title}>
          {movie.Title}
        </h3>
        {category && <p className="text-gray-400 text-xs mb-2">{category}</p>}

        {/* Call onRate when clicked */}
        <button
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-1.5 text-sm rounded-md transition duration-200"
          onClick={onRate}
        >
          Rate
        </button>
      </div>
    </div>
  );
}
