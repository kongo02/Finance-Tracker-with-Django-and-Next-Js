# 📊 OBICS Finance Tracker

OBICS is a sophisticated, full-stack financial management application designed for precision and ease of use. It leverages a decoupled architecture, combining a **Django REST Framework (DRF)** backend with a modern **Next.js 14** frontend to deliver a seamless, real-time budgeting experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/frontend-Next.js%2014-black)
![Django](https://img.shields.io/badge/backend-Django%20REST%20Framework-092e20)
![Tailwind CSS](https://img.shields.io/badge/styling-Tailwind%20CSS-38b2ac)

## 🚀 Key Features

-   **Full CRUD Functionality:** Seamlessly add, view, and delete financial transactions.
-   **Automated Calculations:** Real-time updates for Total Income, Expenses, and Net Balance.
-   **PDF Report Generation:** Export your financial history into a professional PDF format with one click using `jsPDF`.
-   **Secure API Communication:** Axios-driven requests with interceptors for JWT Bearer token authentication.
-   **Responsive Dashboard:** A clean, "daisyUI" inspired interface that works beautifully on mobile, tablet, and desktop.
-   **Robust Backend:** UUID-based transaction tracking and optimized ordering for data integrity.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + DaisyUI
- **Icons:** Lucide React
- **API Client:** Axios
- **Notifications:** React Hot Toast
- **Export Utility:** jsPDF

### Backend
- **Framework:** Django & Django REST Framework (DRF)
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **Authentication:** JWT (JSON Web Tokens)
- **Schema:** UUID Primary Keys for enhanced security

## 🏗️ Architecture

The application follows a **Decoupled Headless Architecture**:
1.  **Backend (API):** A stateless REST API handling business logic, data persistence, and serialization.
2.  **Frontend (Client):** A client-side rendered application that interacts with the API via secure interceptors, ensuring data is always up-to-date without full-page reloads.

## ⚙️ Installation & Setup

### 1. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
