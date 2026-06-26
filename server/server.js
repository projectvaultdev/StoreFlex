import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.model.js";

import app from "./app.js";
import connectDB from "./config/db.js";

// Database Connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
