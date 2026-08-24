import mongoose from "mongoose";

export let usingMemoryDb = process.env.USE_MEMORY_DB === "true";

export const connectDB = async () => {
  if (usingMemoryDb) {
    console.log("Using in-memory development store");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.log("Falling back to in-memory development store");
    usingMemoryDb = true;
  }
};
