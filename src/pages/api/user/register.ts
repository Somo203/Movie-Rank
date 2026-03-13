import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connectToDatabase();

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already taken" });
    }

    // Hash the password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = await User.create({
      username,
      email,
      passwordHash,
    });

    return res.status(201).json({ message: "User registered", user: { username: newUser.username, email: newUser.email } });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
