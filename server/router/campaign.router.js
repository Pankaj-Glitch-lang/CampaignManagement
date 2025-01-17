const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaignEmailsManual,
    getCampaignMetrics
} = require('../controllers/campaign.controller');

// Get all campaigns
router.get('/',  getCampaigns);

// Get a specific campaign by ID
router.get('/:id', auth, getCampaignById);

// Create a new campaign
router.post('/',auth,  createCampaign);

// Update an existing campaign
router.put('/:id',auth,  updateCampaign);

// Delete a campaign
router.delete('/:id',auth, deleteCampaign);

// Send emails for a campaign
router.post('/:id/send',auth,sendCampaignEmailsManual);

// Get performance metrics for a campaign
router.get('/:id/metrics', auth,getCampaignMetrics);

module.exports = router;
