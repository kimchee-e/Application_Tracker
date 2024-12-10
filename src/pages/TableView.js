import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from '../context/AuthContext';
import { getApplications, addApplication, deleteApplication, updateApplication } from '../utils/firestore';
import "./../styles/TableView.css";
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react';
import ApplicationForm from '../components/ApplicationForm';
import EmailParsing from '../components/EmailParsing';

const StatusBadge = ({ status }) => (
    <span className={`status-badge status-${status.toLowerCase()}`}>
        {status}
    </span>
);

const SponsorshipBadge = ({ sponsors }) => (
    <span className={`sponsorship-badge sponsorship-${sponsors ? 'yes' : 'unknown'}`}>
        {sponsors ? 'Sponsors' : 'No Info'}
    </span>
);

const TableView = () => {
    const { user } = useAuth();
    const filterRef = useRef(null);
    const [applications, setApplications] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [notification, setNotification] = useState(null);

    const totalApplications = applications.length;
    const interviews = applications.filter(app => app.status === 'Interview').length;
    const offers = applications.filter(app => app.status === 'Offer').length;

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
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);
    
    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddApplication = async (applicationData) => {
        try {
            await addApplication(user.uid, applicationData);
            await loadApplications();
            setShowAddForm(false);
            showNotification('Application added successfully');
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
            showNotification('Application deleted');
            
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const handleEditApplication = async (applicationData) => {
        try {
            await updateApplication(editingId, applicationData);
            await loadApplications();
            setEditingId(null);
            showNotification('Application updated successfully');
        } catch (error) {
            console.error('Failed to update application:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const filteredApplications = applications.filter(app => {
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            if (!app.jobTitle.toLowerCase().includes(search) && 
                !app.company.toLowerCase().includes(search) && 
                !app.location.toLowerCase().includes(search)) {
                return false;
            }
        }
        return selectedStatuses.length === 0 || selectedStatuses.includes(app.status);
    });

    const handleStatusToggle = (status) => {
        setSelectedStatuses(prev => {
            const isSelected = prev.includes(status);
            if (isSelected) {
                return prev.filter(s => s !== status);
            } else {
                return [...prev, status];
            }
        });
    };

    const totalItems = filteredApplications.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = currentPage * rowsPerPage;
    
    const currentApplications = filteredApplications.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    if (loading) {
        return <div className="table-page">Loading...</div>;
    }

    return (
        <div className="table-page">
            <header>
                <h1>Applications</h1>
                <p>Track and manage your internship applications</p>
            </header>

            <section className="stats-container">
                <div className="metric-box">
                    <span className="metric-value">{totalApplications}</span>
                    <span className="metric-title">Total Applications</span>
                </div>
                <div className="metric-box">
                    <span className="metric-value">{interviews}</span>
                    <span className="metric-title">Interviews</span>
                </div>
                <div className="metric-box">
                    <span className="metric-value">{offers}</span>
                    <span className="metric-title">Offers</span>
                </div>
            </section>

            <section className="table-container">
                <div className="actions-bar">
                    <div className="search-and-filters">
                        <div className="search-bar">
                            <MagnifyingGlass size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search applications"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-container" ref={filterRef}>
                            <button onClick={() => setShowStatusFilter(!showStatusFilter)}>
                                <FunnelSimple size={18} />
                                Filters {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
                            </button>
                            {showStatusFilter && (
                                <div className="status-filter-container">
                                    <div className="filter-title">
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
                                        <div className="filter-footer">
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
                    {!editingId && (
                        <div className="buttonz">
                            <EmailParsing 
                                reload={loadApplications}
                                showNotification={showNotification}
                            />
                            <button className="add-button" onClick={() => setShowAddForm(true)}>
                                + New Application
                            </button>
                        </div>
                    )}
                </div>

                <table className="job-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Job Type</th>
                            <th>Date Applied</th>
                            <th>Location</th>
                            <th>Visa Sponsorship</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentApplications.length > 0 ? (
                            currentApplications.map((job) => (
                                <tr key={job.id}>
                                    <td>{job.jobTitle}</td>
                                    <td>{job.company}</td>
                                    <td><StatusBadge status={job.status} /></td>
                                    <td>{job.jobType}</td>
                                    <td>{job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : 'No date'}</td>
                                    <td>{job.location}</td>
                                    <td><SponsorshipBadge sponsors={job.visaSponsorship} /></td>
                                    <td className="row-actions">
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
            </section>

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

            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}
        </div>
    );
};

export default TableView;
