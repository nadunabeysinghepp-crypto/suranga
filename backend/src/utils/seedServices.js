const Service = require("../models/Service");

const services = [
  { name: "Binding", category: "Finishing", featured: true },
  { name: "Book Printing", category: "Books", featured: true },
  { name: "Brochure Printing", category: "Marketing" },
  { name: "Business Card Printing", category: "Business", featured: true },
  { name: "Business Document Printing", category: "Business" },
  { name: "Calendars Printing", category: "Marketing" },
  { name: "Color Printing", category: "General" },
  { name: "Copy Service", category: "General" },
  { name: "Custom Printing", category: "Custom" },
  { name: "Digital Printing", category: "Digital", featured: true },
  { name: "Document Printing", category: "Documents" },
  { name: "Dye Sublimation Printing", category: "Sublimation", featured: true },
  { name: "Faxing Service", category: "Office" },
  { name: "Flyers Printing", category: "Marketing" },
  { name: "Flyers & Brochures Design", category: "Design" },
  { name: "Graphic Design", category: "Design", featured: true },
  { name: "Letterhead Printing", category: "Business" },
  { name: "Photo Printing", category: "Photo", featured: true },
  { name: "Poster Printing", category: "Marketing", featured: true },
];

async function seedServices() {
  const count = await Service.countDocuments();
  if (count > 0) {
    console.log("ℹ️ Services already exist — skipping seed");
    return;
  }

  await Service.insertMany(services);
  console.log("✅ Default services seeded");
}

module.exports = seedServices;
