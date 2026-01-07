const router = require("express").Router();
const { uploadQuoteFiles } = require("../middleware/upload");
const c = require("../controllers/public.controller");
const publicController = require("../controllers/public.controller");

// services
router.get("/services", c.getServices);

// delivery areas
router.get("/delivery-areas", c.getDeliveryAreas);

// quotes (allow up to 5 attachments, field name: "files")
router.post(
  "/quotes",
  uploadQuoteFiles.array("files", 5),
  c.createQuote
);

// reviews
router.get("/reviews", c.getReviews);
router.post("/reviews", c.createReview);

// portfolio
router.get("/portfolio", c.getPortfolio);

// settings
router.get("/settings", publicController.getPublicSettings);


module.exports = router;
