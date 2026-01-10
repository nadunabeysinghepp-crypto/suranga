// const Service = require("../models/Service");
// const DeliveryArea = require("../models/DeliveryArea");
// const QuoteRequest = require("../models/QuoteRequest");
// const Review = require("../models/Review");
// const PortfolioItem = require("../models/PortfolioItem");
// const Settings = require("../models/Settings");

// /* helper: singleton */
// async function getOrCreateSettings() {
//   let s = await Settings.findOne();
//   if (!s) s = await Settings.create({});
//   return s;
// }

// /* ================= SERVICES ================= */
// exports.getServices = async (_req, res) => {
//   try {
//     const items = await Service.find({ active: true }).sort({ featured: -1, name: 1 });
//     return res.json(items);
//   } catch {
//     return res.status(500).json({ message: "Failed to load services" });
//   }
// };

// /* ================= DELIVERY AREAS ================= */
// exports.getDeliveryAreas = async (_req, res) => {
//   try {
//     const items = await DeliveryArea.find({ active: true, district: "Matale" }).sort({ area: 1 });
//     return res.json(items);
//   } catch {
//     return res.status(500).json({ message: "Failed to load delivery areas" });
//   }
// };

// /* ================= QUOTE REQUEST ================= */
// exports.createQuote = async (req, res) => {
//   try {
//     const body = req.body || {};
//     const {
//       customerName,
//       phone,
//       contactMethod,
//       serviceName,
//       quantity,
//       size,
//       color,
//       paper,
//       finishing,
//       notes,
//       fulfillment,
//       deliveryArea,
//       deliveryFeeLkr,
//     } = body;

//     if (!customerName || !phone || !serviceName) {
//       return res.status(400).json({ message: "customerName, phone, serviceName are required" });
//     }

//     const fulfillmentNorm = String(fulfillment || "Pickup").trim();
//     const isDelivery = fulfillmentNorm.toLowerCase() === "delivery";

//     // ✅ Quote files stored in /uploads/quotes/
//     const files = (req.files || []).map((f) => ({
//       filename: f.filename,
//       path: `/uploads/quotes/${f.filename}`,
//       mimetype: f.mimetype,
//       size: f.size,
//     }));

//     const doc = await QuoteRequest.create({
//       customerName: String(customerName).trim(),
//       phone: String(phone).trim(),
//       contactMethod: contactMethod ? String(contactMethod).trim() : "WhatsApp",
//       serviceName: String(serviceName).trim(),
//       quantity: Number(quantity || 1),
//       size: size || "",
//       color: color || "",
//       paper: paper || "",
//       finishing: finishing || "",
//       notes: notes || "",
//       fulfillment: isDelivery ? "Delivery" : "Pickup",
//       deliveryArea: isDelivery ? String(deliveryArea || "") : "",
//       deliveryFeeLkr: isDelivery ? Number(deliveryFeeLkr || 0) : 0,
//       files,
//     });

//     return res.status(201).json({ id: doc._id, message: "Quote request submitted" });
//   } catch (e) {
//     return res.status(400).json({ message: e?.message || "Quote request failed" });
//   }
// };

// /* ================= REVIEWS ================= */
// exports.getReviews = async (_req, res) => {
//   try {
//     const items = await Review.find({ approved: true }).sort({ featured: -1, createdAt: -1 });
//     return res.json(items);
//   } catch {
//     return res.status(500).json({ message: "Failed to load reviews" });
//   }
// };

// exports.createReview = async (req, res) => {
//   try {
//     const { name, rating, message } = req.body || {};

//     if (!name || rating == null || !message) {
//       return res.status(400).json({ message: "name, rating, message are required" });
//     }

//     const r = Number(rating);
//     if (Number.isNaN(r) || r < 1 || r > 5) {
//       return res.status(400).json({ message: "rating must be a number from 1 to 5" });
//     }

//     const doc = await Review.create({
//       name: String(name).trim(),
//       rating: r,
//       message: String(message).trim(),
//     });

//     return res.status(201).json({ id: doc._id, message: "Review submitted for approval" });
//   } catch (e) {
//     return res.status(400).json({ message: e?.message || "Review submit failed" });
//   }
// };

// /* ================= PORTFOLIO ================= */
// exports.getPortfolio = async (req, res) => {
//   try {
//     const { category } = req.query || {};
//     const filter = { active: true };
//     if (category && category !== "All") filter.category = category;

//     const items = await PortfolioItem.find(filter).sort({ featured: -1, createdAt: -1 });
//     return res.json(items);
//   } catch {
//     return res.status(500).json({ message: "Failed to load portfolio" });
//   }
// };

// /* ================= SETTINGS (PUBLIC) ================= */
// // ✅ GET /api/settings
// exports.getPublicSettings = async (_req, res) => {
//   try {
//     const s = await getOrCreateSettings();
//     return res.json(s);
//   } catch (e) {
//     return res.status(500).json({ message: e?.message || "Failed to load settings" });
//   }
// };
const Service = require("../models/Service");
const DeliveryArea = require("../models/DeliveryArea");
const QuoteRequest = require("../models/QuoteRequest");
const Review = require("../models/Review");
const PortfolioItem = require("../models/PortfolioItem");
const Settings = require("../models/Settings");

// ✅ BASE URL (production-safe)
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

/* helper: singleton */
async function getOrCreateSettings() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

/* ================= SERVICES ================= */
exports.getServices = async (_req, res) => {
  try {
    const items = await Service.find({ active: true }).sort({
      featured: -1,
      name: 1,
    });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Failed to load services" });
  }
};

/* ================= DELIVERY AREAS ================= */
exports.getDeliveryAreas = async (_req, res) => {
  try {
    const items = await DeliveryArea.find({
      active: true,
      district: "Matale",
    }).sort({ area: 1 });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Failed to load delivery areas" });
  }
};

/* ================= QUOTE REQUEST ================= */
exports.createQuote = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      customerName,
      phone,
      contactMethod,
      serviceName,
      quantity,
      size,
      color,
      paper,
      finishing,
      notes,
      fulfillment,
      deliveryArea,
      deliveryFeeLkr,
    } = body;

    if (!customerName || !phone || !serviceName) {
      return res
        .status(400)
        .json({ message: "customerName, phone, serviceName are required" });
    }

    const fulfillmentNorm = String(fulfillment || "Pickup").trim();
    const isDelivery = fulfillmentNorm.toLowerCase() === "delivery";

    // ✅ FIXED: FULL FILE URLs
    const files = (req.files || []).map((f) => ({
      filename: f.filename,
      url: `${BASE_URL}/uploads/quotes/${f.filename}`,
      mimetype: f.mimetype,
      size: f.size,
    }));

    const doc = await QuoteRequest.create({
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      contactMethod: contactMethod
        ? String(contactMethod).trim()
        : "WhatsApp",
      serviceName: String(serviceName).trim(),
      quantity: Number(quantity || 1),
      size: size || "",
      color: color || "",
      paper: paper || "",
      finishing: finishing || "",
      notes: notes || "",
      fulfillment: isDelivery ? "Delivery" : "Pickup",
      deliveryArea: isDelivery ? String(deliveryArea || "") : "",
      deliveryFeeLkr: isDelivery ? Number(deliveryFeeLkr || 0) : 0,
      files,
    });

    return res
      .status(201)
      .json({ id: doc._id, message: "Quote request submitted" });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e?.message || "Quote request failed" });
  }
};

/* ================= REVIEWS ================= */
exports.getReviews = async (_req, res) => {
  try {
    const items = await Review.find({ approved: true }).sort({
      featured: -1,
      createdAt: -1,
    });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Failed to load reviews" });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { name, rating, message } = req.body || {};

    if (!name || rating == null || !message) {
      return res
        .status(400)
        .json({ message: "name, rating, message are required" });
    }

    const r = Number(rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      return res
        .status(400)
        .json({ message: "rating must be a number from 1 to 5" });
    }

    const doc = await Review.create({
      name: String(name).trim(),
      rating: r,
      message: String(message).trim(),
    });

    return res
      .status(201)
      .json({ id: doc._id, message: "Review submitted for approval" });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e?.message || "Review submit failed" });
  }
};

/* ================= PORTFOLIO ================= */
exports.getPortfolio = async (req, res) => {
  try {
    const { category } = req.query || {};
    const filter = { active: true };
    if (category && category !== "All") filter.category = category;

    const items = await PortfolioItem.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    // ✅ FIXED: FULL IMAGE URL
    const withUrls = items.map((p) => ({
      ...p,
      imageUrl: p.image
        ? `${BASE_URL}/uploads/portfolio/${p.image}`
        : null,
    }));

    return res.json(withUrls);
  } catch {
    return res.status(500).json({ message: "Failed to load portfolio" });
  }
};

/* ================= SETTINGS (PUBLIC) ================= */
exports.getPublicSettings = async (_req, res) => {
  try {
    const s = await getOrCreateSettings();
    return res.json(s);
  } catch (e) {
    return res
      .status(500)
      .json({ message: e?.message || "Failed to load settings" });
  }
};
