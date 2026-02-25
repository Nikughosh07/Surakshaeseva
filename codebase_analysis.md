# Disaster Relief Platform - Codebase Analysis

## Overview
The Disaster Relief Platform is a full-stack web application designed for crisis management, coordination, and resource tracking. It acts as a centralized dashboard to facilitate real-time map-based tracking, supply chain management, communication, and volunteer dispatch. 

## Technology Stack

**Frontend:**
- **Framework:** React 19 (via Create React App)
- **Styling:** Tailwind CSS, Vanilla CSS (`index.css`, `App.css`)
- **Maps & Location:** Leaflet, React Leaflet, Mapbox-GL
- **Data Visualization:** Recharts
- **Icons:** Lucide-react
- **Real-time:** Socket.io-client
- **HTTP Client:** Axios

**Backend:**
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Real-time:** Socket.io
- **File Uploads:** Multer (for missing person photos, etc.)

---

## Architecture & Directory Structure

The project is structured as a monorepo containing both the `backend/` and `frontend/` components. 

### 1. Backend (`/backend`)
The backend is an Express-based REST API that also exposes WebSocket endpoints for real-time capabilities.

- **`server.js`**: The main entry point. Initializes Express, sets up CORS and JSON middleware, mounts the route handlers (`/api/auth`, `/api/coordination`), configures MongoDB connection, and establishes Socket.io for live updates (like `broadcast-alert` and `inventory-alert`).
- **`models/`**: Contains Mongoose data models. Key schemas include:
  - `User.js`: Application users (Admins, Volunteers).
  - `Camp.js`: Relief camp details.
  - `Volunteer.js`: Specific volunteer tracking data.
  - *(Note: There are also schema definitions like `CrowdReport.js`, `Donation.js`, `MissingPerson.js`, `Task.js` which define the core entities of the platform).*
- **`routes/`**: Express route handlers mapping business logic.
  - `auth.js`: User registration, login, internal authentication checks.
  - `coordination.js`: Main operational endpoints (camps, statistics).
  - `dispatch.js`: Assignment and routing logic for volunteers.
- **`seed.js`**: Utility script to populate the database with dummy/initial prototype data.
- **`uploads/`**: Local storage directory dynamically managing uploaded media (e.g., photos of missing persons).

### 2. Frontend (`/frontend`)
The frontend is built as a Single Page Application (SPA), orchestrated primarily through a single global view manager that conditionally renders "tabs" based on authentication and roles.

- **`src/App.js`**: The root component and main orchestration layer. It handles user authentication state, fetches global active states (Camps, overall Stats), and conditionally renders navigation items and dashboard panes depending on the user's role (`super_admin`, `admin`, or `volunteer`).
- **`src/components/`**: Highly modularized feature-based components:
  - **Authentication / Public:** `LandingPage.js`, `AuthPage.js`
  - **Dashboard Views:** `AdminDashboard.js`, `VolunteerPanel.js`, `CampDirector.js`, `MyMission.js`
  - **Data Modules:** `SupplyTracker.js`, `DonationTracker.js`
  - **Maps/GIS:** `CampLocator.js`, `CrowdMap.js`, `MapCenter.js`
  - **Reporting & Alerts:** `AlertBanner.js`, `AlertBroadcaster.js`, `MissingReport.js`, `MissingReportForm.js`

---

## Core Features & Logic Workflow

1. **Role-Based Workflows:**
   The UI deeply integrates role-based rendering. While a "Super Admin" can see system-wide logs and dispatch, a "Volunteer" is presented with a specialized `MyMission.js` view detailing their exact assignment without UI clutter.

2. **Real-Time Data Distribution:**
   Using `Socket.io`, critical changes in the field (like a sudden drop in supplies or an authoritative alert broadcast) are immediately pushed from the Express backend out to all connected React clients to reflect instantly on the UI without requiring a refresh.

3. **Geospatial Tracking:**
   Camps and crowd reports are inherently tied to geographic coordinates, heavily relying on Leaflet for the interactive "Map Center" interface.

4. **Resource & Logistics Monitoring:**
   Components like `SupplyTracker` and the calculation of a `criticalCount` in `App.js` automatically bubble up priority issues, displaying flashing, color-coded warnings for camps whose inventory statuses dip into "Critical" modes.

## Current State & Observations
- The application currently features a "SIMULATION MODE - Prototype Only" state designed to demonstrate the core features. 
- It has a `concurrently` setup configured in the root to allow running both backend and frontend easily via `npm run dev`.
