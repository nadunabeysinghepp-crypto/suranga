const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    shopName: { type: String, default: "Suranga Printers" },

    // digits only
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },

    address: { type: String, default: "" },

    hoursMonSat: { type: String, default: "" },
    hoursSunday: { type: String, default: "" },

    // ✅ Social links (admin editable)
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
