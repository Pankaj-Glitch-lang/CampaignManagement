import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import '../../App.css';

const CampaignDashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get('api/campaigns');
                setCampaigns(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCampaigns();
    }, []);

    const deleteCampaign = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;

        try {
            await api.delete(`api/campaigns/${id}`);
            setCampaigns(campaigns.filter(campaign => campaign._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const sendCampaign = async (id) => {
        try {
            await api.post(`api/campaigns/${id}/send`);
            setSuccessMessage('Campaign sent successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="campaign-dashboard-container">
            <h1 className="heading">Campaign Dashboard</h1>
            <Link
                to="/campaigns/new"
                className="create-campaign-btn"
            >
                Create New Campaign
            </Link>
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}
            <div className="table-container">
                <table className="campaign-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Subject</th>
                            <th>Created On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign) => (
                            <tr key={campaign._id}>
                                <td>{campaign.name}</td>
                                <td>{campaign.subject}</td>
                                <td>{new Date(campaign.created_at).toLocaleDateString()}</td>
                                <td className="action-buttons">
                                    <Link
                                        to={`/campaigns/${campaign._id}/edit`}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteCampaign(campaign._id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                    <Link
                                        to={`/campaigns/${campaign._id}/metrics`}
                                        className="metrics-btn"
                                    >
                                        Metrics
                                    </Link>
                                    <button
                                        onClick={() => sendCampaign(campaign._id)}
                                        className="send-btn"
                                    >
                                        Send
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CampaignDashboard;
