import React, { useState } from "react";
import "./../styles/TableView.css";

const TableView = () => {
    const [jobApplications] = useState([
        {
            id: 1,
            jobTitle: "Frontend Developer",
            company: "Google",
            status: "Interview",
            dateApplied: "2024-09-01",
            jobType: "Intership",
            location: "Dallas,TX",
        },
        {
            id: 2,
            jobTitle: "Backend Engineer",
            company: "Facebook",
            status: "Applied",
            dateApplied: "2024-08-25",
            jobType: "Intership",
            location: "Dallas,TX",
        },
        {
            id: 3,
            jobTitle: "Full Stack Developer",
            company: "Amazon",
            dateApplied: "2024-07-20",
            status: "Offer",
            jobType: "Intership",
            location: "Dallas,TX",
        },
        {
            id: 4,
            jobTitle: "Data Scientist",
            company: "Microsoft",
            dateApplied: "2024-10-05",
            status: "Rejected",
            jobType: "Intership",
            location: "Dallas,TX",
        },
        {
            id: 5,
            jobTitle: "DevOps Engineer",
            company: "Netflix",
            dateApplied: "2024-06-15",
            status: "Applied",
            jobType: "Intership",
            location: "Dallas,TX",
        },
    ]);

    return (
        <div className="table-view-container">
            <h1>Job Applications</h1>
            <button className="add-button" onClick={() => addNewApplication()}>+ New Application</button>
            <table className="job-table">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Job Type</th>
                        <th>Date Applied</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {jobApplications.length > 0 ? (
                        jobApplications.map((job) => (
                            <tr key={job.id}>
                                <td>{job.jobTitle}</td>
                                <td>{job.company}</td>
                                <td>{job.status}</td>
                                <td>{job.jobType}</td>
                                <td>{job.dateApplied}</td>
                                <td>{job.location}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No job applications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const addNewApplication = () => {

}

export default TableView;
