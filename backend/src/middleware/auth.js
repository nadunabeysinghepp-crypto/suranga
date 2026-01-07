// const jwt = require("jsonwebtoken");

// function auth(req, res, next) {
//   const header = req.headers.authorization || "";
//   const token = header.startsWith("Bearer ") ? header.slice(7) : null;

//   if (!token) return res.status(401).json({ message: "Unauthorized" });
//   if (!process.env.JWT_SECRET) {
//     return res.status(500).json({ message: "JWT_SECRET is missing in .env" });
//   }

//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     return next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// // ✅ Use this for admin routes
// function adminOnly(req, res, next) {
//   // expects req.user to exist (so use auth before this)
//   const role = req.user?.role;
//   if (role !== "admin") return res.status(403).json({ message: "Forbidden" });
//   return next();
// }

// module.exports = { auth, adminOnly };

// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is missing in .env" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  const role = req.user?.role;
  if (role !== "admin") return res.status(403).json({ message: "Forbidden" });
  return next();
}

module.exports = { auth, adminOnly };
