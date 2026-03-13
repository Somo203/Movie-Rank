import mongoose from "mongoose";

// MongoDB URI from your .env.local
const MONGO_URI = process.env.MONGO_URI as string;

// Check for the URI
if (!MONGO_URI) {
  throw new Error(
    "❌ Please define the MONGO_URI environment variable inside .env.local"
  );
}

// Global cache object for hot-reloading in development
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// Main connection function
async function connectToDatabase() {
  if (cached.conn) {
    console.log("✅ MongoDB: Using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ MongoDB: Connecting...");
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: "moviereview", // Your database name
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB: Connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
