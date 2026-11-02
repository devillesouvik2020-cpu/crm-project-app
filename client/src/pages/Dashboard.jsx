import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  HiOutlinePlus, HiOutlineMapPin, HiOutlineCalendarDays,
  HiOutlineCurrencyRupee, HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentList, HiOutlineUserGroup,
  HiOutlineTrash
} from 'react-icons/hi2';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    projectName: '', address: '', startDate: '', endDate: '',
    projectValue: '', partyName: '', status: 'Active',
    staffName: '', staffDesignation: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        projectName: formData.projectName,
        address: formData.address,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        projectValue: Number(formData.projectValue) || 0,
        partyName: formData.partyName,
        status: formData.status,
        assignedStaff: formData.staffName ? [{
          name: formData.staffName,
          designation: formData.staffDesignation
        }] : []
      };
      await projectAPI.create(payload);
      setShowCreate(false);
      setFormData({ projectName: '', address: '', startDate: '', endDate: '', projectValue: '', partyName: '', status: 'Active', staffName: '', staffDesignation: '' });
      setToast({ message: 'Project created successfully!', type: 'success' });
      loadProjects();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create project', type: 'error' });
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this project?')) return;
    try {
      await projectAPI.delete(id);
      setToast({ message: 'Project deleted', type: 'success' });
      loadProjects();
    } catch (err) {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const formatCurrency = (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '₹0';

  const statusClass = (s) => {
    const map = { 'Active': 'status-active', 'Planning': 'status-planning', 'Completed': 'status-completed', 'On Hold': 'status-on-hold' };
    return map[s] || 'status-active';
  };

  // Dashboard stats
  const stats = [
    { label: 'Total Projects', value: projects.length, icon: <HiOutlineBuildingOffice2 />, color: 'blue' },
    { label: 'Active', value: projects.filter(p => p.status === 'Active').length, icon: <HiOutlineClipboardDocumentList />, color: 'green' },
    { label: 'Planning', value: projects.filter(p => p.status === 'Planning').length, icon: <HiOutlineCalendarDays />, color: 'orange' },
    { label: 'Staff Assigned', value: projects.reduce((sum, p) => sum + (p.assignedStaff?.length || 0), 0), icon: <HiOutlineUserGroup />, color: 'red' },
  ];

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="action-header">
        <h2 className="action-header-title">Projects</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => { setFormData({ ...formData, status: 'Active' }); setShowCreate(true); }}>
            <HiOutlinePlus /> Create Project
          </button>
          <button className="btn btn-secondary" onClick={() => { setFormData({ ...formData, status: 'Planning' }); setShowCreate(true); }}>
            <HiOutlinePlus /> Planning Project
          </button>
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><HiOutlineBuildingOffice2 /></div>
          <div className="empty-state-title">No Projects Yet</div>
          <div className="empty-state-text">Create your first project to get started with managing construction sites.</div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}><HiOutlinePlus /> Create Project</button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map(project => (
            <div className="project-card" key={project._id} onClick={() => navigate(`/project/${project._id}`)}>
              <div className="project-card-image">
                {project.projectPhotoUrl ? (
                  <img src={project.projectPhotoUrl} alt={project.projectName} />
                ) : (
                  <HiOutlineBuildingOffice2 />
                )}
                <span className={`project-card-status ${statusClass(project.status)}`}>{project.status}</span>
              </div>
              <div className="project-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div className="project-card-name">{project.projectName}</div>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => handleDelete(project._id, e)} title="Delete">
                    <HiOutlineTrash style={{ fontSize: 16, color: 'var(--color-danger)' }} />
                  </button>
                </div>
                {project.address && (
                  <div className="project-card-address"><HiOutlineMapPin /> {project.address}</div>
                )}
                <div className="project-card-meta">
                  <div className="project-card-meta-item">
                    <HiOutlineCalendarDays />
                    <span className="project-card-meta-value">{formatDate(project.startDate)}</span>
                  </div>
                  <div className="project-card-meta-item">
                    <HiOutlineCurrencyRupee />
                    <span className="project-card-meta-value">{formatCurrency(project.projectValue)}</span>
                  </div>
                  <div className="project-card-meta-item">
                    <HiOutlineUserGroup />
                    <span className="project-card-meta-value">{project.assignedStaff?.length || 0} staff</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <h3 className="modal-title">{formData.status === 'Planning' ? 'Planning Project' : 'Create Project'}</h3>
              <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                {/* 1. Project Name */}
                <div className="form-group">
                  <label className="form-label">1. Project Name *</label>
                  <input className="form-input" placeholder="Enter project name" value={formData.projectName} onChange={e => setFormData({ ...formData, projectName: e.target.value })} required />
                </div>
                {/* 2. Address */}
                <div className="form-group">
                  <label className="form-label">2. Project Address</label>
                  <input className="form-input" placeholder="Enter project address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>
                {/* 3. Dates */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">3. Start Date</label>
                    <input className="form-input" type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                  </div>
                </div>
                {/* 4. Project Value */}
                <div className="form-group">
                  <label className="form-label">4. Project Value (₹)</label>
                  <input className="form-input" type="number" placeholder="Enter project value" value={formData.projectValue} onChange={e => setFormData({ ...formData, projectValue: e.target.value })} />
                </div>
                {/* 5. Site Staff (inserted per 12:25 correction) */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">5. Site Staff Name</label>
                    <input className="form-input" placeholder="Staff name" value={formData.staffName} onChange={e => setFormData({ ...formData, staffName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Staff Designation</label>
                    <input className="form-input" placeholder="Designation" value={formData.staffDesignation} onChange={e => setFormData({ ...formData, staffDesignation: e.target.value })} />
                  </div>
                </div>
                {/* 6. Party Name */}
                <div className="form-group">
                  <label className="form-label">6. Party Name (Company)</label>
                  <input className="form-input" placeholder="Client/Company name" value={formData.partyName} onChange={e => setFormData({ ...formData, partyName: e.target.value })} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Items 7–13 (DPR, Transactions, Site Progress, Tasks, Designs, Files, Meetings) can be managed from the project detail page after creation.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
