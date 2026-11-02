import { useState } from 'react';
import Toast from '../components/Toast';
import { HiOutlineUserGroup, HiOutlineCalendarDays, HiOutlineCheckCircle } from 'react-icons/hi2';

export default function Payroll() {
  const [toast, setToast] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ staffName: '', site: '', date: '', present: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttendance([...attendance, { ...formData, id: Date.now() }]);
    setFormData({ staffName: '', site: '', date: '', present: true });
    setShowForm(false);
    setToast({ message: 'Attendance recorded', type: 'success' });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="action-header">
        <h2 className="action-header-title">Staff Attendance & Site Allocation</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <HiOutlineCalendarDays /> Mark Attendance
        </button>
      </div>

      {/* Quick stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineCheckCircle /></div>
          <div>
            <div className="stat-value">{attendance.filter(a => a.present).length}</div>
            <div className="stat-label">Present Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineUserGroup /></div>
          <div>
            <div className="stat-value">{attendance.length}</div>
            <div className="stat-label">Total Records</div>
          </div>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Mark Attendance</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Staff Name</label>
                  <input className="form-input" placeholder="Enter name" value={formData.staffName} onChange={e => setFormData({ ...formData, staffName: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Site/Region</label>
                    <input className="form-input" placeholder="e.g., Hyderabad Site" value={formData.site} onChange={e => setFormData({ ...formData, site: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={formData.present} onChange={e => setFormData({ ...formData, present: e.target.value === 'true' })}>
                    <option value="true">Present</option>
                    <option value="false">Absent</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="card">
        {attendance.length === 0 ? (
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineUserGroup /></div>
              <div className="empty-state-title">No Attendance Records</div>
              <div className="empty-state-text">Track staff attendance across different sites. Link site engineers and supervisors to their assigned regions.</div>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Site</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.staffName}</td>
                    <td>{a.site || '—'}</td>
                    <td>{a.date}</td>
                    <td><span className={`badge ${a.present ? 'badge-success' : 'badge-danger'}`}>{a.present ? 'Present' : 'Absent'}</span></td>
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
