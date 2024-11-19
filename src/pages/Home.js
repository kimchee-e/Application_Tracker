import { useNavigate } from 'react-router-dom';
import "./../styles/Home.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <section className="main-section">
                <h1>Track Your Tech Internships</h1>
                <p>Stop using spreadsheets. Start using a tool built for students.</p>
                <button 
                    className="start-button" 
                    onClick={() => navigate('/login')}
                >
                    Get Started
                </button>
            </section>

            <section className="features">
                <div className="feature-grid">
                    <div className="feature-card">
                        <h2>Chrome Extension</h2>
                        <p>Automatically capture application data as you apply.</p>
                    </div>
                    <div className="feature-card">
                        <h2>Application Tracking</h2>
                        <p>Monitor your application status, upcoming deadlines and interview schedules in one place.</p>
                    </div>
                    <div className="feature-card">
                        <h2>Built for Tech Students</h2>
                        <p>Specifically designed for tech students seeking internships, with features that matter to you.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;