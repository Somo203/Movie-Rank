import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/mongodb";
import Review from "../../../models/Review";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connectToDatabase();
    const { movieId, username, stars, message } = req.body;

    // Fetch movie details from OMDB
    const OMDB_API_KEY = "1e06618";
    const omdbRes = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${OMDB_API_KEY}`);
    const omdbData = await omdbRes.json();

    if (omdbData.Response !== "True") {
      return res.status(400).json({ message: "Movie not found in OMDB." });
    }

    const movieTitle = omdbData.Title || "Unknown Title";
    const moviePoster = omdbData.Poster !== "N/A" ? omdbData.Poster : "/assets/no-poster.png";

    // Save review with title and poster
    const review = await Review.create({
      movieId,
      movieTitle,
      moviePoster,
      username,
      stars,
      message,
    });

    return res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
