// pages/api/review/fetch.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Review from '../../../models/Review';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    await dbConnect();
    const reviews = await Review.find().sort({ createdAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      movieId: review.movieId,
      username: review.username,
      stars: review.stars,
      message: review.message,
      createdAt: review.createdAt,
      movieTitle: review.movieTitle || "Unknown Movie",
      moviePoster: review.moviePoster || "/assets/no-poster.png",
    }));

    return res.status(200).json({ reviews: formattedReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ error: "Failed to load reviews" });
  }
}
