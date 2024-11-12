import React, { useState, useEffect } from 'react';
import "./../styles/Home.css";

function Home() {
  const [totalApplications, setTotalApplications] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    // Example: Fetch summary data and recent applications from API or use dummy data
    setTotalApplications(15);
    setAppliedCount(10);
    setInterviewCount(3);
    setOfferCount(2);

    setRecentApplications([
      { id: 1, jobTitle: 'Frontend Developer', company: 'Google', status: 'Applied' },
      { id: 2, jobTitle: 'Backend Engineer', company: 'Facebook', status: 'Interview' },
      { id: 3, jobTitle: 'Data Scientist', company: 'Amazon', status: 'Offer' },
    ]);
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to Jobly!</h1>
      <p>Easily track and manage your job applications in one place.</p>

      <div className="overview">
        <h2>Application Summary</h2>
        <div>Total Applications: {totalApplications}</div>
        <div>Applied: {appliedCount}</div>
        <div>Interviews: {interviewCount}</div>
        <div>Offers: {offerCount}</div>
      </div>

      <div className="recent-applications">
        <h2>Recent Applications</h2>
        <ul>
          {recentApplications.map((job) => (
            <li key={job.id}>
              {job.jobTitle} at {job.company} - {job.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;