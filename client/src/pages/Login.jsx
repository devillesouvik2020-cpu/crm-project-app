import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineDevicePhoneMobile, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ mobileNumber: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.mobileNumber, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">PM</div>
            <div className="auth-logo-text">ProjectCRM</div>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in with your mobile number</p>

          {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 18, fontSize: 13, fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineDevicePhoneMobile style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingLeft: 38, paddingRight: 38 }}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 18 }}>
                  {showPw ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>
            <button id="login-submit-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Quick Demo Fill for Testing */}
            <div style={{ 
              marginTop: 18, 
              padding: '12px 14px', 
              borderRadius: 'var(--radius-sm)', 
              background: 'var(--color-bg)', 
              border: '1px dashed var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>
                  🔑 PM / Admin Test Account
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Auto-Seeded</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                Mobile: <code style={{ color: 'var(--color-primary)', fontWeight: 600 }}>9876543210</code> | Password: <code style={{ color: 'var(--color-primary)', fontWeight: 600 }}>admin123</code>
              </div>
              <button
                id="quick-fill-admin-btn"
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setFormData({ mobileNumber: '9876543210', password: 'admin123' })}
                style={{ width: '100%', fontSize: 12 }}
              >
                1-Click Quick Fill Admin Credentials
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
