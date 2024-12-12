const mongoose = require("mongoose");

const MetricLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  metrics: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MetricLog", MetricLogSchema);
