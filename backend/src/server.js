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

/* -------------------- CORS (UPDATED) --------------------
   ✅ Allows Netlify frontend + local dev
   ✅ Supports multiple domains (both your Netlify URLs)
   ✅ Optional: FRONTEND_URL or FRONTEND_URLS env (comma-separated)
--------------------------------------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // ✅ Your Netlify sites (IMPORTANT)
  "https://surangaprinters.netlify.app",
  "https://singular-stroopwafel-854996.netlify.app",
];

// Optional: allow setting custom domains from env (Render)
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.trim());
}

// Optional: allow multiple env domains comma-separated
// Example in Render: FRONTEND_URLS=https://surangaprinters.netlify.app,https://www.yourdomain.com
if (process.env.FRONTEND_URLS) {
  process.env.FRONTEND_URLS.split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((u) => allowedOrigins.push(u));
}

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Helpful for preflight in some environments
app.options("*", cors());

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

/* -------------------- STATIC UPLOADS --------------------
   Serves: /uploads/portfolio/xxx.jpg etc
-------------------------------------------------------- */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* -------------------- ROUTES -------------------- */
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

/* -------------------- ADMIN SEEDER -------------------- */
async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const pass = process.env.ADMIN_PASSWORD || "";

  if (!email || !pass) {
    console.log("⚠️ ADMIN_EMAIL / ADMIN_PASSWORD not set. Skipping admin creation.");
    return;
  }

  const exists = await AdminUser.findOne({ email });
  if (exists) {
    console.log("✅ Admin already exists:", email);
    return;
  }

  const passwordHash = await bcrypt.hash(pass, 12);
  await AdminUser.create({ email, passwordHash, role: "admin" });
  console.log("✅ Admin user created:", email);
}

/* -------------------- START SERVER -------------------- */
async function start() {
  try {
    console.log("🔄 Starting server...");

    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI is missing in environment variables");
      process.exit(1);
    }

    await connectDB(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await ensureAdmin();
    await seedServices();
    console.log("✅ Services seeded (if needed)");

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`✅ API running on port ${port}`);
      console.log(`✅ Uploads served from ${path.join(process.cwd(), "uploads")}`);
      console.log("✅ Allowed origins:", allowedOrigins);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
}

start();
