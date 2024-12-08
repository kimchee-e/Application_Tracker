import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from '../context/AuthContext';
import { getApplications, addApplication, deleteApplication, updateApplication } from '../utils/firestore';
import "./../styles/TableView.css";
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react';
import ApplicationDetail from '../components/ApplicationDetail';
import ApplicationForm from '../components/ApplicationForm';

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

export default TableView;
