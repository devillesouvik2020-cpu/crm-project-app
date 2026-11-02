import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  HiOutlineArrowLeft, HiOutlineMapPin, HiOutlineCalendarDays,
  HiOutlineCurrencyRupee, HiOutlineUserGroup, HiOutlineDocumentText,
  HiOutlineBanknotes, HiOutlineChartBar, HiOutlineWrench,
  HiOutlinePhoto, HiOutlineFolder, HiOutlineCalendar,
  HiOutlinePlus, HiOutlineCheckCircle
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
  const [dprForm, setDprForm] = useState({ laborCount: '', floorTowerDetails: '', materialNotes: '' });
  const [txnForm, setTxnForm] = useState({ amount: '', type: 'Expense', remarks: '' });
  const [progressForm, setProgressForm] = useState({ progressPercentage: '', remarks: '' });
  const [taskForm, setTaskForm] = useState({ problem: '', plan: '', solution: '', status: 'Open' });
  const [meetingForm, setMeetingForm] = useState({ date: '', agenda: '', participants: '', notes: '' });

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
          await projectAPI.addDPR(id, { laborCount: Number(dprForm.laborCount), floorTowerDetails: dprForm.floorTowerDetails, materialNotes: dprForm.materialNotes });
          setDprForm({ laborCount: '', floorTowerDetails: '', materialNotes: '' });
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
              <div className="list-item" key={i}>
                <div className="list-item-number">{updates.dprs.length - i}</div>
                <div className="list-item-content">
                  <div className="list-item-title">{d.laborCount} workers — {d.floorTowerDetails || 'No details'}</div>
                  <div className="list-item-sub">{d.materialNotes || 'No material notes'} • {formatDate(d.date)}</div>
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
    </div>
  );
}
