import React, { useState } from 'react';
import '../styles/ApplicationForm.css';

const ApplicationForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
    const [formData, setFormData] = useState({
        jobTitle: initialData?.jobTitle || '',
        company: initialData?.company || '',
        status: initialData?.status || 'Applied',
        jobType: initialData?.jobType || 'Internship',
        location: initialData?.location || '',
        postingUrl: initialData?.postingUrl || '',
        salary: initialData?.salary || '',
        notes: initialData?.notes || '',
        contactName: initialData?.contactName || '',
        contactEmail: initialData?.contactEmail || '',
        visaSponsorship: initialData?.visaSponsorship || false,
        interviewDate: initialData?.interviewDate || null
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
        <div className="application-form-overlay">
            <div className="application-form">
                <h2>{isEditing ? 'Edit Application' : 'New Application'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            placeholder="e.g., Frontend Developer"
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Company</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g., Apple"
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Job Posting URL</label>
                        <input
                            type="url"
                            name="postingUrl"
                            value={formData.postingUrl}
                            onChange={handleChange}
                            placeholder="https://"
                        />
                    </div>

                    <div className="field">
                        <label>Salary</label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g., $100,000/year"
                        />
                    </div>

                    <div className="field">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add notes you want to remember about this aplication..."
                            rows="3"
                        />
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label>Contact Name</label>
                            <input
                                type="text"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                placeholder="e.g., John Doe"
                            />
                        </div>

                        <div className="field">
                            <label>Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="e.g., johndoe@gmail.com"
                            />
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label>Interview Date</label>
                            <input
                                type="date"
                                name="interviewDate"
                                value={formData.interviewDate || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field checkbox-field">
                            <label>
                                <input
                                    type="checkbox"
                                    name="visaSponsorship"
                                    checked={formData.visaSponsorship}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'visaSponsorship',
                                            value: e.target.checked
                                        }
                                    })}
                                />
                                Visa Sponsorship Available
                            </label>
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label>Status</label>
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
                        </div>

                        <div className="field">
                            <label>Job Type</label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                            >
                                <option value="Internship">Internship</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., San Marcos, TX"
                            required
                        />
                    </div>

                    <div className="application-form-actions">
                        <button type="button" onClick={onCancel} className="cancel">
                            Cancel
                        </button>
                        <button type="submit" className="save">
                            {isEditing ? 'Save Changes' : 'Add Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default ApplicationForm; 