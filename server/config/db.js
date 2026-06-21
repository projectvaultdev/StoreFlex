import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const useLocalDB = process.env.USE_LOCAL_DB === "true";

    const MONGO_URL = useLocalDB
      ? process.env.LOCAL_DB_URL
      : process.env.MONGODB_ATLAS_URL;

    const conn = await mongoose.connect(MONGO_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;