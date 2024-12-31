const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    recipients: { type: [String], required: true },
    subject: { type: String, required: true },
    content: { type: String},
    scheduled_time: { type: Date },
    created_at: { type: Date, default: Date.now },
});

const CampaignModel=mongoose.model('Campaign',CampaignSchema)
module.exports = CampaignModel;