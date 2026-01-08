// backend/src/server.js
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("./config/db");
const seedServices = require("./utils/seedServices");
const AdminUser = require("./models/AdminUser");

const publicRoutes = require("./routes/public.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

/* -------------------- CORS (FIXED FOR NETLIFY + JWT) --------------------
   ✅ Allows your Netlify frontend domains
   ✅ Handles preflight (OPTIONS) properly
   ✅ Allows Authorization header (needed for admin)
------------------------------------------------------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // ✅ Your Netlify domains
  "https://surangaprinters.netlify.app",
  "https://singular-stroopwafel-854996.netlify.app",
];

// Optional override from Render env
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Postman/curl have no origin
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Ensure preflight always returns properly
app.options("*", cors());

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

/* -------------------- STATIC UPLOADS -------------------- */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* -------------------- ROUTES -------------------- */
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.json({ status: "Backend running OK 🚀" });
});

/* -------------------- 404 -------------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: err.message || "Server error" });
});

/* -------------------- ADMIN SEED -------------------- */
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const pass = process.env.ADMIN_PASSWORD;

  if (!email || !pass) {
    console.log("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD missing. Skipping admin seed.");
    return;
  }

  const exists = await AdminUser.findOne({ email });
  if (exists) {
    console.log("✅ Admin already exists:", email);
    return;
  }

  const hash = await bcrypt.hash(pass, 12);
  await AdminUser.create({ email, passwordHash: hash, role: "admin" });
  console.log("✅ Admin created:", email);
}

/* -------------------- START SERVER -------------------- */
async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
    await connectDB(process.env.MONGO_URI);

    await ensureAdmin();
    await seedServices();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log("✅ Backend running on port", PORT);
      console.log("✅ Allowed origins:", allowedOrigins);
    });
  } catch (e) {
    console.error("❌ Server failed:", e.message);
    process.exit(1);
  }
}

start();
