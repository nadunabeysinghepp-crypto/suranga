const mongoose = require("mongoose");

const QuoteRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    contactMethod: { type: String, enum: ["Call", "WhatsApp"], default: "WhatsApp" },

    serviceName: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    paper: { type: String, default: "" },
    finishing: { type: String, default: "" },
    notes: { type: String, default: "" },

    fulfillment: { type: String, enum: ["Pickup", "Delivery"], default: "Pickup" },
    deliveryArea: { type: String, default: "" },
    deliveryFeeLkr: { type: Number, default: 0 },

    files: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],

    status: {
      type: String,
      enum: [
        "Received",
        "Designing",
        "Printing",
        "Ready",
        "OutForDelivery",
        "Completed",
        "Cancelled",
      ],
      default: "Received",
      index: true,
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuoteRequest", QuoteRequestSchema);
