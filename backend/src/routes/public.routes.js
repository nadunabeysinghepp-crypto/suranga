// const router = require("express").Router();
// const { uploadQuoteFiles } = require("../middleware/upload");
// const c = require("../controllers/public.controller");

// // --------------------
// // Services
// // --------------------
// router.get("/services", c.getServices);

// // --------------------
// // Delivery areas
// // --------------------
// router.get("/delivery-areas", c.getDeliveryAreas);

// // --------------------
// // Quotes (max 5 files)
// // --------------------
// router.post(
//   "/quotes",
//   uploadQuoteFiles.array("files", 5),
//   c.createQuote
// );

// // --------------------
// // Reviews
// // --------------------
// router.get("/reviews", c.getReviews);
// router.post("/reviews", c.createReview);

// // --------------------
// // Portfolio
// // --------------------
// router.get("/portfolio", c.getPortfolio);

// // --------------------
// // Public settings
// // --------------------
// router.get("/settings", c.getPublicSettings);

// module.exports = router;
const router = require("express").Router();
const { uploadQuoteFiles } = require("../middleware/upload");
const c = require("../controllers/public.controller");

// Services
router.get("/services", c.getServices);

// Delivery Areas
router.get("/delivery-areas", c.getDeliveryAreas);

// Quotes
router.post("/quotes", uploadQuoteFiles.array("files", 5), c.createQuote);

// Reviews
router.get("/reviews", c.getReviews);
router.post("/reviews", c.createReview);

// Portfolio
router.get("/portfolio", c.getPortfolio);

// Public Settings
router.get("/settings", c.getPublicSettings);

module.exports = router;
