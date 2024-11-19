import React from "react";
import "./../styles/Extension.css";

const Extension = () => {
    const handleInstallClick = () => {
        window.open("https://chrome.google.com/webstore/detail/your-extension-id", "_blank", "noopener,noreferrer");
    };

    return (
        <div className="extension-container">
            <section className="main-section">
                <h1>Save Time with Our Chrome Extension</h1>
                <p>
                    Automatically capture job application details while you browse, and sync them directly with your account.
                </p>
                <button 
                    className="install-button" 
                    onClick={handleInstallClick}
                >
                    Install Chrome Extension
                </button>
            </section>

            <section className="features">
                <h2>Why Use the Extension?</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>Seamless Integration</h3>
                        <p>Save application data from job boards like LinkedIn and Indeed with a single click.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Track with Ease</h3>
                        <p>Keep all your applications in one place, synced across devices.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Time Saver</h3>
                        <p>Eliminate manual entry and focus on finding your dream job.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Extension;
