# 📅 Academic Scheduling System (MERN + Flutter)

A comprehensive full-stack solution for university timetable management, featuring an automated scheduling algorithm, JWT authentication, and cross-platform access for administrators and faculty.

## 🚀 Features

* **Automated Scheduling Algorithm:** A backtracking-based engine that generates conflict-free timetables based on room types, teacher availability, and student group constraints.
* **Constraint Management:** Hard-coded restrictions for weekends (e.g., no Friday sessions) and teacher workload limits (9-hour maximum).
* **Multi-Platform Access:** * **React Dashboard:** For administrative control, algorithm triggers, and data management.
    * **Flutter Mobile App:** For teachers to view schedules and submit change requests.
* **Secure Authentication:** JWT-protected routes with role-based access control.
* **Data Export:** Professional PDF and CSV export functionality for administrative records.
* **Teacher Interaction:** Integrated demand system allowing faculty to request slot changes directly through the mobile interface.

## 🛠️ Tech Stack

**Backend:**
* Node.js & Express.js
* MySQL (Relational Database)
* JWT (Authentication)
* PDFKit (Document Generation)

**Frontend:**
* React.js (Admin Dashboard)
* Flutter (Mobile Client)

**DevOps/Tools:**
* Ngrok (Secure Tunneling for Cross-Platform Testing)
* Postman (API Testing & Documentation)

## 🏗️ Backend Architecture

The backend follows a Controller-Service-Route pattern to ensure scalability and separation of concerns:
* `controllers/`: Handles request logic and responses.
* `services/`: Contains the core Scheduling Algorithm logic.
* `routes/`: API endpoint definitions.
* `middleware/`: Authentication checks and CORS handling.

## 🚦 Getting Started

### Prerequisites
* Node.js (v18+)
* MySQL Server
* Flutter SDK (for mobile)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory:
    ```env
    PORT=8000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=yourpassword
    DB_NAME=university_db
    JWT_SECRET=your_secret_key
    ```

4.  **Run the server:**
    ```bash
    npm start
    ```

## 🔒 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | Authenticate user & return JWT |
| POST | `/api/sessions/generate` | Trigger the scheduling algorithm (Admin) |
| GET | `/api/sessions/export` | Download the current timetable as CSV |
| POST | `/api/sessions/demand` | Submit a teacher change request |

## ⚖️ License
This project was developed for the L2 Semester 4 Academic Presentation.

---
Developed by **Fares** & Team.