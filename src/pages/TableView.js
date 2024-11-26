import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from '../context/AuthContext';
import { getApplications, addApplication, deleteApplication, updateApplication } from '../utils/firestore';
import "./../styles/TableView.css";
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react';
import ApplicationDetail from '../components/ApplicationDetail';

const StatusBadge = ({ status }) => {
    return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
};

const TableView = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const filterRef = useRef(null);
    const [notification, setNotification] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [viewType, setViewType] = useState('table');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowStatusFilter(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            setNotification('Application added successfully');
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Failed to add application:', error);
        }
    };

    const handleDeleteApplication = async (applicationId) => {
        if (!window.confirm('Are you sure you want to delete this application?')) {
            return;
        }

        try {
            await deleteApplication(applicationId);
            await loadApplications();
        } catch (error) {
            console.error('Failed to delete application:', error);
        }
    };

    const handleEditApplication = async (applicationData) => {
        try {
            await updateApplication(editingId, applicationData);
            await loadApplications();
            setEditingId(null);
            setNotification('Application updated successfully');
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Failed to update application:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const filteredApplications = applications.filter(app => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (
            app.jobTitle.toLowerCase().includes(searchLower) ||
            app.company.toLowerCase().includes(searchLower) ||
            app.location.toLowerCase().includes(searchLower)
        );
        
        return matchesSearch && (
            selectedStatuses.length === 0 || 
            selectedStatuses.includes(app.status)
        );
    });

    const handleStatusToggle = (status) => {
        setSelectedStatuses(prev => {
            if (prev.includes(status)) {
                return prev.filter(s => s !== status);
            }
            return [...prev, status];
        });
    };

    const totalItems = filteredApplications.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
    
    const currentApplications = filteredApplications.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    const handleRowClick = (application) => {
        setSelectedApplication(application);
    };

    if (loading) {
        return <div className="table-view-container">Loading...</div>;
    }

    return (
        <div className="table-view-container">
            <div className="page-header">
                <div className="header-content">
                    <h1>Internship Applications</h1>
                    <p className="header-description">
                        Track and manage your internship applications. 
                    </p>
                </div>
                {!editingId && (
                    <button 
                        className="add-button"
                        onClick={() => setShowAddForm(true)}
                    >
                        + New Application
                    </button>
                )}
            </div>

            <div className="table-stats">
                <div className="stat-item">
                    <span className="stat-number">{applications.length}</span>
                    <span className="stat-label">Total Applications</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">
                        {applications.filter(app => app.status === 'Interview').length}
                    </span>
                    <span className="stat-label">Interviews</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">
                        {applications.filter(app => app.status === 'Offer').length}
                    </span>
                    <span className="stat-label">Offers</span>
                </div>
            </div>

            <div className="search-container">
                <div className="search-section">
                    <div className="search-bar">
                        <MagnifyingGlass size={18} weight="regular" className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-container" ref={filterRef}>
                        <button 
                            className={`filter-button ${selectedStatuses.length > 0 ? 'active' : ''}`}
                            onClick={() => setShowStatusFilter(!showStatusFilter)}
                        >
                            <FunnelSimple size={18} weight="regular" />
                            Filters {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
                        </button>
                        {showStatusFilter && (
                            <div className="status-filter-menu">
                                <div className="filter-menu-header">
                                    Filter by Status
                                </div>
                                <div className="filter-options">
                                    <div className="filter-option">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedStatuses.includes('Applied')}
                                                onChange={() => handleStatusToggle('Applied')}
                                            />
                                            <StatusBadge status="Applied" />
                                        </label>
                                    </div>
                                    <div className="filter-option">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedStatuses.includes('Interview')}
                                                onChange={() => handleStatusToggle('Interview')}
                                            />
                                            <StatusBadge status="Interview" />
                                        </label>
                                    </div>
                                    <div className="filter-option">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedStatuses.includes('Offer')}
                                                onChange={() => handleStatusToggle('Offer')}
                                            />
                                            <StatusBadge status="Offer" />
                                        </label>
                                    </div>
                                    <div className="filter-option">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedStatuses.includes('Rejected')}
                                                onChange={() => handleStatusToggle('Rejected')}
                                            />
                                            <StatusBadge status="Rejected" />
                                        </label>
                                    </div>
                                </div>
                                {selectedStatuses.length > 0 && (
                                    <div className="filter-menu-footer">
                                        <button 
                                            className="clear-filters"
                                            onClick={() => setSelectedStatuses([])}
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="view-switch">
                        <span>Card View</span>
                        <label className="toggle">
                            <input 
                                type="checkbox"
                                checked={viewType === 'cards'}
                                onChange={() => setViewType(viewType === 'table' ? 'cards' : 'table')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            {showAddForm && !editingId && (
                <ApplicationForm 
                    onSubmit={handleAddApplication}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {editingId && (
                <ApplicationForm 
                    initialData={applications.find(app => app.id === editingId)}
                    onSubmit={handleEditApplication}
                    onCancel={handleCancelEdit}
                    isEditing
                />
            )}

            {viewType === 'table' ? (
                <table className="job-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Job Type</th>
                            <th>Date Applied</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentApplications.length > 0 ? (
                            currentApplications.map((job) => (
                                <tr 
                                    key={job.id} 
                                    onClick={() => handleRowClick(job)}
                                    className="clickable-row"
                                >
                                    <td>{job.jobTitle}</td>
                                    <td>{job.company}</td>
                                    <td><StatusBadge status={job.status} /></td>
                                    <td>{job.jobType}</td>
                                    <td>{job.dateApplied?.toLocaleDateString() || 'No date'}</td>
                                    <td>{job.location}</td>
                                    <td className="action-buttons">
                                        <button 
                                            className="edit-button"
                                            onClick={() => setEditingId(job.id)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDeleteApplication(job.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="empty-message">
                                    {searchTerm ? 'No matching applications found.' : 'No job applications found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <div className="card-view">
                    <div className="status-columns">
                        {['Applied', 'Interview', 'Offer', 'Rejected'].map(status => (
                            <div key={status} className="status-column">
                                <div className="column-header">
                                    <h3>{status}</h3>
                                    <span className="count">
                                        {filteredApplications.filter(app => app.status === status).length}
                                    </span>
                                </div>
                                <div className="cards-container">
                                    {filteredApplications
                                        .filter(app => app.status === status)
                                        .map(application => (
                                            <div 
                                                key={application.id} 
                                                className="application-card"
                                                onClick={() => handleRowClick(application)}
                                            >
                                                <h4>{application.jobTitle}</h4>
                                                <p className="company">{application.company}</p>
                                                <p className="location">{application.location}</p>
                                                <div className="card-footer">
                                                    <span className="date">
                                                        {application.dateApplied?.toLocaleDateString() || 'No date'}
                                                    </span>
                                                    <div className="card-actions">
                                                        <button 
                                                            className="edit-button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingId(application.id);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedApplication && (
                <ApplicationDetail
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}

            <div className="table-footer">
                <div className="rows-per-page">
                    <span>{`${startIndex + 1}-${endIndex} of ${totalItems}`}</span>
                    <span className="dot">•</span>
                    <span>Results per page</span>
                    <select 
                        className="page-select"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className="pagination-controls">
                    <button 
                        className="page-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button 
                        className="page-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </button>
                </div>
            </div>

            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}
        </div>
    );
};

const ApplicationForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
    const [formData, setFormData] = useState({
        jobTitle: initialData?.jobTitle || '',
        company: initialData?.company || '',
        status: initialData?.status || 'Applied',
        jobType: initialData?.jobType || 'Internship',
        location: initialData?.location || ''
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

export default TableView;
