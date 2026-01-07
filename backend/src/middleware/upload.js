const path = require("path");
const fs = require("fs");
const multer = require("multer");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/* ================= PORTFOLIO IMAGES ================= */
const portfolioDir = path.join(process.cwd(), "uploads", "portfolio");
ensureDir(portfolioDir);

const portfolioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, portfolioDir),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || ".jpg").toLowerCase();
    cb(null, `p_${Date.now()}${ext}`);
  },
});

const portfolioFileFilter = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype);
  if (!ok) return cb(new Error("Only JPG/JPEG/PNG/WEBP allowed"), false);
  return cb(null, true);
};

const uploadPortfolioImage = multer({
  storage: portfolioStorage,
  fileFilter: portfolioFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ================= QUOTE ATTACHMENTS ================= */
const quoteDir = path.join(process.cwd(), "uploads", "quotes");
ensureDir(quoteDir);

const quoteStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, quoteDir),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || "").toLowerCase();
    cb(null, `q_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const quoteFileFilter = (_req, file, cb) => {
  const ok = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ].includes(file.mimetype);

  if (!ok) return cb(new Error("Only JPG/JPEG/PNG/WEBP/PDF allowed"), false);
  return cb(null, true);
};

const uploadQuoteFiles = multer({
  storage: quoteStorage,
  fileFilter: quoteFileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

module.exports = { uploadPortfolioImage, uploadQuoteFiles };
