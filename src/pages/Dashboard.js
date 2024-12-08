import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApplications } from '../utils/firestore';
import '../styles/Dashboard.css';
import { ResponsiveSankey } from '@nivo/sankey';

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadApplications = useCallback(async () => {
        if (!user) return;
        
        try {
            const data = await getApplications(user.uid);
            setApplications(data);
        } catch (error) {
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    if (loading) {
        return <div className="dashboard-page">Loading...</div>;
    }

    const totalApplications = applications.length;
    const interviews = applications.filter(app => app.status === 'Interview').length;
    const offers = applications.filter(app => app.status === 'Offer').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;

    const sankeyData = () => {
        const pending = totalApplications - (interviews + rejected); // Need to find a better way to do this for now chart looks weird 
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
            <header className="page-header">
                <h1>Dashboard</h1>
                <p>
                    Here's how your internship search is going
                </p>
            </header>
            <section className="metrics-container">
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
            </section>
            {/* Credit for the Sankey chart component: https://nivo.rocks/sankey/ */}
            <section className="sankey-container">
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
            </section>
        </div>
    );
};

export default Dashboard; 