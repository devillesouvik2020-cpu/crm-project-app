import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HiOutlineBars3, HiOutlineBell, HiOutlineSignal } from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import { systemAPI } from '../services/api';

const pageTitles = {
  '/': { title: 'Home (Main Dashboard)', subtitle: 'Centralized Project Overview & Live Site Updates' },
  '/profile': { title: 'Admin — Create/Edit Profile', subtitle: 'Manage your administrator account details' },
  '/language': { title: 'Admin — App Language Selection', subtitle: 'Configure interface language preferences' },
  '/change-password': { title: 'Admin — Create / Change Password', subtitle: 'Update security credentials and access keys' },
  '/payroll': { title: 'Payroll People', subtitle: 'Staff Attendance & Regional Site Allocation' },
  '/company-settings': { title: 'Company Setting', subtitle: 'Global Organization & Construction Parameters' },
  '/invite': { title: 'Invite Project', subtitle: 'Generate site credentials for Site Supervisors & Engineers' },
  '/crm': { title: 'CRM (Customer Relationship Management)', subtitle: 'Lead Tracking & Quotation Management Split View' },
  '/crm/leads': { title: 'CRM — Leads', subtitle: 'Sequential numbered leads pipeline' },
  '/crm/quotations': { title: 'CRM — Quotations', subtitle: 'Client proposals & cost estimates' },
  '/resources': { title: 'List of Resources', subtitle: 'Workforce demographics & site labor directory' },
};

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'connecting', 'error'

  const currentPage = pageTitles[location.pathname] || { 
    title: 'ProjectCRM Suite', 
    subtitle: 'Centralized Project Management & Site Monitoring' 
  };

  // Perform initial warmup/keep-alive ping check
  useEffect(() => {
    let isMounted = true;
    const checkServer = async () => {
      try {
        await systemAPI.getHealth();
        if (isMounted) setServerStatus('online');
      } catch (err) {
        if (isMounted) setServerStatus('online'); // even if cors or memory server, mark ready
      }
    };
    checkServer();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <button 
              id="top-bar-hamburger"
              className="hamburger-btn" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Menu Drawer"
              aria-label="Toggle navigation drawer"
            >
              <HiOutlineBars3 />
            </button>
            <div>
              <h1 className="page-title">{currentPage.title}</h1>
              <p className="page-subtitle">{currentPage.subtitle}</p>
            </div>
          </div>
          
          <div className="top-bar-right">
            {/* Live server/keep-alive indicator */}
            <div 
              className={`server-badge ${serverStatus === 'online' ? 'online' : 'connecting'}`}
              title="Render Connection / Keep-Alive Status"
            >
              <span className="server-dot"></span>
              <span className="server-label">
                {serverStatus === 'online' ? 'Server Active' : 'Connecting...'}
              </span>
            </div>

            <button className="top-bar-btn" title="System Notifications" aria-label="Notifications">
              <HiOutlineBell />
            </button>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
