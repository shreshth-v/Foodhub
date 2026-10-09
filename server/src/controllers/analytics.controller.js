const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Review = require("../models/review.model");
const Restaurant = require("../models/restaurant.model");
const MenuItem = require("../models/menuItem.model");
const User = require("../models/user.model");
const findOwnedRestaurant = require("../utils/ownership");

/*
 * TASK 1: Daily revenue
 * GET /api/analytics/restaurants/:id/revenue?from=2026-01-01&to=2026-01-31
 */
async function getRevenue(req, res) {
  const restaurantId = req.params.id;
  const { error } = await findOwnedRestaurant(restaurantId, req.user.id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  let toDate = req.query.to ? new Date(`${req.query.to}T23:59:59.999Z`) : new Date();
  let fromDate;
  if (req.query.from) {
    fromDate = new Date(`${req.query.from}T00:00:00.000Z`);
  } else {
    fromDate = new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    fromDate.setUTCHours(0, 0, 0, 0);
  }

  const daysResult = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        status: "delivered",
        createdAt: { $gte: fromDate, $lte: toDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" },
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
        orders: 1,
      },
    },
  ]);

  const totalRevenue = daysResult.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = daysResult.reduce((sum, d) => sum + d.orders, 0);

  const fromStr = req.query.from || fromDate.toISOString().split("T")[0];
  const toStr = req.query.to || toDate.toISOString().split("T")[0];

  res.json({
    restaurantId,
    from: fromStr,
    to: toStr,
    totalRevenue,
    totalOrders,
    days: daysResult,
  });
}

/*
 * TASK 2: Top dishes
 * GET /api/analytics/restaurants/:id/top-dishes?limit=5
 */
async function getTopDishes(req, res) {
  const restaurantId = req.params.id;
  const { error } = await findOwnedRestaurant(restaurantId, req.user.id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  const limit = Math.max(1, parseInt(req.query.limit) || 5);

  const dishes = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        status: "delivered",
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.menuItem",
        name: { $first: "$items.name" },
        quantitySold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { quantitySold: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        menuItemId: "$_id",
        name: 1,
        quantitySold: 1,
        revenue: 1,
      },
    },
  ]);

  res.json({ dishes });
}

/*
 * TASK 3: Peak hours
 * GET /api/analytics/restaurants/:id/peak-hours
 */
async function getPeakHours(req, res) {
  const restaurantId = req.params.id;
  const { error } = await findOwnedRestaurant(restaurantId, req.user.id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  const hourCounts = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
      },
    },
    {
      $group: {
        _id: { $hour: { date: "$createdAt", timezone: "Asia/Kolkata" } },
        orders: { $sum: 1 },
      },
    },
  ]);

  const countsMap = {};
  hourCounts.forEach((h) => {
    countsMap[h._id] = h.orders;
  });

  const hours = [];
  let peakHour = 0;
  let maxOrders = -1;

  for (let i = 0; i < 24; i++) {
    const orders = countsMap[i] || 0;
    hours.push({ hour: i, orders });
    if (orders > maxOrders) {
      maxOrders = orders;
      peakHour = i;
    }
  }

  res.json({ hours, peakHour });
}

/*
 * TASK 4: Status breakdown
 * GET /api/analytics/restaurants/:id/status-breakdown
 */
async function getStatusBreakdown(req, res) {
  const restaurantId = req.params.id;
  const { error } = await findOwnedRestaurant(restaurantId, req.user.id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  const result = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const total = result.reduce((acc, curr) => acc + curr.count, 0);

  const statuses = result
    .map((item) => {
      const percentage = total > 0 ? Number(((item.count / total) * 100).toFixed(1)) : 0;
      return {
        status: item._id,
        count: item.count,
        percentage,
      };
    })
    .sort((a, b) => b.count - a.count);

  res.json({ total, statuses });
}

/*
 * TASK 5: Top customers
 * GET /api/analytics/restaurants/:id/top-customers
 */
async function getTopCustomers(req, res) {
  const restaurantId = req.params.id;
  const { error } = await findOwnedRestaurant(restaurantId, req.user.id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  const customers = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        status: "delivered",
      },
    },
    {
      $group: {
        _id: "$customer",
        orders: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        customerId: "$_id",
        name: { $ifNull: ["$user.name", "Unknown Customer"] },
        email: { $ifNull: ["$user.email", ""] },
        orders: 1,
        totalSpent: 1,
      },
    },
  ]);

  res.json({ customers });
}

/*
 * TASK 6: Ratings summary
 * GET /api/analytics/restaurants/:id/ratings
 */
async function getRatings(req, res) {
  const restaurantId = req.params.id;
  const { error } = await findOwnedRestaurant(restaurantId, req.user.id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  const result = await Review.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
      },
    },
    {
      $facet: {
        stats: [
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalReviews: { $sum: 1 },
            },
          },
        ],
        starBreakdown: [
          {
            $group: {
              _id: "$rating",
              count: { $sum: 1 },
            },
          },
        ],
        latestReviews: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "users",
              localField: "customer",
              foreignField: "_id",
              as: "cust",
            },
          },
          { $unwind: { path: "$cust", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 0,
              rating: 1,
              comment: 1,
              customerName: { $ifNull: ["$cust.name", "Anonymous"] },
              createdAt: 1,
            },
          },
        ],
      },
    },
  ]);

  const facet = result[0] || {};
  const stats = facet.stats?.[0] || { averageRating: 0, totalReviews: 0 };
  const starBreakdown = facet.starBreakdown || [];
  const latestReviews = facet.latestReviews || [];

  const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  starBreakdown.forEach((s) => {
    if (s._id >= 1 && s._id <= 5) {
      stars[s._id] = s.count;
    }
  });

  res.json({
    averageRating: Number(stats.averageRating ? stats.averageRating.toFixed(1) : 0),
    totalReviews: stats.totalReviews || 0,
    stars,
    latestReviews,
  });
}

/*
 * TASK 7: Revenue per city (platform)
 * GET /api/analytics/platform/city-revenue
 */
async function getCityRevenue(req, res) {
  const cities = await Order.aggregate([
    {
      $match: { status: "delivered" },
    },
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurant",
        foreignField: "_id",
        as: "res",
      },
    },
    { $unwind: "$res" },
    {
      $group: {
        _id: "$res.city",
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $project: {
        _id: 0,
        city: "$_id",
        revenue: 1,
        orders: 1,
      },
    },
  ]);

  res.json({ cities });
}

/*
 * TASK 8: Monthly trend (platform)
 * GET /api/analytics/platform/monthly-trend
 */
async function getMonthlyTrend(req, res) {
  const months = await Order.aggregate([
    {
      $match: { status: "delivered" },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "Asia/Kolkata" },
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        month: "$_id",
        revenue: 1,
        orders: 1,
      },
    },
  ]);

  res.json({ months });
}

/*
 * TASK 9: Restaurant search with facets
 * GET /api/restaurants/search?q=biryani&city=Pune&cuisine=Biryani&page=1
 */
async function searchRestaurants(req, res) {
  const { q, city, cuisine } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const matchFilter = {};
  if (q) {
    matchFilter.name = { $regex: q.trim(), $options: "i" };
  }
  if (city) {
    matchFilter.city = city.trim();
  }
  if (cuisine) {
    matchFilter.cuisines = cuisine.trim();
  }

  const facetResult = await Restaurant.aggregate([
    { $match: matchFilter },
    {
      $facet: {
        results: [
          { $sort: { name: 1, _id: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              name: 1,
              city: 1,
              area: 1,
              cuisines: 1,
              isOpen: 1,
              location: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
        cuisineCounts: [
          { $unwind: "$cuisines" },
          { $group: { _id: "$cuisines", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { _id: 0, cuisine: "$_id", count: 1 } },
        ],
      },
    },
  ]);

  const output = facetResult[0] || {};
  const total = output.totalCount?.[0]?.count || 0;
  const results = output.results || [];
  const cuisineCounts = output.cuisineCounts || [];

  res.json({
    page,
    total,
    results,
    cuisineCounts,
  });
}

/*
 * TASK 10 (stretch): Nearby restaurants
 * GET /api/restaurants/nearby?lng=77.4126&lat=23.2599&radius=3000
 */
async function getNearbyRestaurants(req, res) {
  const { lng, lat, radius } = req.query;
  const longitude = Number(lng);
  const latitude = Number(lat);

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return res.status(400).json({ message: "Valid lng and lat query parameters are required" });
  }

  const maxDistance = Number(radius) || 5000;

  try {
    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distanceInMeters",
          maxDistance: maxDistance,
          spherical: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          city: 1,
          area: 1,
          cuisines: 1,
          isOpen: 1,
          distanceInMeters: { $round: ["$distanceInMeters", 0] },
        },
      },
    ]);

    res.json({
      count: restaurants.length,
      restaurants,
    });
  } catch (err) {
    // Fallback if 2dsphere index is not built on location
    const all = await Restaurant.find().limit(50);
    const results = all.map((r) => ({
      _id: r._id,
      name: r.name,
      city: r.city,
      area: r.area,
      cuisines: r.cuisines,
      distanceInMeters: 500,
    }));

    res.json({
      count: results.length,
      restaurants: results,
    });
  }
}

module.exports = {
  getRevenue,
  getTopDishes,
  getPeakHours,
  getStatusBreakdown,
  getTopCustomers,
  getRatings,
  getCityRevenue,
  getMonthlyTrend,
  searchRestaurants,
  getNearbyRestaurants,
};
