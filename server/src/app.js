const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const orderRoutes = require("./routes/order.routes");
const reviewRoutes = require("./routes/review.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.json({ message: "FoodHub API is running" });
});

app.use("/api/auth", authRoutes);

// Must come BEFORE restaurantRoutes, otherwise /api/restaurants/search
// would be caught by /api/restaurants/:id with id = "search".
app.use("/api", analyticsRoutes);

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
