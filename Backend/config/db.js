import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      tls: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongoose connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

export default mongoose;