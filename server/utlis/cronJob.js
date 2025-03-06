const cron = require("node-cron");
const Sell = require("../models/sell");
const Rent = require("../models/rent");
const Plot = require("../models/plot");
const PG = require("../models/pg");
const Commercial = require("../models/commercial");
// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const updateStatus = { $set: { status: "Inactive" } };
    const query = { StatusUpdatedAt: { $lte: thirtyDaysAgo }, status: "Active" };
    // Update properties for each type
    await Promise.all([
      Sell.updateMany(query, updateStatus),
      Rent.updateMany(query, updateStatus),
      PG.updateMany(query, updateStatus),
      Plot.updateMany(query, updateStatus),
      Commercial.updateMany(query, updateStatus),
    ]);
    console.log("✅ Inactivated properties older than 30 days.");
  } catch (error) {
    console.error("❌ Error updating properties:", error);
  }
});

