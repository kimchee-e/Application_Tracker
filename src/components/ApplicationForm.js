import React, { useState } from 'react';
import '../styles/ApplicationForm.css';
import { checkSponsorship } from '../utils/sponsorshipCheck';

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

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        
        if (name === 'company') {
            const isSponsoring = checkSponsorship(value);
            console.log('Company', value);
            console.log('Sponsoring visas?', isSponsoring);
            
            setFormData(prev => ({
                ...prev,
                company: value,
                visaSponsorship: isSponsoring
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="form-page">
            <div className="form-container">
                <div className="form-header">
                    <h2>{isEditing ? 'Edit Application' : 'Add Application'}</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-field">
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="e.g., Software Engineer"
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label>Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g., Amazon"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
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
                        <div className="form-field">
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

                    <div className="form-field">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Austin, TX"
                        />
                    </div>

                    <div className="form-field">
                        <label>Job URL</label>
                        <input
                            type="url"
                            name="postingUrl"
                            value={formData.postingUrl}
                            onChange={handleChange}
                            placeholder="https://"
                        />
                    </div>

                    <div className="form-field">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Add any notes you want to remember about this application..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>Contact Name</label>
                            <input
                                type="text"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                placeholder="e.g., Jeff Bezos"
                            />
                        </div>
                        <div className="form-field">
                            <label>Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="e.g., jeff@amazon.com"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>Interview Date</label>
                            <input
                                type="date"
                                name="interviewDate"
                                value={formData.interviewDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-field checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    name="visaSponsorship"
                                    checked={formData.visaSponsorship}
                                    onChange={handleChange}
                                />
                                Visa Sponsorship Available
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="form-button cancel" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="form-button submit">
                            {isEditing ? 'Save Changes' : 'Add Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default ApplicationForm; 