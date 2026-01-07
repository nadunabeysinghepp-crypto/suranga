const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const c = require("../controllers/admin.controller");
const { uploadPortfolioImage } = require("../middleware/upload");

// public login (no auth)
router.post("/auth/login", c.login);

// protect everything below (must be admin)
router.use(auth, adminOnly);

// services
router.get("/services", c.adminGetServices);
router.post("/services", c.adminCreateService);
router.put("/services/:id", c.adminUpdateService);
router.delete("/services/:id", c.adminDeleteService);

// delivery areas
router.get("/delivery-areas", c.adminGetDeliveryAreas);
router.post("/delivery-areas", c.adminCreateDeliveryArea);
router.put("/delivery-areas/:id", c.adminUpdateDeliveryArea);
router.delete("/delivery-areas/:id", c.adminDeleteDeliveryArea);

// quotes/orders
router.get("/quotes", c.adminGetQuotes);
router.patch("/quotes/:id", c.adminUpdateQuote);

// reviews
router.get("/reviews", c.adminGetReviews);
router.patch("/reviews/:id", c.adminUpdateReview);
router.delete("/reviews/:id", c.adminDeleteReview);

// portfolio
router.get("/portfolio", c.adminGetPortfolio);
router.post("/portfolio", uploadPortfolioImage.single("image"), c.adminCreatePortfolio);
router.delete("/portfolio/:id", c.adminDeletePortfolio);

// settings
router.get("/settings", c.adminGetSettings);
router.put("/settings", c.adminUpdateSettings);

module.exports = router;
