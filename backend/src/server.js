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

/* ======================================================
   ✅ CORS CONFIG (NETLIFY + LOCAL + RENDER SAFE)
====================================================== */
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://surangaprinters.netlify.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow curl / server-to-server
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ CORS BLOCKED:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

// 🔥 MUST come before routes
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // ✅ FIXED (NO "*")

/* ======================================================
   GLOBAL MIDDLEWARE
====================================================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

/* ======================================================
   STATIC FILES
====================================================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ======================================================
   ROUTES
====================================================== */
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

/* ======================================================
   HEALTH CHECK
====================================================== */
app.get("/", (_req, res) => {
  res.json({ status: "Backend running OK 🚀" });
});

/* ======================================================
   404 HANDLER
====================================================== */
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ======================================================
   ERROR HANDLER
====================================================== */
app.use((err, _req, res, _next) => {
  console.error("❌ SERVER ERROR:", err.message);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

/* ======================================================
   ADMIN AUTO-SEED
====================================================== */
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const pass = process.env.ADMIN_PASSWORD;

  if (!email || !pass) return;

  const exists = await AdminUser.findOne({ email });
  if (exists) return;

  const hash = await bcrypt.hash(pass, 12);
  await AdminUser.create({
    email,
    passwordHash: hash,
    role: "admin",
  });

  console.log("✅ Admin created:", email);
}

/* ======================================================
   START SERVER
====================================================== */
async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing");
    process.exit(1);
  }

  await connectDB(process.env.MONGO_URI);
  await ensureAdmin();
  await seedServices();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
  });
}

startServer();
