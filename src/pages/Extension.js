import React from "react";
import "./../styles/Extension.css";

const Extension = () => {
    const handleInstallClick = () => {
        window.open("https://chrome.google.com/webstore/detail/your-extension-id", "_blank", "noopener,noreferrer");
    };

    return (
        <div className="extension-container">
            <section className="main-section">
                <h1>Save Time with Our Automated Tracking</h1>
                <p>
                    Automatically capture job application details by connecting your Gmail account. 
                </p>
            </section>

            <section className="features">
                <h2>Why Use Automated Tracking?</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>Seamless Integration</h3>
                        <p>Save application data while you apply.</p>
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
