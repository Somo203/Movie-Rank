// pages/api/user/update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).end();

  await connectToDatabase();
  const { email, newUsername, newImage } = req.body;

  if (!email) return res.status(400).json({ message: "Missing user email" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (newUsername) user.username = newUsername;
    if (newImage) user.profileImage = newImage;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
