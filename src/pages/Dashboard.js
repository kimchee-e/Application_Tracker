import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApplications } from '../utils/firestore';
import '../styles/Dashboard.css';
import { ResponsiveSankey } from '@nivo/sankey';

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadApplications = async () => {
            try {
                const data = await getApplications(user.uid);
                setApplications(data);
            } catch (error) {
                console.error('Error loading applications:', error);
            } finally {
                setLoading(false);
            }
        };

        loadApplications();
    }, [user.uid]);

    if (loading) {
        return <div className="dashboard-page">Loading...</div>;
    }

    const totalApplications = applications.length;
    const interviews = applications.filter(app => app.status === 'Interview').length;
    const offers = applications.filter(app => app.status === 'Offer').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;

    const sankeyData = () => {
        const pending = totalApplications - (interviews + rejected); 
        return {
            nodes: [
                { id: 'Applied' },
                { id: 'Pending' },
                { id: 'Interview' },
                { id: 'Offer' },
                { id: 'Rejected' }
            ],

            links: [
                {source: 'Applied', target: 'Pending', value: pending},
                {source: 'Applied', target: 'Interview', value: interviews},
                {source: 'Applied', target: 'Rejected', value: rejected},
                {source: 'Interview', target: 'Offer', value: offers}
            ]
        };
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>Dashboard</h1>
                    <p className="subheader">
                        Overview of your internship search
                    </p>
                </div>
            </div>
            <div className="metrics-container">
                <div className="card">
                    <h3>Total Applications</h3>
                    <span className="number">{totalApplications}</span>
                </div>
                <div className="card">
                    <h3>Interviews</h3>
                    <span className="number">{interviews}</span>
                </div>
                <div className="card">
                    <h3>Offers</h3>
                    <span className="number">{offers}</span>
                </div>
                <div className="card">
                    <h3>Rejected</h3>
                    <span className="number">{rejected}</span>
                </div>
            </div>
            {/* Credit for the Sankey chart component: https://nivo.rocks/sankey/ */}
            <div className="sankey-container">
                <h2>Application Flow</h2>
                <div className="sankey-chart">
                    <ResponsiveSankey
                        data={sankeyData()}
                        margin={{ top: 40, right: 50, bottom: 40, left: 50 }}
                        align="justify"
                        colors={{ scheme: 'category10' }}
                        nodeOpacity={1}
                        nodeThickness={18}
                        nodeSpacing={24}
                        nodeBorderRadius={3}
                        linkOpacity={0.5}
                        linkContract={3}
                        enableLinkGradient={true}
                        labelPosition="outside"
                        labelOrientation="vertical"
                        labelPadding={16}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 