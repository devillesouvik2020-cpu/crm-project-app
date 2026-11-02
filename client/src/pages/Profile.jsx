import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Toast from '../components/Toast';
import { 
  HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, 
  HiOutlineBriefcase, HiOutlineLanguage, HiOutlineCheckCircle,
  HiOutlineBuildingOffice2
} from 'react-icons/hi2';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    languagePref: 'en',
    company: 'ProjectCRM Infrastructure Pvt Ltd',
    bio: 'Centralized Project Manager supervising site progress, leads, and staff assignments.'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        designation: user.designation || 'Project Manager',
        languagePref: user.languagePref || 'en',
        company: user.company || prev.company,
        bio: user.bio || prev.bio
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(formData);
      updateUser(res.data);
      setToast({ message: 'Admin profile updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="card-title">Admin Profile Settings</span>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Create or modify your administrative profile details and site credentials
            </div>
          </div>
          <span className="badge badge-success" style={{ gap: 4 }}>
            <HiOutlineCheckCircle /> Verified Admin
          </span>
        </div>

        <div className="card-body">
          {/* User Profile Card Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 18, 
            padding: '16px 20px', 
            background: 'linear-gradient(135deg, rgba(91,124,250,0.08) 0%, rgba(124,110,250,0.04) 100%)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid rgba(91,124,250,0.15)',
            marginBottom: 24 
          }}>
            <div style={{ 
              width: 68, 
              height: 68, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--color-primary), #7c6efa)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontSize: 26, 
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(91,124,250,0.3)'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                {user?.name || 'Subhashis Bera'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Role: <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{user?.userType || 'Admin'}</span>
                {' • '}
                Primary Mobile: <span style={{ fontWeight: 600 }}>{user?.mobileNumber || '9876543210'}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                {formData.designation} • {formData.company}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlineUser /> Full Name *
                  </span>
                </label>
                <input 
                  id="profile-name"
                  className="form-input" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Enter full name"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlinePhone /> Mobile Number (Login ID)
                  </span>
                </label>
                <input 
                  id="profile-phone"
                  className="form-input" 
                  value={user?.mobileNumber || ''} 
                  disabled 
                  style={{ background: 'var(--color-bg)', cursor: 'not-allowed', color: 'var(--color-text-secondary)' }}
                  title="Mobile number is tied to your account login and cannot be altered"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlineEnvelope /> Email Address
                  </span>
                </label>
                <input 
                  id="profile-email"
                  className="form-input" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  placeholder="admin@projectcrm.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlineBriefcase /> Designation / Role
                  </span>
                </label>
                <input 
                  id="profile-designation"
                  className="form-input" 
                  value={formData.designation} 
                  onChange={e => setFormData({ ...formData, designation: e.target.value })} 
                  placeholder="e.g., Project Director, General Manager"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlineBuildingOffice2 /> Organization / Company
                  </span>
                </label>
                <input 
                  id="profile-company"
                  className="form-input" 
                  value={formData.company} 
                  onChange={e => setFormData({ ...formData, company: e.target.value })} 
                  placeholder="Company name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlineLanguage /> Preferred Language
                  </span>
                </label>
                <select 
                  id="profile-language"
                  className="form-select"
                  value={formData.languagePref}
                  onChange={e => setFormData({ ...formData, languagePref: e.target.value })}
                >
                  <option value="en">English (Default)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Notes / Responsibilities</label>
              <textarea 
                id="profile-bio"
                className="form-textarea" 
                rows="3"
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief administrative summary..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
              <button 
                id="save-profile-btn"
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
