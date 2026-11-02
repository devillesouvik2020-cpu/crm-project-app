import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome, HiOutlineUserGroup, HiOutlineCog6Tooth,
  HiOutlineEnvelope, HiOutlineBriefcase,
  HiOutlineClipboardDocumentList, HiOutlineXMark,
  HiOutlineUserCircle, HiOutlineLanguage, HiOutlineKey,
  HiOutlineChevronDown, HiOutlineChevronRight, HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck
} from 'react-icons/hi2';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Admin dropdown is automatically expanded if current route is an admin page
  const isAdminPath = ['/profile', '/language', '/change-password'].includes(location.pathname);
  const [adminOpen, setAdminOpen] = useState(isAdminPath || false);

  useEffect(() => {
    if (isAdminPath) {
      setAdminOpen(true);
    }
  }, [location.pathname, isAdminPath]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay visible" 
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">PM</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-logo-text">ProjectCRM</div>
              <div className="sidebar-logo-sub">Site & Project Suite</div>
            </div>
            {onClose && (
              <button 
                className="sidebar-close-btn" 
                onClick={onClose}
                title="Close drawer"
                aria-label="Close drawer"
              >
                <HiOutlineXMark />
              </button>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Section: Admin Sub-Module (Dropdown/Sub-menu) */}
          <div className="sidebar-section-title">Administration</div>
          <div
            id="nav-admin-dropdown"
            className={`sidebar-link ${adminOpen ? 'expanded' : ''} ${isAdminPath ? 'active-parent' : ''}`}
            onClick={() => setAdminOpen(!adminOpen)}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <span className="sidebar-link-icon"><HiOutlineShieldCheck /></span>
            <span style={{ fontWeight: 600 }}>Admin</span>
            <span style={{ marginLeft: 'auto', fontSize: 13, transition: 'transform 0.2s', display: 'flex' }}>
              {adminOpen ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
            </span>
          </div>

          {adminOpen && (
            <div className="sidebar-submenu animate-dropdown">
              <NavLink
                to="/profile"
                id="nav-admin-profile"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="sidebar-link-icon"><HiOutlineUserCircle /></span>
                <span>Create/Edit Profile</span>
              </NavLink>

              <NavLink
                to="/language"
                id="nav-admin-language"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="sidebar-link-icon"><HiOutlineLanguage /></span>
                <span>App Language Selection</span>
              </NavLink>

              <NavLink
                to="/change-password"
                id="nav-admin-password"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="sidebar-link-icon"><HiOutlineKey /></span>
                <span>Create / Change Password</span>
              </NavLink>
            </div>
          )}

          {/* Section: Main App Navigation */}
          <div className="sidebar-section-title">Workspace</div>

          {/* Home (Main Dashboard) */}
          <NavLink
            to="/"
            end
            id="nav-home"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="sidebar-link-icon"><HiOutlineHome /></span>
            <span>Home (Main Dashboard)</span>
          </NavLink>

          {/* Payroll People */}
          <NavLink
            to="/payroll"
            id="nav-payroll"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="sidebar-link-icon"><HiOutlineUserGroup /></span>
            <span>Payroll People</span>
          </NavLink>

          {/* Company Setting */}
          <NavLink
            to="/company-settings"
            id="nav-company-setting"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="sidebar-link-icon"><HiOutlineCog6Tooth /></span>
            <span>Company Setting</span>
          </NavLink>

          {/* Invite */}
          <NavLink
            to="/invite"
            id="nav-invite"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="sidebar-link-icon"><HiOutlineEnvelope /></span>
            <span>Invite</span>
          </NavLink>

          {/* CRM (Customer Relationship Management) - Opens Split View */}
          <NavLink
            to="/crm"
            id="nav-crm"
            className={({ isActive }) => `sidebar-link ${isActive || location.pathname.startsWith('/crm') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="sidebar-link-icon"><HiOutlineBriefcase /></span>
            <span style={{ fontWeight: 550 }}>CRM (Customer Relationship Management)</span>
          </NavLink>

          {/* List of Resources */}
          <div className="sidebar-section-title">Directory</div>
          <NavLink
            to="/resources"
            id="nav-resources"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="sidebar-link-icon"><HiOutlineClipboardDocumentList /></span>
            <span>List of Resources</span>
          </NavLink>
        </nav>

        {/* User Card & Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout} title="Click to log out">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Subhashis Bera'}</div>
              <div className="sidebar-user-role">{user?.designation || user?.userType || 'Project Manager'}</div>
            </div>
            <button 
              className="sidebar-logout-btn" 
              title="Sign Out" 
              aria-label="Sign Out"
              onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            >
              <HiOutlineArrowRightOnRectangle />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
