import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Include CSS for styling
import '../../App.css';

const CampaignForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        recipients: '',
        subject: '',
        content: '',
        scheduled_time: '',
        cronExpression: ''
    });

    useEffect(() => {
        if (id) {
            const fetchCampaign = async () => {
                try {
                    const response = await api.get(`api/campaigns/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchCampaign();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await api.put(`api/campaigns/${id}`, formData);
            } else {
                await api.post('api/campaigns/', formData);
            }
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeSchedule = (date) => {
        setFormData({
            ...formData,
            scheduled_time: date.toISOString(), // Save the selected date in ISO format
            cronExpression: generateCronExpression(date) // Generate the cron expression
        });
    };

    const generateCronExpression = (date) => {
        const minutes = date.getUTCMinutes();
        const hours = date.getUTCHours();
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // Months are 0-based
        return `${minutes} ${hours} ${day} ${month} *`; // Simple cron expression for specific date/time
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="campaign-form">
            <div className="form-group">
                <label className="form-label">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Recipients (comma-separated emails):</label>
                <textarea
                    name="recipients"
                    value={formData.recipients}
                    onChange={handleChange}
                    className="form-textarea"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Subject:</label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Content:</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Schedule Time:</label>
                <DatePicker
                    selected={formData.scheduled_time ? new Date(formData.scheduled_time) : null}
                    onChange={handleChangeSchedule}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat="Pp"
                    minDate={new Date()} // Prevent selecting past dates
                    required
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="form-button">
                    Save Campaign
                </button>
            </div>
        </form>
    );
};

export default CampaignForm;
