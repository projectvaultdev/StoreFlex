import express from "express";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StoreFlex API Running..."
  });
});

app.use("/api/v1/auth", authRoutes);

export default app;