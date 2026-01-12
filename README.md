# Expenza-Django-Next-Full-Stack-App-built-Django-and-Next-Js-
A high-performance, full-stack expense management system featuring a decoupled architecture with a Django REST Framework (DRF) backend and a responsive Next.js frontend. Optimized for speed, security, and seamless user experience.

# 💰 SpendWise: Full-Stack Expense Management System

SpendWise is a robust, end-to-end financial tracking application designed to help users manage their personal finances with ease. By leveraging the power of **Django** for a secure backend and **Next.js** for a lightning-fast frontend, SpendWise provides a seamless CRUD experience for daily financial logging.



## 🚀 Features
- **Secure Authentication:** JWT-based login and registration.
- **Expense Tracking:** Create, read, update, and delete expenses with categories and dates.
- **Dynamic Dashboard:** Real-time data visualization of spending habits.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.
- **RESTful API:** Clean and documented API endpoints powered by DRF.

## 🛠️ Tech Stack

**Frontend:**
- **Next.js** (React Framework)
- **Axios** (API Client)
- **Tailwind CSS** (Styling)

**Backend:**
- **Django** (Python Framework)
- **Django REST Framework (DRF)** (API Architecture)
- **PostgreSQL / SQLite** (Database)

## 🏗️ Architecture
The application uses a **decoupled architecture**:
1.  **Backend:** Acts as a headless API service, handling business logic and database persistence.
2.  **Frontend:** A standalone Single Page Application (SPA) that consumes the API via Axios, ensuring a fast and interactive user interface.



## ⚙️ Installation & Setup

### Backend (Django)
1. Clone the repository: `git clone https://github.com/yourusername/SpendWise.git`
2. Navigate to backend: `cd backend`
3. Create a virtual environment: `python -m venv venv`
4. Activate venv: `source venv/bin/activate` (Use `venv\Scripts\activate` on Windows)
5. Install dependencies: `pip install -r requirements.txt`
6. Run migrations: `python manage.py migrate`
7. Start server: `python manage.py runserver`

### Frontend (Next.js)
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file and add your backend URL:
   `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
4. Start development server: `npm run dev`

## 📡 API Endpoints (Brief)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses/` | List all expenses |
| POST | `/api/expenses/` | Create a new expense |
| PUT | `/api/expenses/{id}/` | Update an existing record |
| DELETE | `/api/expenses/{id}/` | Remove a record |

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Created by [Your Name] - [Your LinkedIn/Portfolio Link]*
