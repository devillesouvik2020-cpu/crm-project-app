import { useState, useEffect } from 'react';
import { inviteAPI, projectAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  HiOutlinePlus, HiOutlineTrash, HiOutlineEnvelope,
  HiOutlineDevicePhoneMobile, HiOutlineLink
} from 'react-icons/hi2';

export default function Invite() {
  const [invites, setInvites] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userType: 'Site Engineer', name: '', email: '',
    mobileNumber: '', designation: '', assignedProjectId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invRes, projRes] = await Promise.all([
        inviteAPI.getAll(),
        projectAPI.getAll()
      ]);
      setInvites(invRes.data);
      setProjects(projRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await inviteAPI.create(formData);
      setToast({ message: res.data.message, type: 'success' });
      setShowForm(false);
      setFormData({ userType: 'Site Engineer', name: '', email: '', mobileNumber: '', designation: '', assignedProjectId: '' });
      loadData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create invite', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this invite?')) return;
    try {
      await inviteAPI.delete(id);
      setToast({ message: 'Invite deleted', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="action-header">
        <h2 className="action-header-title">Invite Users to Projects</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <HiOutlinePlus /> Create Invite
        </button>
      </div>

      {/* Create Invite Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Invite Project User</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">User Type *</label>
                  <select className="form-select" value={formData.userType} onChange={e => setFormData({ ...formData, userType: e.target.value })}>
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Site Manager">Site Manager</option>
                    <option value="Worker">Worker</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="Full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input className="form-input" placeholder="Primary login ID" value={formData.mobileNumber} onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input className="form-input" placeholder="Job title" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign to Project *</label>
                  <select className="form-select" value={formData.assignedProjectId} onChange={e => setFormData({ ...formData, assignedProjectId: e.target.value })} required>
                    <option value="">Select a project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.projectName}</option>
                    ))}
                  </select>
                </div>
                <div style={{ background: 'var(--color-primary-light)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--color-primary)' }}>
                  <strong>Note:</strong> The user will be able to log in with their mobile number as both username and default password. They will only see the assigned project.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invites List */}
      <div className="card">
        {invites.length === 0 ? (
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineEnvelope /></div>
              <div className="empty-state-title">No Invites Sent</div>
              <div className="empty-state-text">Invite site staff to join specific projects. They'll log in with their mobile number.</div>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Mobile</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invites.map(inv => (
                  <tr key={inv._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{inv.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{inv.designation}</div>
                    </td>
                    <td><span className="badge badge-primary">{inv.userType}</span></td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}><HiOutlineDevicePhoneMobile /> {inv.mobileNumber}</td>
                    <td>{inv.assignedProjectId?.projectName || '—'}</td>
                    <td><span className={`badge ${inv.inviteStatus === 'Accepted' ? 'badge-success' : 'badge-warning'}`}>{inv.inviteStatus}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(inv._id)}>
                        <HiOutlineTrash style={{ color: 'var(--color-danger)' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
