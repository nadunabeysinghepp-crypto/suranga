const mongoose = require("mongoose");

const DeliveryAreaSchema = new mongoose.Schema(
  {
    district: { type: String, default: "Matale", index: true },
    area: { type: String, required: true, trim: true },
    feeLkr: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DeliveryAreaSchema.index({ district: 1, area: 1 }, { unique: true });

module.exports = mongoose.model("DeliveryArea", DeliveryAreaSchema);
