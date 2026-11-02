import { useState, useEffect } from 'react';
import { crmAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineDocumentText, HiOutlinePhone, HiOutlineEnvelope
} from 'react-icons/hi2';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientName: '', contact: '', email: '', company: '',
    projectType: '', estimatedValue: '', source: '',
    details: '', status: 'New'
  });

  useEffect(() => { loadLeads(); }, []);

  const loadLeads = async () => {
    try {
      const res = await crmAPI.getLeads();
      setLeads(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ clientName: '', contact: '', email: '', company: '', projectType: '', estimatedValue: '', source: '', details: '', status: 'New' });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await crmAPI.updateLead(editId, formData);
        setToast({ message: 'Lead updated!', type: 'success' });
      } else {
        await crmAPI.createLead(formData);
        setToast({ message: 'Lead created!', type: 'success' });
      }
      setShowForm(false);
      resetForm();
      loadLeads();
    } catch (err) {
      setToast({ message: 'Operation failed', type: 'error' });
    }
  };

  const handleEdit = (lead) => {
    setFormData({
      clientName: lead.clientName, contact: lead.contact, email: lead.email || '',
      company: lead.company || '', projectType: lead.projectType || '',
      estimatedValue: lead.estimatedValue || '', source: lead.source || '',
      details: lead.details || '', status: lead.status
    });
    setEditId(lead._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await crmAPI.deleteLead(id);
      setToast({ message: 'Lead deleted', type: 'success' });
      loadLeads();
    } catch (err) {
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  const statusColor = (s) => {
    const map = { 'New': 'badge-primary', 'Contacted': 'badge-warning', 'Qualified': 'badge-success', 'Proposal': 'badge-primary', 'Won': 'badge-success', 'Lost': 'badge-danger' };
    return map[s] || 'badge-secondary';
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card">
        {/* Empty state → Blank page with Create button as specified */}
        {leads.length === 0 && !showForm ? (
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineDocumentText /></div>
              <div className="empty-state-title">No Leads Yet</div>
              <div className="empty-state-text">Start by creating your first lead to track potential clients.</div>
            </div>
          </div>
        ) : !showForm && (
          <div className="card-body" style={{ padding: 0 }}>
            {/* Sequential numbered list as specified */}
            {leads.map((lead) => (
              <div className="list-item" key={lead._id}>
                <div className="list-item-number">#{lead.serialNumber}</div>
                <div className="list-item-content">
                  <div className="list-item-title">{lead.clientName}</div>
                  <div className="list-item-sub">
                    {lead.contact && <><HiOutlinePhone style={{ fontSize: 12 }} /> {lead.contact}</>}
                    {lead.company && ` • ${lead.company}`}
                    {lead.estimatedValue > 0 && ` • ₹${Number(lead.estimatedValue).toLocaleString('en-IN')}`}
                  </div>
                </div>
                <span className={`badge ${statusColor(lead.status)}`}>{lead.status}</span>
                <div className="list-item-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleEdit(lead)}><HiOutlinePencil /></button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(lead._id)}><HiOutlineTrash style={{ color: 'var(--color-danger)' }} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="card-body">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>{editId ? 'Edit Lead' : 'Create Lead'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input className="form-input" placeholder="Client name" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input className="form-input" placeholder="Phone number" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="Email address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" placeholder="Company name" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <input className="form-input" placeholder="e.g., Residential, Commercial" value={formData.projectType} onChange={e => setFormData({ ...formData, projectType: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Estimated Value (₹)</label>
                  <input className="form-input" type="number" placeholder="Estimated value" value={formData.estimatedValue} onChange={e => setFormData({ ...formData, estimatedValue: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Source</label>
                  <input className="form-input" placeholder="e.g., Referral, Website" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Details</label>
                <textarea className="form-textarea" placeholder="Additional details..." value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })}></textarea>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* Bottom Create Button - as specified */}
        {!showForm && (
          <div className="card-footer" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
              <HiOutlinePlus /> Create Lead
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
