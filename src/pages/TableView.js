import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from '../context/AuthContext';
import { getApplications, addApplication } from '../utils/firestore';
import "./../styles/TableView.css";

const TableView = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const { user } = useAuth();

    const loadApplications = useCallback(async () => {
        if (!user) return;
        
        try {
            const data = await getApplications(user.uid);
            setApplications(data);
        } catch (error) {
            console.error('Failed to load applications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Load applications on component mount
    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    const handleAddApplication = async (applicationData) => {
        try {
            await addApplication(user.uid, applicationData);
            await loadApplications();
            setShowAddForm(false);
        } catch (error) {
            console.error('Failed to add application:', error);
        }
    };

    if (loading) {
        return <div className="table-view-container">Loading...</div>;
    }

    return (
        <div className="table-view-container">
            <div className="table-header">
                <h1>Job Applications</h1>
                <button 
                    className="add-button"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? 'Cancel' : '+ New Application'}
                </button>
            </div>

            {showAddForm && (
                <AddApplicationForm 
                    onSubmit={handleAddApplication}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

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
                    {applications.length > 0 ? (
                        applications.map((job) => (
                            <tr key={job.id}>
                                <td>{job.jobTitle}</td>
                                <td>{job.company}</td>
                                <td>{job.status}</td>
                                <td>{job.jobType}</td>
                                <td>{job.dateApplied?.toLocaleDateString() || 'No date'}</td>
                                <td>{job.location}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="empty-message">
                                No job applications found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const AddApplicationForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        status: 'Applied',
        jobType: 'Internship',
        location: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="application-form">
            <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Job Title"
                required
            />
            <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company"
                required
            />
            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
            >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>
            <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
            >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
            </select>
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
            />
            <div className="form-buttons">
                <button type="submit">Add Application</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default TableView;
