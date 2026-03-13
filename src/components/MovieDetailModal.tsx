"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface DetailedMovieData {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Genre: string;
  Plot: string;
  Type: string;
}

interface MovieDetailModalProps {
  movie?: DetailedMovieData | null;
  onClose: () => void;
}

export default function MovieDetailModal({ movie, onClose }: MovieDetailModalProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    if (movie) {
      setRating(0);
      setReviewText('');
      setSubmitMessage(null);
    }
  }, [movie]);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (!movie) return;

    const username = localStorage.getItem("username");
    if (!username) {
      setSubmitMessage("Please log in to submit a review.");
      return;
    }

    if (rating === 0) {
      setSubmitMessage("Please provide a star rating.");
      return;
    }

    try {
      const res = await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.imdbID,
          movieTitle: movie.Title,
          username,
          stars: rating,
          message: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setSubmitMessage("Review submitted successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Review submission failed:", error);
      setSubmitMessage("Failed to submit review.");
    }
  };

  if (!movie) return null;

  const posterSrc =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/assets/no-poster.png";

  const getCategory = (genre?: string, type?: string) => {
    if (genre) {
      if (genre.includes("Korean") || genre.includes("K-Drama") || genre.includes("Asia"))
        return "K-Drama";
      if (genre.includes("Chinese") || genre.includes("C-Drama")) return "C-Drama";
    }
    return "";
  };

  const category = getCategory(movie.Genre, movie.Type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="md:w-1/3 relative h-80 sm:h-96 md:h-auto md:min-h-[300px]">
            <Image
              src={posterSrc}
              alt={movie.Title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== "/assets/no-poster.png") {
                  target.src = "/assets/no-poster.png";
                }
              }}
            />
          </div>

          {/* Movie Details */}
          <div className="md:w-2/3 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">{movie.Title}</h2>
            <p className="text-gray-400 text-lg mb-1">Year: {movie.Year}</p>
            {movie.Genre && (
              <p className="text-gray-400 text-lg mb-1">Genre: {movie.Genre}</p>
            )}
            {category && (
              <p className="text-gray-400 text-lg mb-4">Category: {category}</p>
            )}
            <p className="text-gray-300 text-base mb-6 leading-relaxed">{movie.Plot}</p>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Your Rating:</h3>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`w-8 h-8 cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400"
                        : "text-gray-600 hover:text-yellow-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {submitMessage && (
                <p
                  className={`mt-2 text-sm ${
                    submitMessage.includes("success")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </div>

            {/* Review Textarea */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Write Your Review:</h3>
              <textarea
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white"
                rows={4}
                placeholder="Share your thoughts about the movie..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-md"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
