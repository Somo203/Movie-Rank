"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Review {
  _id: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  username: string;
  stars: number;
  message: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/review/fetch");
        const data = await res.json();
        setReviews(data.reviews);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 md:px-12 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-orange-400 text-center">
        Movie Reviews
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-900">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="px-6 py-4 text-left">Poster</th>
              <th className="px-6 py-4 text-left">Movie</th>
              <th className="px-6 py-4 text-left">Reviewer</th>
              <th className="px-6 py-4 text-left">Rating</th>
              <th className="px-6 py-4 text-left">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  No reviews yet.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-800 transition duration-200">
                  <td className="px-6 py-4">
                    <Image
                      src={review.moviePoster || "/assets/no-poster.png"}
                      alt={review.movieTitle}
                      width={60}
                      height={90}
                      className="rounded-md object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold">{review.movieTitle}</td>
                  <td className="px-6 py-4 text-sm text-orange-300">{review.username}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i <= review.stars ? "text-yellow-400" : "text-gray-600"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{review.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
