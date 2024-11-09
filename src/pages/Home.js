import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="main-section">
                <div className="opening-text">
                    <h1>Internship Tracker</h1>
                    <p>Simplify your internship search with our easy-to-use application tracker</p>
                    <button className="start-button" onClick={() => window.location.href = '/login'}>
                        Get Started
                    </button>
                </div>
            </div>
            <div className="features-section">
                <div className="feature">
                    <h2>Automatic Tracking</h2>
                    <p>Our Chrome extension captures application details automatically as you apply, eliminating manual data entry</p>
                </div>
                <div className="feature">
                    <h2>Built for Tech Students</h2>
                    <p>Designed specifically for computer science and engineering students, with features like visa sponsorship tracking</p>
                </div>
                <div className="feature">
                    <h2>Simple Interface</h2>
                    <p>Clean, intuitive design focused on what matters - tracking your applications and deadlines effectively</p>
                </div>
            </div>
        </div>
    );
}

export default Home;