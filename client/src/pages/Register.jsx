import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineDevicePhoneMobile, HiOutlineLockClosed, HiOutlineUser, HiOutlineEnvelope } from 'react-icons/hi2';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', mobileNumber: '', password: '', designation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register as Admin / Project Manager</p>

          {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 18, fontSize: 13, fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input className="form-input" type="text" placeholder="Enter full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ paddingLeft: 38 }} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineEnvelope style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input className="form-input" type="email" placeholder="Enter email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ paddingLeft: 38 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineDevicePhoneMobile style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input className="form-input" type="text" placeholder="Enter mobile number" value={formData.mobileNumber} onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })} style={{ paddingLeft: 38 }} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input className="form-input" type="text" placeholder="e.g. Project Manager" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                <input className="form-input" type="password" placeholder="Create password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ paddingLeft: 38 }} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
