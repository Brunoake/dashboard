const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  campaignId: { type: String, required: true },
  impressions: { type: Number, required: true },
  clicks: { type: Number, required: true },
  cost: { type: Number, required: true },
  results: { type: Number, default: 0 },
  costPerResult: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Metric', MetricSchema);