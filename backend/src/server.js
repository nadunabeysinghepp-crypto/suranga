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

/* -------------------- CORS (RESET & SAFE) -------------------- */
app.use(
  cors({
    origin: "*", // ✅ TEMP: allow all (we lock later)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

/* -------------------- ADMIN SEED -------------------- */
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const pass = process.env.ADMIN_PASSWORD;

  if (!email || !pass) return;

  const exists = await AdminUser.findOne({ email });
  if (exists) return;

  const hash = await bcrypt.hash(pass, 12);
  await AdminUser.create({ email, passwordHash: hash, role: "admin" });
  console.log("✅ Admin created:", email);
}

/* -------------------- START SERVER -------------------- */
async function start() {
  await connectDB(process.env.MONGO_URI);
  await ensureAdmin();
  await seedServices();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log("✅ Backend running on port", PORT)
  );
}

start();
