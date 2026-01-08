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
   CORS CONFIG (FIXED - ALLOWS NETLIFY PREVIEW URLs)
====================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://surangaprinters.netlify.app",
  "https://singular-stroopwafel-854996.netlify.app",
];

// Add any FRONTEND_URL from environment
if (process.env.FRONTEND_URL) {
  const urls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...urls);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ALLOW ALL NETLIFY PREVIEW URLs (pattern matching)
      // This matches: https://{hash}--{sitename}.netlify.app
      const netlifyPreviewPattern = /^https:\/\/([a-f0-9]+)--surangaprinters\.netlify\.app$/;
      const netlifySingularPattern = /^https:\/\/([a-f0-9]+)--singular-stroopwafel-854996\.netlify\.app$/;
      
      if (netlifyPreviewPattern.test(origin) || netlifySingularPattern.test(origin)) {
        console.log("✅ Allowed Netlify preview:", origin);
        return callback(null, true);
      }

      // Allow any subdomain of netlify.app for development
      // BE CAREFUL: This is less secure for production
      // if (origin.endsWith('.netlify.app')) {
      //   console.log("🌐 Allowed Netlify domain:", origin);
      //   return callback(null, true);
      // }

      console.warn("❌ CORS blocked origin:", origin);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours - for preflight cache
  })
);

/* ======================================================
   GLOBAL MIDDLEWARE
====================================================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Handle preflight requests
app.options('*', cors());

/* ======================================================
   STATIC FILES
====================================================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ======================================================
   DEBUG ROUTE - Check CORS is working
====================================================== */
app.get("/__debug", (req, res) => {
  res.json({
    ok: true,
    origin: req.headers.origin || null,
    allowedOrigins,
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

/* ======================================================
   ROUTES
====================================================== */
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

/* ======================================================
   HEALTH CHECK
====================================================== */
app.get("/", (req, res) => {
  res.json({ 
    status: "Backend running OK 🚀",
    cors: "Enabled",
    allowedOrigins: allowedOrigins.length,
    timestamp: new Date().toISOString()
  });
});

/* ======================================================
   404 HANDLER
====================================================== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});

/* ======================================================
   ERROR HANDLER
====================================================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message || err);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message: "CORS Error: Origin not allowed",
      requestedOrigin: req.headers.origin,
      allowedPatterns: [
        "http://localhost:*",
        "https://surangaprinters.netlify.app",
        "https://*.netlify.app (preview deployments)"
      ]
    });
  }
  
  res.status(500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/* ======================================================
   ADMIN AUTO-SEED
====================================================== */
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
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await connectDB(process.env.MONGO_URI);
    await ensureAdmin();
    await seedServices();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Backend running on port ${PORT}`);
      console.log("🌐 CORS enabled for:");
      console.log("   - Localhost: 5173, 3000");
      console.log("   - https://surangaprinters.netlify.app");
      console.log("   - https://singular-stroopwafel-854996.netlify.app");
      console.log("   - All Netlify preview URLs (*--surangaprinters.netlify.app)");
      console.log(`   - Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error("❌ Server failed:", err.message);
    process.exit(1);
  }
}

startServer();