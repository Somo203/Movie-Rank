// /pages/api/auth/signup.ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end(); // Method Not Allowed

  try {
    await connectToDatabase();

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already taken" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: passwordHash, // ✅ Correct key
      profileImage: "/assets/profile.jpg", // Optional: default image
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { username: newUser.username, email: newUser.email },
    });

  } catch (error: any) {
    console.error("Signup error details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
