import React from "react";
import "./../styles/Extension.css";

const Extension = () => {
  return (
    <div className="extension-page">
      <h1>Enhance Your Job Search with Our Chrome Extension</h1>
      <p>
        Our Chrome extension allows you to seamlessly save job applications from popular job boards directly into your account. Never lose track of an application again!
      </p>

      <div className="features">
        <h2>Key Features:</h2>
        <ul>
          <li>Automatically capture job details from job boards like Indeed and LinkedIn</li>
          <li>Save job postings directly to your job application tracker</li>
          <li>Quick and easy access to all your saved applications in one place</li>
        </ul>
      </div>

      <a
        href="https://chrome.google.com/webstore/detail/your-extension-id"
        target="_blank"
        rel="noopener noreferrer"
        className="install-button"
      >
        Install Chrome Extension
      </a>

      <div className="instructions">
        <h2>How to Use the Extension:</h2>
        <p>1. Click the "Install Chrome Extension" button above to add it to Chrome.</p>
        <p>2. Visit any job listing page on supported sites like Indeed or LinkedIn.</p>
        <p>3. Click on the extension icon to save the job details directly to your account.</p>
      </div>
    </div>
  );
};

export default Extension;
