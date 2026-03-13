import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  username: string;
  stars: number;
  message: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    movieId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    moviePoster: { type: String, required: true },
    username: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
