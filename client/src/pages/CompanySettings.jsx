import { useState } from 'react';
import Toast from '../components/Toast';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';

export default function CompanySettings() {
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '', address: '', phone: '', email: '',
    gstNumber: '', website: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Company settings saved!', type: 'success' });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-header">
          <span className="card-title">Organization Configuration</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" placeholder="Your company name" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-textarea" placeholder="Company address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ minHeight: 60 }}></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="Phone number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="Company email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">GST Number</label>
                <input className="form-input" placeholder="GST number" value={formData.gstNumber} onChange={e => setFormData({ ...formData, gstNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input className="form-input" placeholder="https://..." value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
              <HiOutlineCog6Tooth /> Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
