import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApplications } from '../utils/firestore';
import '../styles/Dashboard.css';

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
        </div>
    );
};

export default Dashboard; 