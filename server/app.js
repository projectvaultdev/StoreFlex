import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import recentlyViewedRoutes from "./routes/recentlyViewed.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StoreFlex API Running...",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/recently-viewed", recentlyViewedRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/admin", adminRoutes);

export default app;
