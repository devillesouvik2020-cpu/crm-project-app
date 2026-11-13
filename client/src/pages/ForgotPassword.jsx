import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { HiOutlineDevicePhoneMobile, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter mobile, 2 = enter new password, 3 = success
  const [mobileNumber, setMobileNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyMobile = (e) => {
    e.preventDefault();
    setError('');
    if (!mobileNumber.trim()) { setError('Please enter your registered mobile number'); return; }
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword({ mobileNumber, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
            <div className="auth-logo-text">Project Management</div>
          </div>
          <h1 className="auth-title">Reset Password</h1>

          {step === 1 && (
            <>
              <p className="auth-subtitle">Enter your registered mobile number to reset your password.</p>
              {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 18, fontSize: 13 }}>{error}</div>}
              <form onSubmit={handleVerifyMobile}>
                <div className="form-group">
                  <label className="form-label">Registered Mobile Number</label>
                  <div style={{ position: 'relative' }}>
                    <HiOutlineDevicePhoneMobile style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                    <input className="form-input" type="text" placeholder="Enter your mobile number" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} style={{ paddingLeft: 38 }} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 6 }}>Continue</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <p className="auth-subtitle">Set a new password for <strong>{mobileNumber}</strong></p>
              {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 18, fontSize: 13 }}>{error}</div>}
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <HiOutlineLockClosed style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                    <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ paddingLeft: 38, paddingRight: 38 }} required minLength={6} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 18 }}>
                      {showPw ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <HiOutlineLockClosed style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 18 }} />
                    <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="Repeat new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ paddingLeft: 38 }} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 6 }}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                <button type="button" className="btn btn-secondary btn-full" style={{ marginTop: 8 }} onClick={() => setStep(1)}>← Back</button>
              </form>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <p style={{ color: 'var(--color-success)', fontWeight: 600, marginBottom: 8 }}>Password Reset Successful!</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 20 }}>You can now log in with your new password.</p>
              <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>Go to Login</button>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
