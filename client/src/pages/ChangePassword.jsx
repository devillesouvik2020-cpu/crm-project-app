import { useState } from 'react';
import { authAPI } from '../services/api';
import Toast from '../components/Toast';
import { 
  HiOutlineKey, HiOutlineLockClosed, HiOutlineEye, 
  HiOutlineEyeSlash, HiOutlineCheckCircle, HiOutlineShieldCheck 
} from 'react-icons/hi2';

export default function ChangePassword() {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  // Calculate password strength
  const getStrength = (pw) => {
    if (!pw) return { score: 0, text: 'None', color: 'transparent' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'var(--color-danger)' };
    if (score <= 3) return { score: 2, text: 'Medium', color: 'var(--color-warning)' };
    return { score: 3, text: 'Strong', color: 'var(--color-accent)' };
  };

  const strength = getStrength(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setToast({ message: 'New password and confirmation do not match!', type: 'error' });
      return;
    }
    if (formData.newPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({ 
        currentPassword: formData.currentPassword, 
        newPassword: formData.newPassword 
      });
      setToast({ message: 'Security password changed successfully!', type: 'success' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to change password. Please check your current password.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 36, height: 36, borderRadius: 'var(--radius-sm)', 
              background: 'var(--color-primary-light)', color: 'var(--color-primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 
            }}>
              <HiOutlineKey />
            </div>
            <div>
              <span className="card-title">Create / Change Password</span>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Admin credential & site security configuration
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div style={{ 
            padding: '12px 16px', 
            background: 'var(--color-bg)', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--color-border)', 
            marginBottom: 20,
            fontSize: 13,
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <HiOutlineShieldCheck style={{ fontSize: 22, color: 'var(--color-primary)', flexShrink: 0 }} />
            <div>
              Default Admin test password is <strong style={{ color: 'var(--color-text)' }}>admin123</strong>. You can change it anytime to safeguard system access.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Current Password */}
            <div className="form-group">
              <label className="form-label">Current Password *</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input 
                  id="current-password"
                  className="form-input" 
                  type={showCurrent ? 'text' : 'password'} 
                  placeholder="Enter current password (e.g. admin123)" 
                  value={formData.currentPassword} 
                  onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} 
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)} 
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 18 }}
                  aria-label="Toggle password visibility"
                >
                  {showCurrent ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password *</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineKey style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input 
                  id="new-password"
                  className="form-input" 
                  type={showNew ? 'text' : 'password'} 
                  placeholder="Minimum 6 characters" 
                  value={formData.newPassword} 
                  onChange={e => setFormData({ ...formData, newPassword: e.target.value })} 
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)} 
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 18 }}
                  aria-label="Toggle new password visibility"
                >
                  {showNew ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>

              {/* Password strength bar */}
              {formData.newPassword && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Security Strength</span>
                    <span style={{ color: strength.color, fontWeight: 600 }}>{strength.text}</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ 
                      width: strength.score === 1 ? '33%' : strength.score === 2 ? '66%' : '100%', 
                      height: '100%', 
                      background: strength.color, 
                      transition: 'all 0.3s' 
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label className="form-label">Confirm New Password *</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineCheckCircle style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input 
                  id="confirm-password"
                  className="form-input" 
                  type={showConfirm ? 'text' : 'password'} 
                  placeholder="Re-enter new password" 
                  value={formData.confirmPassword} 
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} 
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)} 
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 18 }}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
              <button 
                id="update-password-btn"
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Updating Password...' : 'Save & Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
