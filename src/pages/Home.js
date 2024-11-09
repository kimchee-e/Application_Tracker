import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="opening-text">
                <h1>Internship Tracker</h1>
                <p>Simplify your internship search with our easy-to-use application tracker</p>
                <button className="start-button" onClick={() => window.location.href = '/login'}>
                    Get Started
                </button>
            </div>
        </div>
    );
}

export default Home;