import { useState, useEffect } from 'react';
import { crmAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineCurrencyRupee, HiOutlineDocumentText
} from 'react-icons/hi2';

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientName: '', contact: '', email: '', projectName: '',
    description: '', amount: '', validUntil: '', status: 'Draft'
  });

  useEffect(() => { loadQuotations(); }, []);

  const loadQuotations = async () => {
    try {
      const res = await crmAPI.getQuotations();
      setQuotations(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ clientName: '', contact: '', email: '', projectName: '', description: '', amount: '', validUntil: '', status: 'Draft' });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: Number(formData.amount) || 0 };
      if (editId) {
        await crmAPI.updateQuotation(editId, payload);
        setToast({ message: 'Quotation updated!', type: 'success' });
      } else {
        await crmAPI.createQuotation(payload);
        setToast({ message: 'Quotation created!', type: 'success' });
      }
      setShowForm(false);
      resetForm();
      loadQuotations();
    } catch (err) {
      setToast({ message: 'Operation failed', type: 'error' });
    }
  };

  const handleEdit = (q) => {
    setFormData({
      clientName: q.clientName, contact: q.contact || '', email: q.email || '',
      projectName: q.projectName || '', description: q.description || '',
      amount: q.amount || '', validUntil: q.validUntil ? q.validUntil.split('T')[0] : '', status: q.status
    });
    setEditId(q._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quotation?')) return;
    try {
      await crmAPI.deleteQuotation(id);
      setToast({ message: 'Quotation deleted', type: 'success' });
      loadQuotations();
    } catch (err) {
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  const statusColor = (s) => {
    const map = { 'Draft': 'badge-secondary', 'Sent': 'badge-primary', 'Accepted': 'badge-success', 'Rejected': 'badge-danger' };
    return map[s] || 'badge-secondary';
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card">
        {quotations.length === 0 && !showForm ? (
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineCurrencyRupee /></div>
              <div className="empty-state-title">No Quotations Yet</div>
              <div className="empty-state-text">Create your first quotation to start managing proposals.</div>
            </div>
          </div>
        ) : !showForm && (
          <div className="card-body" style={{ padding: 0 }}>
            {quotations.map((q) => (
              <div className="list-item" key={q._id}>
                <div className="list-item-number">#{q.serialNumber}</div>
                <div className="list-item-content">
                  <div className="list-item-title">{q.clientName} {q.projectName && `— ${q.projectName}`}</div>
                  <div className="list-item-sub">
                    ₹{Number(q.amount || 0).toLocaleString('en-IN')}
                    {q.validUntil && ` • Valid until ${formatDate(q.validUntil)}`}
                  </div>
                </div>
                <span className={`badge ${statusColor(q.status)}`}>{q.status}</span>
                <div className="list-item-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleEdit(q)}><HiOutlinePencil /></button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(q._id)}><HiOutlineTrash style={{ color: 'var(--color-danger)' }} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="card-body">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>{editId ? 'Edit Quotation' : 'Create Quotation'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Client Name *</label>
                  <input className="form-input" placeholder="Client name" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input className="form-input" placeholder="Project name" value={formData.projectName} onChange={e => setFormData({ ...formData, projectName: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact</label>
                  <input className="form-input" placeholder="Phone number" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input className="form-input" type="number" placeholder="Quotation amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Valid Until</label>
                  <input className="form-input" type="date" value={formData.validUntil} onChange={e => setFormData({ ...formData, validUntil: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Quotation description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <div className="card-footer" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
              <HiOutlinePlus /> Create Quotation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
