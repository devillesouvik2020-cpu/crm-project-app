# ProjectCRM — Construction & Site Project Management

A unified, full-stack **Project Management, HR/Payroll, and CRM System** designed specifically for construction and field site management operations.

Built with **Node.js, Express, MongoDB (in-built `mongodb-memory-server` + Mongoose)** on the backend, and **React + Vite** with a modern, sober, and light UI palette on the frontend.

---

## 🌟 Key Features

1. **Authentication & Role-Based Access Control (RBAC)**:
   - Mobile number-based authentication (Admin, Project Manager, Site Engineer, Supervisor, Site Manager, Worker).
   - Profile management, password updates, and Indian language preferences (English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali).

2. **Project Portfolio & Site Management**:
   - Create, list, track, and manage projects.
   - Project status breakdown: *Active, Planning, Completed, On Hold*.
   - Budget, duration, contractor party name, and assigned staff tracking.

3. **Multi-Tab Site Operations & DPR**:
   - **Daily Progress Reports (DPR)**: Work logs, weather tracking, manpower counts, and remarks.
   - **Financial Transactions**: Record debits & credits, payment modes (Cash, Bank Transfer, UPI, Cheque), category tags, and running net balance.
   - **Milestones & Physical Progress**: Percentage completion tracking with visual progress bars.
   - **Site Tasks**: Assign tasks with priority levels (Low, Medium, High, Urgent), due dates, and completion status.
   - **Meetings & Site Visits**: Client discussions, site walk logs, and action items.

4. **CRM System**:
   - **Leads Pipeline**: Track prospect clients, contact info, estimated value, source, and pipeline stages (*New, Contacted, Qualified, Proposal, Won, Lost*).
   - **Quotations & Estimates**: Itemized quotation generator with unit rates, quantities, totals, and statuses (*Draft, Sent, Accepted, Rejected*).

5. **HR, Payroll & Attendance**:
   - Staff attendance tracking (Present, Absent, Half-Day).
   - Site allocation mapping for workforce management.

6. **Heavy Equipment & Resource Tracking**:
   - Inventory of machinery, tools, and site materials.
   - Allocation statuses (*Available, In Use, Maintenance*), quantities, and hourly/unit costs.

7. **Team Collaboration & Invites**:
   - Send role-based invites to site engineers, managers, and contractors.

---

## 🎨 Design Aesthetics
- **Theme**: Sober, light, and modern aesthetic.
- **Palette**: Soft cool-slate backgrounds (`#f7f8fc`), crisp white cards (`#ffffff`), slate navbars (`#2c3345`), and soft indigo accents (`#5b7cfa`).
- **Typography**: Inter (Google Fonts) with clear contrast and readable line heights.
- **Micro-interactions**: Subtle hover elevations, responsive badges, and smooth transitions.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

*Note: No external MongoDB server installation is required — the backend uses an embedded, zero-config in-memory MongoDB server (`mongodb-memory-server`).*

### 2. Backend Setup & Run
```bash
cd server
npm install
npm run dev
```
The server will start on: **`http://localhost:5000`**

### 3. Frontend Setup & Run
```bash
cd client
npm install
npm run dev
```
The client will start on: **`http://localhost:3000`**

---

## 📂 Project Architecture

```
crm-project-app/
├── client/                     # Frontend React (Vite)
│   ├── src/
│   │   ├── components/         # Layout, Sidebar, Toast components
│   │   ├── context/            # AuthContext (JWT session state)
│   │   ├── pages/              # 13 Dedicated Pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Quotations.jsx
│   │   │   ├── Payroll.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── Invite.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Language.jsx
│   │   │   ├── CompanySettings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/           # Axios API Client with JWT interceptors
│   │   ├── App.jsx             # React Router routing & ProtectedRoute wrappers
│   │   ├── main.jsx            # Entry mount point
│   │   └── index.css           # Design tokens, typography & sober theme styling
│   └── vite.config.js          # Vite config with React plugin and API proxy
│
└── server/                     # Backend Node.js & Express
    ├── index.js                # Server entry, in-memory MongoDB bootstrap
    ├── middleware/             # JWT authMiddleware & RBAC adminOnly guard
    ├── models/                 # Mongoose Schemas (User, Project, ProjectUpdate, Lead, Quotation, Resource, Invite)
    └── routes/                 # REST endpoints (auth, projects, crm, invites, resources)
```
