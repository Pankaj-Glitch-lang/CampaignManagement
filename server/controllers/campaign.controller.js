const nodemailer = require('nodemailer');
const { CronJob } = require('node-cron');
const dotenv = require('dotenv');
const CampaignModel = require('../models/campaign.model');

dotenv.config();

// Helper function to send campaign emails
const sendCampaignEmails = async (campaign) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,  // Gmail address
            pass: process.env.GMAIL_PASSWORD,  // Gmail app-specific password
        },
    });

    const sendEmailPromises = campaign.recipients.map((email) => {
        return transporter.sendMail({
            from: process.env.EMAIL_FROM,  // Your email address
            to: email,
            subject: campaign.subject,
            text: campaign.content,
            html: `<p>${campaign.content}</p>`,
        });
    });

    await Promise.all(sendEmailPromises);
};

// Get all campaigns
const getCampaigns = async (req, res) => {
    try {
        const campaigns = await CampaignModel.find();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific campaign by ID
const getCampaignById = async (req, res) => {
    try {
        const campaign = await CampaignModel.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new campaign
const createCampaign = async (req, res) => {
    const { name, description, recipients, subject, content, scheduled_time, cronExpression } = req.body;

    try {
        const campaign = new CampaignModel({
            name,
            description,
            recipients,
            subject,
            content,
            scheduled_time,
            cronExpression
        });

        await campaign.save();

        // Schedule the cron job to send emails at the specified time
        const job = new CronJob(cronExpression, async () => {
            console.log(`Executing campaign: ${name} at scheduled time`);
            await sendCampaignEmails(campaign);
        });

        // Start the cron job immediately (could also be started later as needed)
        job.start();

        // Optionally, store the job reference to manage it later (e.g., stop or modify)
        campaign.cronJobId = job.id;
        await campaign.save();

        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing campaign
const updateCampaign = async (req, res) => {
    const { id } = req.params;
    const { name, description, recipients, subject, content, scheduled_time, cronExpression } = req.body;

    try {
        const campaign = await CampaignModel.findByIdAndUpdate(
            id,
            { name, description, recipients, subject, content, scheduled_time, cronExpression },
            { new: true }
        );
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        // Reschedule the cron job if the cronExpression has changed
        if (campaign.cronJobId) {
            // Stop the old job and create a new one
            cron.getJobs().forEach((job) => {
                if (job.id === campaign.cronJobId) {
                    job.stop();
                }
            });

            const job = new CronJob(cronExpression, async () => {
                console.log(`Executing updated campaign: ${name}`);
                await sendCampaignEmails(campaign);
            });

            job.start();

            // Update job reference in the database
            campaign.cronJobId = job.id;
            await campaign.save();
        }

        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a campaign
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await CampaignModel.findByIdAndDelete(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        // Stop the cron job associated with this campaign, if it exists
        if (campaign.cronJobId) {
            cron.getJobs().forEach((job) => {
                if (job.id === campaign.cronJobId) {
                    job.stop();
                }
            });
        }

        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send campaign emails (manually triggered, can be called separately)
const sendCampaignEmailsManual = async (req, res) => {
    const { id } = req.params;

    try {
        const campaign = await CampaignModel.findById(id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        await sendCampaignEmails(campaign);
        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get performance metrics for a campaign
const getCampaignMetrics = async (req, res) => {
    const { id } = req.params;

    try {
        const campaign = await CampaignModel.findById(id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        // Placeholder metrics for now
        const metrics = {
            totalSent: campaign.recipients.length,
            success: Math.floor(Math.random() * campaign.recipients.length),
            failed: campaign.recipients.length - Math.floor(Math.random() * campaign.recipients.length),
            openRate: Math.random() * 100,
            clickRate: Math.random() * 100,
        };

        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaignEmailsManual,
    getCampaignMetrics,
};
