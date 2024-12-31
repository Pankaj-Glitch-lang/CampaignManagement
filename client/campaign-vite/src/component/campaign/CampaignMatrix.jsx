import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import '../../App.css'

const CampaignMetrics = () => {
    const { id } = useParams();
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get(`/api/campaigns/${id}/metrics`);
                setMetrics(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMetrics();
    }, [id]);

    if (!metrics) return <div>Loading metrics...</div>;

    const data = [
        { name: 'Delivered', value: metrics.delivered },
        { name: 'Failed', value: metrics.failed },
        { name: 'Opened', value: metrics.opened },
        { name: 'Clicked', value: metrics.clicked },
    ];

    const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

    return (
        <div className="p-4">
            <h1 className="text-2xl">Campaign Metrics</h1>
            <div className="my-4">
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
            <ul>
                <li>Total Sent: {metrics.total}</li>
                <li>Delivery Success: {metrics.delivered}</li>
                <li>Open Rate: {metrics.openRate}%</li>
                <li>Click Rate: {metrics.clickRate}%</li>
            </ul>
        </div>
    );
};

export default CampaignMetrics;
