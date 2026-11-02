import { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineClipboardDocumentList
} from 'react-icons/hi2';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', address: '', designation: '', mobileNumber: '',
    gender: 'Male', age: ''
  });

  useEffect(() => { loadResources(); }, []);

  const loadResources = async () => {
    try {
      const res = await resourceAPI.getAll();
      setResources(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', designation: '', mobileNumber: '', gender: 'Male', age: '' });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, age: Number(formData.age) || 0 };
      if (editId) {
        await resourceAPI.update(editId, payload);
        setToast({ message: 'Resource updated!', type: 'success' });
      } else {
        await resourceAPI.create(payload);
        setToast({ message: 'Resource added!', type: 'success' });
      }
      setShowForm(false);
      resetForm();
      loadResources();
    } catch (err) {
      setToast({ message: 'Operation failed', type: 'error' });
    }
  };

  const handleEdit = (r) => {
    setFormData({
      name: r.name, address: r.address || '', designation: r.designation || '',
      mobileNumber: r.mobileNumber || '', gender: r.gender || 'Male', age: r.age || ''
    });
    setEditId(r._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await resourceAPI.delete(id);
      setToast({ message: 'Resource deleted', type: 'success' });
      loadResources();
    } catch (err) {
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="action-header">
        <h2 className="action-header-title">Resource Directory</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <HiOutlinePlus /> Add Resource
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Resource' : 'Add Resource'}</h3>
              <button className="modal-close" onClick={() => { setShowForm(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">1. Name *</label>
                  <input className="form-input" placeholder="Full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">2. Address</label>
                  <textarea className="form-textarea" placeholder="Residential/contact address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ minHeight: 60 }}></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">3. Designation</label>
                    <input className="form-input" placeholder="e.g., Mason, Electrician" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">4. Mobile Number</label>
                    <input className="form-input" placeholder="Contact number" value={formData.mobileNumber} onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">5. Gender</label>
                    <select className="form-select" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">6. Age</label>
                    <input className="form-input" type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resources Table */}
      <div className="card">
        {resources.length === 0 ? (
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineClipboardDocumentList /></div>
              <div className="empty-state-title">No Resources</div>
              <div className="empty-state-text">Add workforce resources (workers, engineers, supervisors) to your directory.</div>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Mobile</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {resources.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.address}</div>
                    </td>
                    <td><span className="badge badge-primary">{r.designation || '—'}</span></td>
                    <td>{r.mobileNumber || '—'}</td>
                    <td>{r.gender}</td>
                    <td>{r.age || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleEdit(r)}><HiOutlinePencil /></button>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(r._id)}><HiOutlineTrash style={{ color: 'var(--color-danger)' }} /></button>
                      </div>
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
