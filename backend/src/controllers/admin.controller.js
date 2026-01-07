const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const AdminUser = require("../models/AdminUser");
const Service = require("../models/Service");
const DeliveryArea = require("../models/DeliveryArea");
const QuoteRequest = require("../models/QuoteRequest");
const Review = require("../models/Review");

// ✅ FIX: use PortfolioItem everywhere
const PortfolioItem = require("../models/PortfolioItem");

const Settings = require("../models/Settings");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ================= AUTH ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = (email || "").toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await AdminUser.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is missing in .env" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, email: user.email, role: user.role });
  } catch {
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ================= SERVICES ================= */
exports.adminGetServices = async (_req, res) => {
  try {
    const items = await Service.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Failed to load services" });
  }
};

exports.adminCreateService = async (req, res) => {
  try {
    const doc = await Service.create(req.body || {});
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(400).json({ message: e?.message || "Create service failed" });
  }
};

exports.adminUpdateService = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await Service.findByIdAndUpdate(req.params.id, req.body || {}, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e?.message || "Update service failed" });
  }
};

exports.adminDeleteService = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await Service.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted" });
  } catch {
    return res.status(500).json({ message: "Delete service failed" });
  }
};

/* ================= DELIVERY AREAS ================= */
exports.adminGetDeliveryAreas = async (_req, res) => {
  try {
    const items = await DeliveryArea.find({ district: "Matale" }).sort({ area: 1 });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Failed to load delivery areas" });
  }
};

exports.adminCreateDeliveryArea = async (req, res) => {
  try {
    const payload = { ...(req.body || {}), district: "Matale" };
    const doc = await DeliveryArea.create(payload);
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(400).json({ message: e?.message || "Create delivery area failed" });
  }
};

exports.adminUpdateDeliveryArea = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await DeliveryArea.findByIdAndUpdate(req.params.id, req.body || {}, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e?.message || "Update delivery area failed" });
  }
};

exports.adminDeleteDeliveryArea = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await DeliveryArea.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted" });
  } catch {
    return res.status(500).json({ message: "Delete delivery area failed" });
  }
};

/* ================= QUOTES / ORDERS ================= */
exports.adminGetQuotes = async (req, res) => {
  try {
    const { status } = req.query || {};
    const filter = status ? { status } : {};
    const items = await QuoteRequest.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Failed to load quotes" });
  }
};

exports.adminUpdateQuote = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const allowed = ["status", "adminNote", "deliveryFeeLkr"];
    const body = req.body || {};
    const patch = {};
    for (const k of allowed) if (k in body) patch[k] = body[k];

    const doc = await QuoteRequest.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e?.message || "Update quote failed" });
  }
};

/* ================= REVIEWS ================= */
exports.adminGetReviews = async (_req, res) => {
  try {
    const items = await Review.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Failed to load reviews" });
  }
};

exports.adminUpdateReview = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const allowed = ["approved", "featured"];
    const body = req.body || {};
    const patch = {};
    for (const k of allowed) if (k in body) patch[k] = body[k];

    const doc = await Review.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e?.message || "Update review failed" });
  }
};

exports.adminDeleteReview = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await Review.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted" });
  } catch {
    return res.status(500).json({ message: "Delete review failed" });
  }
};

/* ================= PORTFOLIO (PortfolioItem) ================= */
exports.adminGetPortfolio = async (_req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Failed to load portfolio" });
  }
};

exports.adminCreatePortfolio = async (req, res) => {
  try {
    const { title, category, tag, description, featured, active } = req.body || {};
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const imageUrl = `/uploads/portfolio/${req.file.filename}`;

    const doc = await PortfolioItem.create({
      title: String(title).trim(),
      category: category ? String(category).trim() : "General",
      tag: tag ? String(tag).trim() : "",
      description: description ? String(description).trim() : "",
      imageUrl,
      featured: String(featured) === "true",
      active: String(active) !== "false",
    });

    return res.status(201).json(doc);
  } catch (e) {
    return res.status(400).json({ message: e?.message || "Save failed" });
  }
};

exports.adminDeletePortfolio = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await PortfolioItem.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    if (doc.imageUrl) {
      const rel = doc.imageUrl.replace(/^\//, "");
      const filePath = path.resolve(process.cwd(), rel);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }
    }

    await doc.deleteOne();
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ message: "Delete failed" });
  }
};

/* ================= SETTINGS ================= */

// helper: create singleton settings doc if missing
async function getOrCreateSettings() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

// ✅ ADMIN read settings
// GET /api/admin/settings
exports.adminGetSettings = async (_req, res) => {
  try {
    const s = await getOrCreateSettings();
    return res.json(s);
  } catch (e) {
    return res.status(500).json({ message: e?.message || "Failed to load settings" });
  }
};

// ✅ ADMIN update settings (safe + normalized + social links)
// PUT /api/admin/settings
exports.adminUpdateSettings = async (req, res) => {
  try {
    const body = req.body || {};
    const s = await getOrCreateSettings();

    const cleanDigits = (v) => String(v || "").replace(/\D/g, "");
    const cleanStr = (v) => String(v ?? "").trim();

    // Allow only these fields from frontend
    const allowed = [
      "shopName",
      "phone",
      "whatsapp",
      "address",
      "hoursMonSat",
      "hoursSunday",
      "social",
    ];

    const patch = {};
    for (const k of allowed) {
      if (k in body) patch[k] = body[k];
    }

    // normalize root fields
    if ("shopName" in patch) patch.shopName = cleanStr(patch.shopName);
    if ("address" in patch) patch.address = cleanStr(patch.address);
    if ("hoursMonSat" in patch) patch.hoursMonSat = cleanStr(patch.hoursMonSat);
    if ("hoursSunday" in patch) patch.hoursSunday = cleanStr(patch.hoursSunday);

    if ("phone" in patch) patch.phone = cleanDigits(patch.phone);
    if ("whatsapp" in patch) patch.whatsapp = cleanDigits(patch.whatsapp);

    // normalize social links (object)
    if ("social" in patch) {
      const social = patch.social || {};
      patch.social = {
        facebook: cleanStr(social.facebook),
        instagram: cleanStr(social.instagram),
        twitter: cleanStr(social.twitter),
        youtube: cleanStr(social.youtube),
        tiktok: cleanStr(social.tiktok),
        website: cleanStr(social.website),
      };
    }

    const updated = await Settings.findByIdAndUpdate(s._id, patch, {
      new: true,
      runValidators: true,
    });

    return res.json({ message: "Settings saved", settings: updated });
  } catch (e) {
    return res.status(400).json({ message: e?.message || "Update failed" });
  }
};
