// /models/User.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  profileImage?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ✅ Match this with API key
  profileImage: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
