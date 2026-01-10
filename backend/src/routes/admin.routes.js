// const router = require("express").Router();
// const { auth, adminOnly } = require("../middleware/auth");
// const c = require("../controllers/admin.controller");
// const { uploadPortfolioImage } = require("../middleware/upload");

// // --------------------
// // Public admin login
// // --------------------
// router.post("/auth/login", c.login);

// // --------------------
// // Protect everything below
// // --------------------
// router.use(auth, adminOnly);

// // --------------------
// // Services
// // --------------------
// router.get("/services", c.adminGetServices);
// router.post("/services", c.adminCreateService);
// router.put("/services/:id", c.adminUpdateService);
// router.delete("/services/:id", c.adminDeleteService);

// // --------------------
// // Delivery areas
// // --------------------
// router.get("/delivery-areas", c.adminGetDeliveryAreas);
// router.post("/delivery-areas", c.adminCreateDeliveryArea);
// router.put("/delivery-areas/:id", c.adminUpdateDeliveryArea);
// router.delete("/delivery-areas/:id", c.adminDeleteDeliveryArea);

// // --------------------
// // Quotes / Orders
// // --------------------
// router.get("/quotes", c.adminGetQuotes);
// router.patch("/quotes/:id", c.adminUpdateQuote);

// // --------------------
// // Reviews
// // --------------------
// router.get("/reviews", c.adminGetReviews);
// router.patch("/reviews/:id", c.adminUpdateReview);
// router.delete("/reviews/:id", c.adminDeleteReview);

// // --------------------
// // Portfolio
// // --------------------
// router.get("/portfolio", c.adminGetPortfolio);
// router.post(
//   "/portfolio",
//   uploadPortfolioImage.single("image"),
//   c.adminCreatePortfolio
// );
// router.delete("/portfolio/:id", c.adminDeletePortfolio);

// // --------------------
// // Settings
// // --------------------
// router.get("/settings", c.adminGetSettings);
// router.put("/settings", c.adminUpdateSettings);

// module.exports = router;
const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const c = require("../controllers/admin.controller");
const { uploadPortfolioImage } = require("../middleware/upload");

// Auth
router.post("/auth/login", c.login);

// Protect everything below
router.use(auth, adminOnly);

// Services
router.get("/services", c.adminGetServices);
router.post("/services", c.adminCreateService);
router.put("/services/:id", c.adminUpdateService);
router.delete("/services/:id", c.adminDeleteService);

// Delivery Areas
router.get("/delivery-areas", c.adminGetDeliveryAreas);
router.post("/delivery-areas", c.adminCreateDeliveryArea);
router.put("/delivery-areas/:id", c.adminUpdateDeliveryArea);
router.delete("/delivery-areas/:id", c.adminDeleteDeliveryArea);

// Quotes
router.get("/quotes", c.adminGetQuotes);
router.patch("/quotes/:id", c.adminUpdateQuote);

// Reviews
router.get("/reviews", c.adminGetReviews);
router.patch("/reviews/:id", c.adminUpdateReview);
router.delete("/reviews/:id", c.adminDeleteReview);

// Portfolio
router.get("/portfolio", c.adminGetPortfolio);
router.post(
  "/portfolio",
  uploadPortfolioImage.single("image"),
  c.adminCreatePortfolio
);
router.delete("/portfolio/:id", c.adminDeletePortfolio);

// Settings
router.get("/settings", c.adminGetSettings);
router.put("/settings", c.adminUpdateSettings);

module.exports = router;
