import React from 'react';
import '../styles/ApplicationDetail.css';

const ApplicationDetail = ({ application, onClose }) => {
    if (!application) return null;

    return (
        <div className="overlay" onClick={onClose}>
            <div className="card" onClick={e => e.stopPropagation()}>
                <div className="header">
                    <div>
                        <h2>{application.jobTitle}</h2>
                        <p className="company">{application.company}</p>
                        <a href={application.postingUrl} target="_blank" className="posting-link">
                            View Job Posting
                        </a>
                    </div>
                    <button className="close" onClick={onClose}>×</button>
                </div>
                
                <div className="content">
                    <div className="info">
                        <div className="section">
                            <h3>Application Details</h3>
                            <div className="row">
                                <div className="field">
                                    <label>Status</label>
                                    <span className={`status-badge status-${application.status.toLowerCase()}`}>
                                        {application.status}
                                    </span>
                                </div>
                                <div className="field">
                                    <label>Job Type</label>
                                    <span>{application.jobType}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="field">
                                    <label>Location</label>
                                    <span>{application.location}</span>
                                </div>
                                <div className="field">
                                    <label>Salary</label>
                                    <span>{application.salary || '—'}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="field">
                                    <label>Date Applied</label>
                                    <span>{application.dateApplied?.toLocaleDateString() || '—'}</span>
                                </div>
                                <div className="field">
                                    <label>Interview Date</label>
                                    <span>{application.interviewDate?.toLocaleDateString() || '—'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <h3>Contact Information</h3>
                            <div className="row">
                                <div className="field">
                                    <label>Contact Name</label>
                                    <span>{application.contactName || '—'}</span>
                                </div>
                                <div className="field">
                                    <label>Contact Email</label>
                                    <span>{application.contactEmail || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {application.notes && (
                            <div className="section">
                                <h3>Notes</h3>
                                <div className="notes-field">
                                    <p>{application.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetail; 