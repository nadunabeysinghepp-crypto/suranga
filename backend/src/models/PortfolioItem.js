const mongoose = require("mongoose");

const PortfolioItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General", index: true },
    tag: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PortfolioItem", PortfolioItemSchema);
