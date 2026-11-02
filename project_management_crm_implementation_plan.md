# Application Implementation Plan: Construction/Site Project Management & CRM System

## 1. Executive Summary & Core Objective
Based on the audio discussions with **Subhashis Bera Sir** and the WhatsApp specifications, the goal is to develop a centralized **Project Management, HR/Payroll, and CRM Web/Mobile Application**. 

**Core Workflow:**
* **Admin / Project Manager (PM):** Can sit anywhere (e.g., Kolkata, Delhi, Hyderabad), create projects, configure project structures, invite site-specific staff, manage leads/quotations, and monitor real-time updates on a centralized Dashboard.
* **Site Staff (Site Engineers, Supervisors, Site Managers):** Receive an invite/link created by the PM. They log in using their specific mobile number and can **only** access the specific project/site assigned to them to submit daily updates (DPR, work progress, labor count, floor/tower updates, photos, etc.).

---

## 2. Audio & Text Requirements Synthesis

### A. Insights from Audio Recordings
1. **Recording 3 (Initial Concept & Infrastructure):**
   * The PM creates a project structure and generates an access link/invite for Site Supervisors or Site Engineers.
   * On-site staff input daily metrics (e.g., 10 workers present today, work happening on specific floors/towers, material updates, work progress).
   * The PM views all real-time updates remotely from the main dashboard.
   * *Technical Note Mentioned:* The previous HR Manager app hosted on `Render.com` with `MongoDB` experiences cold-start loading delays and occasional errors. This new implementation or the existing setup needs optimization (e.g., keeping the server warm, proper error handling, and database indexing).
2. **Recording 2 (Navigation, Sidebar & Dashboard Architecture):**
   * **Left Sidebar Menu ("Three Dots" / Hamburger Menu):**
     * **Admin Section** (similar to the existing HR Management app):
       1. Create/Edit Profile
       2. App Language Selection
       3. Create / Change Password
     * **Home:** Main Dashboard view.
     * **Payroll People:** For managing staff attendance and site allocation (e.g., if 3 staff members are working on a Hyderabad site, they mark attendance here, and Site Engineers/Supervisors are linked here).
     * **Company Settings:** Global organization configuration.
     * **Invite:** Module for the PM to create user credentials and send project access links to Supervisors/Engineers.
     * **CRM (Customer Relationship Management):** Contains two sub-modules: **Lead** and **Quotation**.
   * **Main Dashboard Area:**
     * Features **Create Project** and **Planning Project**.
     * Displays active projects as distinct, named cards/views showing daily updates submitted by site staff.
3. **Recording 1 (CRM Workflow - Leads & Quotations):**
   * Clicking **CRM** opens the CRM Dashboard on the right pane, displaying two options: **Lead** and **Quotation**.
   * **Empty State & Creation Flow:** Both Lead and Quotation pages must initially load as a **blank page** with a **"Create" button at the bottom**.
   * Clicking "Create" opens the input form (fields to be configurable/as specified).
   * Upon clicking **"Save"** at the bottom of the form, the entry is added to the formerly blank page in a **sequential, numbered list** (1, 2, 3...).

### B. Insights from WhatsApp Messages (Data Models & Exact Ordering)
* **Strict Field Ordering Correction:** In the `Create Project` module, Subhashis Sir specified a correction at `[12:25]`: After `4. Project Value`, you must insert **Site Staff Name and Designation**, and then continue with items `5 to 12`.
* **Strict Authentication Rule:** Each site/project login is tied to a unique mobile number (`Jei bakti k jei site submit hbe otai login hbe`). A user logging in with their number will only see the specific site assigned to them.
* **List of Resources:** A dedicated module/section to log workforce/resource demographics.

---

## 3. System Architecture & Module Breakdown

### Module 1: Navigation & Layout Structure
* **Left Navigation Drawer (Hamburger / 3-Dot Menu):**
  * `Admin Settings`
    * Profile Creation / Modification
    * App Language
    * Create / Change Password
  * `Home` (Main Dashboard)
  * `Payroll People` (Staff & Site Engineer Attendance/Allocation)
  * `Company Settings`
  * `Invite` (User Onboarding & Site Assignment)
  * `CRM`
    * Lead
    * Quotation
  * `List of Resources`

### Module 2: Main Dashboard (`Home`)
* **Quick Actions:**
  * `+ Create Project` button
  * `+ Planning Project` button
* **Project Feed / Grid:**
  * Displays all created projects by their distinct names.
  * Clicking a project opens its real-time dashboard showing live DPRs, progress percentages, photos, tasks, and financial transactions updated by the assigned site staff.

### Module 3: Create Project & Project Workspace
Following the exact sequence updated by the client (`1 to 4` $\rightarrow$ `Site Staff` $\rightarrow$ `5 to 12`):

1. **Project Name & Photo:** Text input + Image upload.
2. **Project Address:** Text/Location input.
3. **Start Date & End Date:** Date pickers.
4. **Project Value:** Numeric/Currency input.
5. **Site Staff Assignment** *(Inserted per 12:25 message)*:
   * Site Staff Name
   * Designation
6. **Party Name (Company):** Client/Company name.
7. **DPR (Daily Progress Report):** Daily logs (worker count, tower/floor activity, material updates).
8. **Transaction:** Financial logs, site expenses, or billing milestones.
9. **Site Progress:**
   * `i.` Work Progress % (Slider or numeric percentage)
   * `ii.` Site Photo (Multiple image upload with timestamps)
   * `iii.` Remarks (Text notes)
10. **Task Management:**
    * `i.` Problem (Issue description)
    * `ii.` Plan (Proposed action plan)
    * `iii.` Solution (Resolution status/details)
11. **Design:** Blueprint, CAD, or design image/PDF uploads.
12. **Files:** General project documents.
13. **Group Meeting Planning:** Scheduling, agendas, and meeting notes.

### Module 4: Invite & Role-Based Access Control (RBAC)
* **Workflow:**
  1. Admin/PM navigates to **Invite Project**.
  2. Fills in the onboarding form:
     * **User Type:** (e.g., Site Engineer, Supervisor, Site Manager)
     * **Name:** Full Name
     * **Email:** Email Address
     * **Mobile Number:** Unique Phone Number *(Primary Login Identifier)*
     * **Designation:** Job Title
     * **Assigned Project/Site:** Dropdown to bind user to a specific project.
  3. Admin submits the form $\rightarrow$ System generates an invite link/credentials.
  4. **Site User Login:** The staff member logs in using their **Mobile Number** (via OTP or assigned password). The system routes them *exclusively* to the assigned project workspace so they can fill out DPR, Site Progress, Tasks, etc.

### Module 5: CRM (Lead & Quotation)
* **UI Layout:** Clicking CRM in the sidebar displays the CRM overview on the right panel with two tabs/cards: **Lead** and **Quotation**.
* **UX Flow (Applies to both Lead & Quotation):**
  * **Initial State:** Blank list view with a sticky/bottom **`+ Create Lead`** (or **`+ Create Quotation`**) button.
  * **Creation State:** Opens the data entry form with a **`Save`** button at the bottom. *(Note: Build a sample/template form first as requested in Recording 1 so the client can review it).*
  * **Populated State:** Saved records appear on the previously blank page as a **numbered sequential list** (`#1`, `#2`, `#3`, etc.) with options to view or edit.

### Module 6: Payroll People & List of Resources
* **Payroll People:**
  * Links site staff (Engineers, Supervisors, Workers) to specific regional sites (e.g., Hyderabad site).
  * Tracks daily attendance and site presence.
* **List of Resources (Resource Directory):**
  1. **Name:** Full Name
  2. **Address:** Residential/Contact Address
  3. **Designation:** Role/Skill (e.g., Mason, Electrician, Supervisor)
  4. **Number:** Contact Mobile Number
  5. **Gender:** Dropdown/Radio
  6. **Age:** Numeric input

---

## 4. Database Schema Overview (MongoDB)

* **`Users` Collection:** `_id`, `name`, `email`, `mobileNumber` (Unique Index), `passwordHash`, `userType`, `designation`, `assignedProjectIds[]`, `languagePref`.
* **`Projects` Collection:** `_id`, `projectName`, `projectPhotoUrl`, `address`, `startDate`, `endDate`, `projectValue`, `assignedStaff[]` (Name, Designation, UserID), `partyName`, `createdBy`.
* **`ProjectUpdates` Collection (Linked to `projectId`):**
  * `dprs[]` (date, laborCount, floorTowerDetails, materialNotes)
  * `transactions[]` (amount, type, date, remarks)
  * `siteProgress[]` (progressPercentage, photoUrls[], remarks, updatedBy, timestamp)
  * `tasks[]` (problem, plan, solution, status)
  * `designs[]` (fileUrl, title, uploadedAt)
  * `files[]` (fileUrl, fileName)
  * `meetings[]` (date, agenda, participants, notes)
* **`CRM_Leads` & `CRM_Quotations` Collections:** `_id`, `serialNumber` (Auto-incremented per type), `clientName`, `contact`, `details`, `status`, `createdAt`.
* **`Resources` Collection:** `_id`, `name`, `address`, `designation`, `mobileNumber`, `gender`, `age`, `assignedSiteId`.

---

## 5. Phased Implementation Roadmap

### Phase 1: Core Structure, Sidebar & UI Shell (Immediate Priority)
* *Goal:* Subhashis Sir explicitly requested to complete the base structure first so he can review it (`"এই স্ট্রাকচারটা এখন তৈরি করো"`).
* Set up the main layout with the Left Sidebar (3-dot menu) containing Admin (Profile, Language, Password), Home, Payroll People, Company Settings, Invite, and CRM.
* Build the CRM Blank Page $\rightarrow$ Bottom Create Button $\rightarrow$ Sequential Numbered List workflow with a sample Lead/Quotation form.

### Phase 2: Project Creation & Dashboard Integration
* Build the **Create Project** form following the exact 1–13 sequence (including Site Staff after Project Value).
* Build the **Planning Project** view on the Dashboard.
* Render created projects as cards on the Main Dashboard.

### Phase 3: Invite System & Site-Specific Mobile Login
* Develop the **Invite Project** form.
* Implement authentication logic where a user's Mobile Number maps strictly to their assigned site/project.
* Build the Site Staff portal view (allowing them to update DPR, Site Progress %, Site Photos, Remarks, and Problem/Plan/Solution tasks).

### Phase 4: Resources, Payroll People & Performance Optimization
* Build the **List of Resources** CRUD module (Name, Address, Designation, Number, Gender, Age).
* Integrate **Payroll People** for site-wise attendance tracking.
* **Server & Database Optimization:** Address the `Render.com` + `MongoDB` cold-start latency mentioned in the call by implementing connection pooling, a health-check cron job (to prevent Render free/starter instances from sleeping), and proper loading states/error boundaries on the frontend.