import { useState, useEffect } from 'react';
import { crmAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  HiOutlineUserGroup, HiOutlineCurrencyRupee, HiOutlinePlus,
  HiOutlinePencil, HiOutlineTrash, HiOutlinePhone, HiOutlineEnvelope,
  HiOutlineBuildingOffice, HiOutlineSparkles, HiOutlineArrowPath,
  HiOutlineDocumentText, HiOutlineCalendar, HiOutlineCheckCircle
} from 'react-icons/hi2';

export default function CrmDashboard({ initialTab = 'leads' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'leads' or 'quotations'
  const [leads, setLeads] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form states
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [editLeadId, setEditLeadId] = useState(null);
  const [editQuotationId, setEditQuotationId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Lead Form Data
  const [leadForm, setLeadForm] = useState({
    clientName: '',
    contact: '',
    email: '',
    company: '',
    projectType: '',
    estimatedValue: '',
    source: 'Direct Enquiry',
    details: '',
    status: 'New'
  });

  // Quotation Form Data
  const [quotationForm, setQuotationForm] = useState({
    clientName: '',
    projectName: '',
    contact: '',
    email: '',
    amount: '',
    validUntil: '',
    description: '',
    status: 'Draft'
  });

  // Load data on mount and tab switch
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsRes, quotesRes] = await Promise.all([
        crmAPI.getLeads(),
        crmAPI.getQuotations()
      ]);
      setLeads(leadsRes.data || []);
      setQuotations(quotesRes.data || []);
    } catch (err) {
      console.error('Error fetching CRM data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========== LEAD ACTIONS ==========
  const resetLeadForm = () => {
    setLeadForm({
      clientName: '', contact: '', email: '', company: '',
      projectType: '', estimatedValue: '', source: 'Direct Enquiry',
      details: '', status: 'New'
    });
    setEditLeadId(null);
    setShowLeadForm(false);
  };

  const handleOpenLeadCreate = () => {
    resetLeadForm();
    setShowLeadForm(true);
  };

  const handleEditLead = (lead) => {
    setLeadForm({
      clientName: lead.clientName || '',
      contact: lead.contact || '',
      email: lead.email || '',
      company: lead.company || '',
      projectType: lead.projectType || '',
      estimatedValue: lead.estimatedValue || '',
      source: lead.source || 'Direct Enquiry',
      details: lead.details || '',
      status: lead.status || 'New'
    });
    setEditLeadId(lead._id);
    setShowLeadForm(true);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...leadForm,
        estimatedValue: Number(leadForm.estimatedValue) || 0
      };

      if (editLeadId) {
        await crmAPI.updateLead(editLeadId, payload);
        setToast({ message: 'Lead updated successfully!', type: 'success' });
      } else {
        await crmAPI.createLead(payload);
        setToast({ message: 'New Lead added to sequential pipeline!', type: 'success' });
      }

      resetLeadForm();
      await loadData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save lead', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLead = async (id, serialNumber) => {
    if (!confirm(`Are you sure you want to delete Lead #${serialNumber}?`)) return;
    try {
      await crmAPI.deleteLead(id);
      setToast({ message: `Lead #${serialNumber} deleted`, type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to delete lead', type: 'error' });
    }
  };

  // ========== QUOTATION ACTIONS ==========
  const resetQuotationForm = () => {
    setQuotationForm({
      clientName: '', projectName: '', contact: '', email: '',
      amount: '', validUntil: '', description: '', status: 'Draft'
    });
    setEditQuotationId(null);
    setShowQuotationForm(false);
  };

  const handleOpenQuotationCreate = () => {
    resetQuotationForm();
    setShowQuotationForm(true);
  };

  const handleEditQuotation = (q) => {
    setQuotationForm({
      clientName: q.clientName || '',
      projectName: q.projectName || '',
      contact: q.contact || '',
      email: q.email || '',
      amount: q.amount || '',
      validUntil: q.validUntil ? q.validUntil.split('T')[0] : '',
      description: q.description || '',
      status: q.status || 'Draft'
    });
    setEditQuotationId(q._id);
    setShowQuotationForm(true);
  };

  const handleQuotationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...quotationForm,
        amount: Number(quotationForm.amount) || 0
      };

      if (editQuotationId) {
        await crmAPI.updateQuotation(editQuotationId, payload);
        setToast({ message: 'Quotation updated successfully!', type: 'success' });
      } else {
        await crmAPI.createQuotation(payload);
        setToast({ message: 'New Quotation added to sequential list!', type: 'success' });
      }

      resetQuotationForm();
      await loadData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save quotation', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuotation = async (id, serialNumber) => {
    if (!confirm(`Are you sure you want to delete Quotation #${serialNumber}?`)) return;
    try {
      await crmAPI.deleteQuotation(id);
      setToast({ message: `Quotation #${serialNumber} deleted`, type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to delete quotation', type: 'error' });
    }
  };

  // Seed samples helper for Subhashis Sir's testing
  const handleSeedSamples = async () => {
    setLoading(true);
    try {
      const res = await crmAPI.seedSamples();
      setToast({ message: res.data?.message || 'Sample CRM records loaded!', type: 'success' });
      await loadData();
    } catch (err) {
      setToast({ message: 'Error loading sample data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Badge helpers
  const leadStatusBadge = (s) => {
    const map = {
      'New': 'badge-primary',
      'Contacted': 'badge-warning',
      'Qualified': 'badge-success',
      'Proposal': 'badge-primary',
      'Won': 'badge-success',
      'Lost': 'badge-danger'
    };
    return map[s] || 'badge-secondary';
  };

  const quoteStatusBadge = (s) => {
    const map = {
      'Draft': 'badge-secondary',
      'Sent': 'badge-primary',
      'Accepted': 'badge-success',
      'Rejected': 'badge-danger'
    };
    return map[s] || 'badge-secondary';
  };

  const formatCurrency = (val) => {
    if (!val) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="crm-module-wrapper">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* STEP 2.1: CRM DASHBOARD SPLIT VIEW (Two Main Cards/Tabs: Lead and Quotation) */}
      <div className="crm-split-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>
              CRM Dashboard (Customer Relationship Management)
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Audio 1 Workflow: Split View $\rightarrow$ Blank Page $\rightarrow$ Create $\rightarrow$ Sequential Numbered List (#1, #2, #3...)
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              id="crm-refresh-btn"
              className="btn btn-secondary btn-sm" 
              onClick={loadData}
              title="Refresh CRM Records"
            >
              <HiOutlineArrowPath /> Refresh
            </button>
            <button 
              id="crm-load-samples-btn"
              className="btn btn-secondary btn-sm" 
              onClick={handleSeedSamples}
              title="Preload sample Lead and Quotation data for quick inspection"
            >
              <HiOutlineSparkles style={{ color: 'var(--color-primary)' }} /> Load Test Sample Data
            </button>
          </div>
        </div>

        {/* TWO MAIN SPLIT VIEW CARDS */}
        <div className="crm-cards-grid">
          {/* Card 1: Lead */}
          <div 
            id="crm-card-lead"
            className={`crm-split-card ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('leads');
              setShowLeadForm(false);
              setShowQuotationForm(false);
            }}
            role="button"
            tabIndex={0}
          >
            <div className="crm-card-top">
              <div className="crm-card-icon blue">
                <HiOutlineUserGroup />
              </div>
              <span className={`badge ${activeTab === 'leads' ? 'badge-primary' : 'badge-secondary'}`}>
                {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'}
              </span>
            </div>
            <div className="crm-card-title">1. Lead Management</div>
            <div className="crm-card-desc">
              Prospective construction clients, incoming site enquiries, and project pipeline tracking.
            </div>
            <div className="crm-card-status-indicator">
              {activeTab === 'leads' ? '● Currently Active View' : 'Click to view Lead page'}
            </div>
          </div>

          {/* Card 2: Quotation */}
          <div 
            id="crm-card-quotation"
            className={`crm-split-card ${activeTab === 'quotations' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('quotations');
              setShowLeadForm(false);
              setShowQuotationForm(false);
            }}
            role="button"
            tabIndex={0}
          >
            <div className="crm-card-top">
              <div className="crm-card-icon green">
                <HiOutlineCurrencyRupee />
              </div>
              <span className={`badge ${activeTab === 'quotations' ? 'badge-success' : 'badge-secondary'}`}>
                {quotations.length} {quotations.length === 1 ? 'Quotation' : 'Quotations'}
              </span>
            </div>
            <div className="crm-card-title">2. Quotation Management</div>
            <div className="crm-card-desc">
              Formal client rate quotations, civil project budgets, and approved cost proposals.
            </div>
            <div className="crm-card-status-indicator">
              {activeTab === 'quotations' ? '● Currently Active View' : 'Click to view Quotation page'}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ minHeight: 280 }}>
          <div className="spinner"></div>
          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>Loading CRM Records...</div>
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* VIEW A: LEADS MODULE (Blank Page -> Create -> Numbered List)    */}
          {/* ============================================================== */}
          {activeTab === 'leads' && (
            <div className="crm-view-container animate-fade">
              {/* State A.1: Creation / Edit Form */}
              {showLeadForm ? (
                <div className="card crm-form-card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="stat-icon blue" style={{ width: 34, height: 34, fontSize: 16 }}>
                        <HiOutlineDocumentText />
                      </div>
                      <div>
                        <span className="card-title">{editLeadId ? 'Edit Lead Entry' : 'Create New Lead Entry'}</span>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                          Fill in client requirements and save to append to the sequential list
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-ghost btn-sm" 
                      onClick={() => { setShowLeadForm(false); resetLeadForm(); }}
                    >
                      ✕ Close Form
                    </button>
                  </div>

                  <div className="card-body">
                    <form onSubmit={handleLeadSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Client Name *</label>
                          <input 
                            id="lead-client-name"
                            className="form-input" 
                            placeholder="e.g. Greenfield Infrastructure Pvt Ltd" 
                            value={leadForm.clientName} 
                            onChange={e => setLeadForm({ ...leadForm, clientName: e.target.value })} 
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Company / Developer Name</label>
                          <input 
                            id="lead-company"
                            className="form-input" 
                            placeholder="e.g. Greenfield Developers" 
                            value={leadForm.company} 
                            onChange={e => setLeadForm({ ...leadForm, company: e.target.value })} 
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Contact Phone Number *</label>
                          <input 
                            id="lead-contact"
                            className="form-input" 
                            placeholder="e.g. +91 98301 23456" 
                            value={leadForm.contact} 
                            onChange={e => setLeadForm({ ...leadForm, contact: e.target.value })} 
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Email Address</label>
                          <input 
                            id="lead-email"
                            className="form-input" 
                            type="email" 
                            placeholder="e.g. contact@greenfieldinfra.in" 
                            value={leadForm.email} 
                            onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} 
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Project Type / Work Nature</label>
                          <input 
                            id="lead-project-type"
                            className="form-input" 
                            placeholder="e.g. Commercial Complex, Residential Towers, Warehouse PEB" 
                            value={leadForm.projectType} 
                            onChange={e => setLeadForm({ ...leadForm, projectType: e.target.value })} 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Estimated Project Value (₹)</label>
                          <input 
                            id="lead-value"
                            className="form-input" 
                            type="number" 
                            placeholder="e.g. 45000000" 
                            value={leadForm.estimatedValue} 
                            onChange={e => setLeadForm({ ...leadForm, estimatedValue: e.target.value })} 
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Lead Source</label>
                          <select 
                            id="lead-source"
                            className="form-select" 
                            value={leadForm.source} 
                            onChange={e => setLeadForm({ ...leadForm, source: e.target.value })}
                          >
                            <option value="Direct Enquiry">Direct Enquiry</option>
                            <option value="Referral">Client Referral</option>
                            <option value="Site Visit">On-Site Visit</option>
                            <option value="Tender / RFP">Tender / RFP</option>
                            <option value="Website">Company Website</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Pipeline Status</label>
                          <select 
                            id="lead-status"
                            className="form-select" 
                            value={leadForm.status} 
                            onChange={e => setLeadForm({ ...leadForm, status: e.target.value })}
                          >
                            <option value="New">New Enquiry</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Proposal">Proposal Submitted</option>
                            <option value="Won">Deal Won (Project Converted)</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Work Scope & Project Requirements</label>
                        <textarea 
                          id="lead-details"
                          className="form-textarea" 
                          rows="3" 
                          placeholder="Provide details about structural piling, floor requirements, timeline, or site location..." 
                          value={leadForm.details} 
                          onChange={e => setLeadForm({ ...leadForm, details: e.target.value })}
                        />
                      </div>

                      {/* Required Bottom Save Action Bar */}
                      <div className="crm-bottom-action-bar">
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => { setShowLeadForm(false); resetLeadForm(); }}
                        >
                          Cancel
                        </button>
                        <button 
                          id="lead-save-btn"
                          type="submit" 
                          className="btn btn-primary" 
                          disabled={submitting}
                        >
                          {submitting ? 'Saving...' : 'Save Lead Entry'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : leads.length === 0 ? (
                /* STEP 2.2: EMPTY STATE → BLANK PAGE WITH CREATE BUTTON AT BOTTOM */
                <div className="crm-blank-page card">
                  <div className="crm-blank-content">
                    <div className="crm-blank-icon">
                      <HiOutlineDocumentText />
                    </div>
                    <h3 className="crm-blank-title">Lead Page is Currently Blank</h3>
                    <p className="crm-blank-desc">
                      As requested by Subhashis Sir in Audio 1, this page initializes as a clean, blank slate.
                      Click the <strong>"Create Lead"</strong> button at the bottom to register your first client lead.
                    </p>
                  </div>

                  {/* BOTTOM ACTION BAR (Audio 1 requirement) */}
                  <div className="crm-blank-bottom-bar">
                    <button 
                      id="create-lead-blank-btn"
                      className="btn btn-primary btn-lg" 
                      onClick={handleOpenLeadCreate}
                    >
                      <HiOutlinePlus /> Create Lead
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2.3: NUMBERED SEQUENTIAL LIST VIEW (#1, #2, #3...) */
                <div className="crm-list-container card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="card-title">Sequentially Numbered Leads List</span>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        Entries are numbered chronologically as saved (1, 2, 3...)
                      </div>
                    </div>
                    <span className="badge badge-primary">{leads.length} Total Leads</span>
                  </div>

                  <div className="card-body" style={{ padding: 0 }}>
                    {leads.map((lead, idx) => (
                      <div className="crm-numbered-item" key={lead._id || idx}>
                        {/* SEQUENTIAL NUMBER BADGE (#1, #2, #3...) */}
                        <div className="crm-serial-number" title={`Sequential Record #${lead.serialNumber || idx + 1}`}>
                          #{lead.serialNumber || idx + 1}
                        </div>

                        <div className="crm-item-main">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span className="crm-item-title">{lead.clientName}</span>
                            {lead.company && (
                              <span className="crm-item-company">
                                <HiOutlineBuildingOffice style={{ fontSize: 13 }} /> {lead.company}
                              </span>
                            )}
                            <span className={`badge ${leadStatusBadge(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>

                          <div className="crm-item-details">
                            {lead.contact && (
                              <span className="crm-meta-chip">
                                <HiOutlinePhone /> {lead.contact}
                              </span>
                            )}
                            {lead.email && (
                              <span className="crm-meta-chip">
                                <HiOutlineEnvelope /> {lead.email}
                              </span>
                            )}
                            {lead.projectType && (
                              <span className="crm-meta-chip">
                                <HiOutlineDocumentText /> {lead.projectType}
                              </span>
                            )}
                            {lead.estimatedValue > 0 && (
                              <span className="crm-meta-chip value-highlight">
                                Est. Value: {formatCurrency(lead.estimatedValue)}
                              </span>
                            )}
                          </div>

                          {lead.details && (
                            <div className="crm-item-notes">
                              {lead.details}
                            </div>
                          )}
                        </div>

                        <div className="crm-item-actions">
                          <button 
                            id={`edit-lead-${lead.serialNumber || idx + 1}`}
                            className="btn btn-ghost btn-sm btn-icon" 
                            onClick={() => handleEditLead(lead)}
                            title="Edit Lead"
                          >
                            <HiOutlinePencil />
                          </button>
                          <button 
                            id={`delete-lead-${lead.serialNumber || idx + 1}`}
                            className="btn btn-ghost btn-sm btn-icon" 
                            onClick={() => handleDeleteLead(lead._id, lead.serialNumber || idx + 1)}
                            title="Delete Lead"
                          >
                            <HiOutlineTrash style={{ color: 'var(--color-danger)' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BOTTOM ACTION BAR TO CONTINUE ADDING TO NUMBERED LIST */}
                  <div className="crm-numbered-bottom-bar">
                    <button 
                      id="create-lead-bottom-btn"
                      className="btn btn-primary" 
                      onClick={handleOpenLeadCreate}
                    >
                      <HiOutlinePlus /> Create Lead #{leads.length + 1}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW B: QUOTATIONS MODULE (Blank Page -> Create -> Numbered List) */}
          {/* ============================================================== */}
          {activeTab === 'quotations' && (
            <div className="crm-view-container animate-fade">
              {/* State B.1: Creation / Edit Form */}
              {showQuotationForm ? (
                <div className="card crm-form-card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="stat-icon green" style={{ width: 34, height: 34, fontSize: 16 }}>
                        <HiOutlineCurrencyRupee />
                      </div>
                      <div>
                        <span className="card-title">{editQuotationId ? 'Edit Quotation' : 'Create New Quotation'}</span>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                          Issue client estimate and save to append to the sequential list
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-ghost btn-sm" 
                      onClick={() => { setShowQuotationForm(false); resetQuotationForm(); }}
                    >
                      ✕ Close Form
                    </button>
                  </div>

                  <div className="card-body">
                    <form onSubmit={handleQuotationSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Client Name *</label>
                          <input 
                            id="quote-client-name"
                            className="form-input" 
                            placeholder="e.g. M/s Greenfield Infrastructure Pvt Ltd" 
                            value={quotationForm.clientName} 
                            onChange={e => setQuotationForm({ ...quotationForm, clientName: e.target.value })} 
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Project / Site Name *</label>
                          <input 
                            id="quote-project-name"
                            className="form-input" 
                            placeholder="e.g. New Town Commercial Complex Phase 1" 
                            value={quotationForm.projectName} 
                            onChange={e => setQuotationForm({ ...quotationForm, projectName: e.target.value })} 
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Contact Number</label>
                          <input 
                            id="quote-contact"
                            className="form-input" 
                            placeholder="e.g. +91 98301 23456" 
                            value={quotationForm.contact} 
                            onChange={e => setQuotationForm({ ...quotationForm, contact: e.target.value })} 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Contact Email</label>
                          <input 
                            id="quote-email"
                            className="form-input" 
                            type="email" 
                            placeholder="e.g. procurement@greenfieldinfra.in" 
                            value={quotationForm.email} 
                            onChange={e => setQuotationForm({ ...quotationForm, email: e.target.value })} 
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Quotation Amount (₹) *</label>
                          <input 
                            id="quote-amount"
                            className="form-input" 
                            type="number" 
                            placeholder="e.g. 42500000" 
                            value={quotationForm.amount} 
                            onChange={e => setQuotationForm({ ...quotationForm, amount: e.target.value })} 
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Validity Expiration Date</label>
                          <input 
                            id="quote-validity"
                            className="form-input" 
                            type="date" 
                            value={quotationForm.validUntil} 
                            onChange={e => setQuotationForm({ ...quotationForm, validUntil: e.target.value })} 
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Quotation Status</label>
                        <select 
                          id="quote-status"
                          className="form-select" 
                          value={quotationForm.status} 
                          onChange={e => setQuotationForm({ ...quotationForm, status: e.target.value })}
                        >
                          <option value="Draft">Draft (Under Review)</option>
                          <option value="Sent">Sent to Client</option>
                          <option value="Accepted">Accepted / Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Scope of Work & Commercial Terms</label>
                        <textarea 
                          id="quote-description"
                          className="form-textarea" 
                          rows="3" 
                          placeholder="Foundation RCC, steel structure, labour and equipment mobilization terms..." 
                          value={quotationForm.description} 
                          onChange={e => setQuotationForm({ ...quotationForm, description: e.target.value })}
                        />
                      </div>

                      {/* Required Bottom Save Action Bar */}
                      <div className="crm-bottom-action-bar">
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => { setShowQuotationForm(false); resetQuotationForm(); }}
                        >
                          Cancel
                        </button>
                        <button 
                          id="quote-save-btn"
                          type="submit" 
                          className="btn btn-primary" 
                          disabled={submitting}
                        >
                          {submitting ? 'Saving...' : 'Save Quotation Entry'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : quotations.length === 0 ? (
                /* STEP 2.2: EMPTY STATE → BLANK PAGE WITH CREATE BUTTON AT BOTTOM */
                <div className="crm-blank-page card">
                  <div className="crm-blank-content">
                    <div className="crm-blank-icon">
                      <HiOutlineCurrencyRupee />
                    </div>
                    <h3 className="crm-blank-title">Quotation Page is Currently Blank</h3>
                    <p className="crm-blank-desc">
                      As requested by Subhashis Sir in Audio 1, this page initializes as a clean, blank slate.
                      Click the <strong>"Create Quotation"</strong> button at the bottom to draft your first estimate.
                    </p>
                  </div>

                  {/* BOTTOM ACTION BAR (Audio 1 requirement) */}
                  <div className="crm-blank-bottom-bar">
                    <button 
                      id="create-quotation-blank-btn"
                      className="btn btn-primary btn-lg" 
                      onClick={handleOpenQuotationCreate}
                    >
                      <HiOutlinePlus /> Create Quotation
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2.3: NUMBERED SEQUENTIAL LIST VIEW (#1, #2, #3...) */
                <div className="crm-list-container card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="card-title">Sequentially Numbered Quotations List</span>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        Entries are numbered chronologically as saved (1, 2, 3...)
                      </div>
                    </div>
                    <span className="badge badge-success">{quotations.length} Total Quotations</span>
                  </div>

                  <div className="card-body" style={{ padding: 0 }}>
                    {quotations.map((q, idx) => (
                      <div className="crm-numbered-item" key={q._id || idx}>
                        {/* SEQUENTIAL NUMBER BADGE (#1, #2, #3...) */}
                        <div className="crm-serial-number" title={`Sequential Record #${q.serialNumber || idx + 1}`}>
                          #{q.serialNumber || idx + 1}
                        </div>

                        <div className="crm-item-main">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span className="crm-item-title">{q.clientName}</span>
                            {q.projectName && (
                              <span className="crm-item-company">
                                Project: <strong>{q.projectName}</strong>
                              </span>
                            )}
                            <span className={`badge ${quoteStatusBadge(q.status)}`}>
                              {q.status}
                            </span>
                          </div>

                          <div className="crm-item-details">
                            <span className="crm-meta-chip value-highlight">
                              Amount: {formatCurrency(q.amount)}
                            </span>
                            {q.contact && (
                              <span className="crm-meta-chip">
                                <HiOutlinePhone /> {q.contact}
                              </span>
                            )}
                            {q.validUntil && (
                              <span className="crm-meta-chip">
                                <HiOutlineCalendar /> Valid until {formatDate(q.validUntil)}
                              </span>
                            )}
                          </div>

                          {q.description && (
                            <div className="crm-item-notes">
                              {q.description}
                            </div>
                          )}
                        </div>

                        <div className="crm-item-actions">
                          <button 
                            id={`edit-quote-${q.serialNumber || idx + 1}`}
                            className="btn btn-ghost btn-sm btn-icon" 
                            onClick={() => handleEditQuotation(q)}
                            title="Edit Quotation"
                          >
                            <HiOutlinePencil />
                          </button>
                          <button 
                            id={`delete-quote-${q.serialNumber || idx + 1}`}
                            className="btn btn-ghost btn-sm btn-icon" 
                            onClick={() => handleDeleteQuotation(q._id, q.serialNumber || idx + 1)}
                            title="Delete Quotation"
                          >
                            <HiOutlineTrash style={{ color: 'var(--color-danger)' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BOTTOM ACTION BAR TO CONTINUE ADDING TO NUMBERED LIST */}
                  <div className="crm-numbered-bottom-bar">
                    <button 
                      id="create-quotation-bottom-btn"
                      className="btn btn-primary" 
                      onClick={handleOpenQuotationCreate}
                    >
                      <HiOutlinePlus /> Create Quotation #{quotations.length + 1}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
