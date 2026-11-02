import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Toast from '../components/Toast';
import { HiOutlineCheck, HiOutlineGlobeAlt } from 'react-icons/hi2';

export default function Language() {
  const { user, updateUser } = useAuth();
  const [selected, setSelected] = useState(user?.languagePref || 'en');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.languagePref) {
      setSelected(user.languagePref);
    }
  }, [user]);

  const languages = [
    { code: 'en', label: 'English', native: 'English', region: 'Global / Official', popular: true },
    { code: 'bn', label: 'Bengali', native: 'বাংলা', region: 'West Bengal & Kolkata Sites', popular: true },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', region: 'North India & National Sites', popular: true },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', region: 'Hyderabad & Telangana Sites', popular: true },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்', region: 'Chennai & Tamil Nadu Sites', popular: false },
    { code: 'mr', label: 'Marathi', native: 'मराठी', region: 'Mumbai & Maharashtra Sites', popular: false },
  ];

  const handleSave = async (langCode = selected) => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ languagePref: langCode });
      updateUser(res.data);
      const langName = languages.find(l => l.code === langCode)?.label || langCode;
      setToast({ message: `App Language updated to ${langName}!`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update language preference', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 36, height: 36, borderRadius: 'var(--radius-sm)', 
              background: 'var(--color-primary-light)', color: 'var(--color-primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 
            }}>
              <HiOutlineGlobeAlt />
            </div>
            <div>
              <span className="card-title">App Language Selection</span>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Modelled after the HR Management suite for multi-site language configuration
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            Select the primary working language for your management portal, reports, and site communication:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {languages.map(lang => {
              const isSelected = selected === lang.code;
              return (
                <div
                  key={lang.code}
                  id={`lang-card-${lang.code}`}
                  onClick={() => {
                    setSelected(lang.code);
                    handleSave(lang.code);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 18px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    boxShadow: isSelected ? '0 4px 12px rgba(91,124,250,0.18)' : 'none',
                    transition: 'var(--transition)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 650, fontSize: 15, color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {lang.label}
                      </span>
                      {lang.popular && (
                        <span style={{ 
                          fontSize: 10, 
                          fontWeight: 700, 
                          padding: '2px 6px', 
                          borderRadius: 10, 
                          background: isSelected ? 'var(--color-primary)' : 'var(--color-border)', 
                          color: isSelected ? 'white' : 'var(--color-text-secondary)' 
                        }}>
                          SITE CHOICE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 14, color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: 500 }}>
                      {lang.native}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {lang.region}
                    </div>
                  </div>

                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: isSelected ? 'var(--color-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                    flexShrink: 0
                  }}>
                    {isSelected && <HiOutlineCheck />}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ 
            marginTop: 24, 
            padding: 14, 
            background: 'var(--color-bg)', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: 13, 
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>
              Current Active Language: <strong style={{ color: 'var(--color-primary)' }}>
                {languages.find(l => l.code === selected)?.label} ({languages.find(l => l.code === selected)?.native})
              </strong>
            </span>
            <button 
              id="save-language-btn"
              className="btn btn-primary btn-sm" 
              onClick={() => handleSave(selected)} 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Confirm Language'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
