import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  HiOutlineArrowLeft, HiOutlineMapPin, HiOutlineCalendarDays,
  HiOutlineCurrencyRupee, HiOutlineUserGroup, HiOutlineDocumentText,
  HiOutlineBanknotes, HiOutlineChartBar, HiOutlineWrench,
  HiOutlinePhoto, HiOutlineFolder, HiOutlineCalendar,
  HiOutlinePlus, HiOutlineCheckCircle, HiOutlinePaperClip,
  HiOutlineXMark, HiOutlineArrowDownTray
} from 'react-icons/hi2';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState(null);
  const [activeTab, setActiveTab] = useState('dpr');
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states for each type
  const [dprForm, setDprForm] = useState({ laborCount: '', floorTowerDetails: '', materialNotes: '', attachments: [] });
  const [previewFile, setPreviewFile] = useState(null);
  const [txnForm, setTxnForm] = useState({ amount: '', type: 'Expense', remarks: '' });
  const [progressForm, setProgressForm] = useState({ progressPercentage: '', remarks: '' });
  const [taskForm, setTaskForm] = useState({ problem: '', plan: '', solution: '', status: 'Open' });
  const [meetingForm, setMeetingForm] = useState({ date: '', agenda: '', participants: '', notes: '' });

  const handleDprFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => resolve({
        name: file.name,
        url: ev.target.result,
        type: file.type,
        size: file.size
      });
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(newAttachments => {
      setDprForm(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...newAttachments]
      }));
    });
  };

  const removeDprAttachment = (index) => {
    setDprForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, idx) => idx !== index)
    }));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [projRes, updRes] = await Promise.all([
        projectAPI.getOne(id),
        projectAPI.getUpdates(id)
      ]);
      setProject(projRes.data);
      setUpdates(updRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (activeTab) {
        case 'dpr':
          await projectAPI.addDPR(id, {
            laborCount: Number(dprForm.laborCount),
            floorTowerDetails: dprForm.floorTowerDetails,
            materialNotes: dprForm.materialNotes,
            attachments: dprForm.attachments || []
          });
          setDprForm({ laborCount: '', floorTowerDetails: '', materialNotes: '', attachments: [] });
          break;
        case 'transaction':
          await projectAPI.addTransaction(id, { amount: Number(txnForm.amount), type: txnForm.type, remarks: txnForm.remarks });
          setTxnForm({ amount: '', type: 'Expense', remarks: '' });
          break;
        case 'progress':
          await projectAPI.addProgress(id, { progressPercentage: Number(progressForm.progressPercentage), remarks: progressForm.remarks });
          setProgressForm({ progressPercentage: '', remarks: '' });
          break;
        case 'task':
          await projectAPI.addTask(id, taskForm);
          setTaskForm({ problem: '', plan: '', solution: '', status: 'Open' });
          break;
        case 'meeting':
          await projectAPI.addMeeting(id, { ...meetingForm, participants: meetingForm.participants.split(',').map(p => p.trim()) });
          setMeetingForm({ date: '', agenda: '', participants: '', notes: '' });
          break;
      }
      setShowForm(false);
      setToast({ message: 'Entry added successfully!', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to add entry', type: 'error' });
    }
  };

  const tabs = [
    { key: 'dpr', label: 'DPR', icon: <HiOutlineDocumentText /> },
    { key: 'transaction', label: 'Transaction', icon: <HiOutlineBanknotes /> },
    { key: 'progress', label: 'Site Progress', icon: <HiOutlineChartBar /> },
    { key: 'task', label: 'Tasks', icon: <HiOutlineWrench /> },
    { key: 'design', label: 'Designs', icon: <HiOutlinePhoto /> },
    { key: 'files', label: 'Files', icon: <HiOutlineFolder /> },
    { key: 'meeting', label: 'Meetings', icon: <HiOutlineCalendar /> },
  ];

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!project) return <div className="empty-state"><div className="empty-state-title">Project not found</div></div>;

  const latestProgress = updates?.siteProgress?.length > 0
    ? updates.siteProgress[updates.siteProgress.length - 1].progressPercentage
    : 0;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="project-detail-header">
        <button className="project-detail-back" onClick={() => navigate('/')}>
          <HiOutlineArrowLeft />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 2 }}>{project.projectName}</h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {project.address && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineMapPin /> {project.address}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineCalendarDays /> {formatDate(project.startDate)} — {formatDate(project.endDate)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineCurrencyRupee /> ₹{Number(project.projectValue || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="detail-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-body">
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Site Progress</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>{latestProgress}%</div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${latestProgress}%` }}></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Assigned Staff</div>
            {project.assignedStaff?.length > 0 ? (
              project.assignedStaff.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{s.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s.designation}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No staff assigned</div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Party (Company)</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{project.partyName || '—'}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 8 }}>Status</div>
            <span className={`badge badge-${project.status === 'Active' ? 'success' : project.status === 'Planning' ? 'primary' : 'secondary'}`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(t.key); setShowForm(false); }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{t.icon} {t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">{tabs.find(t => t.key === activeTab)?.label}</span>
          {['dpr', 'transaction', 'progress', 'task', 'meeting'].includes(activeTab) && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
              <HiOutlinePlus /> Add Entry
            </button>
          )}
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="card-body" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <form onSubmit={handleSubmit}>
              {activeTab === 'dpr' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Labor Count</label>
                      <input className="form-input" type="number" placeholder="Number of workers" value={dprForm.laborCount} onChange={e => setDprForm({ ...dprForm, laborCount: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Floor/Tower Details</label>
                      <input className="form-input" placeholder="e.g., Tower A, 3rd Floor" value={dprForm.floorTowerDetails} onChange={e => setDprForm({ ...dprForm, floorTowerDetails: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Material Notes</label>
                    <textarea className="form-textarea" placeholder="Material updates..." value={dprForm.materialNotes} onChange={e => setDprForm({ ...dprForm, materialNotes: e.target.value })}></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <HiOutlinePhoto /> Site Photos & Attachments (Images, PDF, Documents)
                    </label>
                    <input
                      className="form-input"
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleDprFileUpload}
                    />
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                      Attach daily site progress photos, delivery challans, inspection photos, or PDF reports.
                    </div>
                    {dprForm.attachments && dprForm.attachments.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                        {dprForm.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'relative',
                              padding: '6px 8px',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-sm, 6px)',
                              background: 'var(--color-bg, #f8f9fa)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              maxWidth: 240
                            }}
                          >
                            {att.type?.startsWith('image/') || att.url?.startsWith('data:image/') ? (
                              <img
                                src={att.url}
                                alt={att.name}
                                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, display: 'block' }}
                              />
                            ) : (
                              <div style={{ fontSize: 22, padding: '0 2px' }}>📄</div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={att.name}>
                                {att.name}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                {att.type?.startsWith('image/') ? 'Photo' : 'Document'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDprAttachment(idx)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-danger, #e53935)',
                                padding: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Remove file"
                            >
                              <HiOutlineXMark style={{ fontSize: 16 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              {activeTab === 'transaction' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Amount (₹)</label>
                      <input className="form-input" type="number" placeholder="Amount" value={txnForm.amount} onChange={e => setTxnForm({ ...txnForm, amount: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select className="form-select" value={txnForm.type} onChange={e => setTxnForm({ ...txnForm, type: e.target.value })}>
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                        <option value="Billing">Billing</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Remarks</label>
                    <input className="form-input" placeholder="Remarks" value={txnForm.remarks} onChange={e => setTxnForm({ ...txnForm, remarks: e.target.value })} />
                  </div>
                </>
              )}
              {activeTab === 'progress' && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Progress %</label>
                    <input className="form-input" type="number" min="0" max="100" placeholder="0-100" value={progressForm.progressPercentage} onChange={e => setProgressForm({ ...progressForm, progressPercentage: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Remarks</label>
                    <input className="form-input" placeholder="Progress remarks" value={progressForm.remarks} onChange={e => setProgressForm({ ...progressForm, remarks: e.target.value })} />
                  </div>
                </div>
              )}
              {activeTab === 'task' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Problem</label>
                    <textarea className="form-textarea" placeholder="Describe the issue" value={taskForm.problem} onChange={e => setTaskForm({ ...taskForm, problem: e.target.value })} required></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Plan</label>
                    <textarea className="form-textarea" placeholder="Proposed action plan" value={taskForm.plan} onChange={e => setTaskForm({ ...taskForm, plan: e.target.value })}></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Solution</label>
                      <input className="form-input" placeholder="Resolution details" value={taskForm.solution} onChange={e => setTaskForm({ ...taskForm, solution: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {activeTab === 'meeting' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={meetingForm.date} onChange={e => setMeetingForm({ ...meetingForm, date: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Participants (comma-separated)</label>
                      <input className="form-input" placeholder="Name1, Name2" value={meetingForm.participants} onChange={e => setMeetingForm({ ...meetingForm, participants: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Agenda</label>
                    <input className="form-input" placeholder="Meeting agenda" value={meetingForm.agenda} onChange={e => setMeetingForm({ ...meetingForm, agenda: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-textarea" placeholder="Meeting notes" value={meetingForm.notes} onChange={e => setMeetingForm({ ...meetingForm, notes: e.target.value })}></textarea>
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* List Content */}
        <div className="card-body" style={{ padding: 0 }}>
          {activeTab === 'dpr' && (
            updates?.dprs?.length > 0 ? updates.dprs.slice().reverse().map((d, i) => (
              <div className="list-item" key={i} style={{ alignItems: 'flex-start' }}>
                <div className="list-item-number">{updates.dprs.length - i}</div>
                <div className="list-item-content" style={{ flex: 1 }}>
                  <div className="list-item-title">{d.laborCount} workers — {d.floorTowerDetails || 'No details'}</div>
                  <div className="list-item-sub">{d.materialNotes || 'No material notes'} • {formatDate(d.date)}</div>

                  {/* Photos & Attachments */}
                  {d.attachments && d.attachments.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HiOutlinePaperClip /> {d.attachments.length} Photo / File Attachment{d.attachments.length > 1 ? 's' : ''}:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {d.attachments.map((att, aIdx) => {
                          const isImg = att.type?.startsWith('image/') || att.url?.startsWith('data:image/');
                          return (
                            <div
                              key={aIdx}
                              style={{
                                border: '1px solid var(--color-border-light, #e0e0e0)',
                                borderRadius: 6,
                                padding: isImg ? 4 : '6px 10px',
                                background: 'var(--color-card, #fff)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                cursor: 'pointer',
                                transition: 'box-shadow 0.15s, transform 0.15s'
                              }}
                              onClick={() => setPreviewFile(att)}
                              title={`Click to preview ${att.name || 'file'}`}
                            >
                              {isImg ? (
                                <div style={{ position: 'relative' }}>
                                  <img
                                    src={att.url}
                                    alt={att.name || 'Site Photo'}
                                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, display: 'block' }}
                                  />
                                  <div
                                    style={{
                                      position: 'absolute',
                                      bottom: 2,
                                      right: 2,
                                      background: 'rgba(0,0,0,0.6)',
                                      color: '#fff',
                                      borderRadius: 3,
                                      padding: '1px 3px',
                                      fontSize: 9,
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <HiOutlinePhoto />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <span style={{ fontSize: 18 }}>📄</span>
                                  <span style={{ fontSize: 12, fontWeight: 500, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {att.name || 'Document'}
                                  </span>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )) : <div className="empty-state"><div className="empty-state-text">No DPR entries yet</div></div>
          )}
          {activeTab === 'transaction' && (
            updates?.transactions?.length > 0 ? updates.transactions.slice().reverse().map((t, i) => (
              <div className="list-item" key={i}>
                <div className="list-item-number">{updates.transactions.length - i}</div>
                <div className="list-item-content">
                  <div className="list-item-title">₹{Number(t.amount).toLocaleString('en-IN')}</div>
                  <div className="list-item-sub">{t.remarks || 'No remarks'} • {formatDate(t.date)}</div>
                </div>
                <span className={`badge ${t.type === 'Income' ? 'badge-success' : t.type === 'Expense' ? 'badge-danger' : 'badge-warning'}`}>{t.type}</span>
              </div>
            )) : <div className="empty-state"><div className="empty-state-text">No transactions yet</div></div>
          )}
          {activeTab === 'progress' && (
            updates?.siteProgress?.length > 0 ? updates.siteProgress.slice().reverse().map((p, i) => (
              <div className="list-item" key={i}>
                <div className="list-item-number">{updates.siteProgress.length - i}</div>
                <div className="list-item-content">
                  <div className="list-item-title">{p.progressPercentage}% Complete</div>
                  <div className="list-item-sub">{p.remarks || 'No remarks'} • {formatDate(p.timestamp)}</div>
                </div>
                <div className="progress-bar" style={{ width: 80 }}>
                  <div className="progress-fill" style={{ width: `${p.progressPercentage}%` }}></div>
                </div>
              </div>
            )) : <div className="empty-state"><div className="empty-state-text">No site progress entries yet</div></div>
          )}
          {activeTab === 'task' && (
            updates?.tasks?.length > 0 ? updates.tasks.slice().reverse().map((t, i) => (
              <div className="list-item" key={i}>
                <div className="list-item-number">{updates.tasks.length - i}</div>
                <div className="list-item-content">
                  <div className="list-item-title">{t.problem}</div>
                  <div className="list-item-sub">Plan: {t.plan || '—'} | Solution: {t.solution || '—'}</div>
                </div>
                <span className={`badge ${t.status === 'Resolved' ? 'badge-success' : t.status === 'In Progress' ? 'badge-warning' : 'badge-danger'}`}>{t.status}</span>
              </div>
            )) : <div className="empty-state"><div className="empty-state-text">No tasks yet</div></div>
          )}
          {activeTab === 'design' && (
            <div className="empty-state"><div className="empty-state-text">Design uploads coming soon</div></div>
          )}
          {activeTab === 'files' && (
            <div className="empty-state"><div className="empty-state-text">File management coming soon</div></div>
          )}
          {activeTab === 'meeting' && (
            updates?.meetings?.length > 0 ? updates.meetings.slice().reverse().map((m, i) => (
              <div className="list-item" key={i}>
                <div className="list-item-number">{updates.meetings.length - i}</div>
                <div className="list-item-content">
                  <div className="list-item-title">{m.agenda || 'Meeting'}</div>
                  <div className="list-item-sub">{formatDate(m.date)} • {m.participants?.join(', ') || 'No participants'}</div>
                </div>
              </div>
            )) : <div className="empty-state"><div className="empty-state-text">No meetings yet</div></div>
          )}
        </div>
      </div>

      {/* File / Photo Preview Lightbox Modal */}
      {previewFile && (
        <div
          className="modal-overlay"
          style={{ zIndex: 1000 }}
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 750, width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            <div className="modal-header">
              <h3 className="modal-title" style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                {previewFile.type?.startsWith('image/') || previewFile.url?.startsWith('data:image/') ? <HiOutlinePhoto /> : <HiOutlinePaperClip />}
                {previewFile.name || 'DPR Attachment'}
              </h3>
              <button className="modal-close" onClick={() => setPreviewFile(null)}>×</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', overflow: 'auto', padding: 16 }}>
              {previewFile.type?.startsWith('image/') || previewFile.url?.startsWith('data:image/') ? (
                <div>
                  <img
                    src={previewFile.url}
                    alt={previewFile.name || 'Site Photo'}
                    style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <div style={{ marginTop: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    {previewFile.name}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '30px 20px' }}>
                  <div style={{ fontSize: 54, marginBottom: 12 }}>📄</div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{previewFile.name || 'Document'}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
                    Attached file for Daily Progress Report (DPR)
                  </div>
                  <a
                    href={previewFile.url}
                    download={previewFile.name || 'dpr-attachment'}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                  >
                    <HiOutlineArrowDownTray /> Download / View File
                  </a>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <a
                href={previewFile.url}
                download={previewFile.name || 'dpr-attachment'}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
              >
                <HiOutlineArrowDownTray /> Download
              </a>
              <button className="btn btn-primary btn-sm" onClick={() => setPreviewFile(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
