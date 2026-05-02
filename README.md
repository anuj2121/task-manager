# 🚀 Task Manager (Full-Stack Project)

> A full-stack web application where users can create projects, assign tasks, and track progress with role-based access control.

---

## ✨ Features

- 🔐 Authentication (Signup / Login using JWT)  
- 👥 Role-based access (Admin / Member)  
- 📁 Project & Team Management  
- 📌 Task Creation & Assignment  
- 🔄 Task Status Tracking  
  - TODO → IN_PROGRESS → DONE  
- 📊 Dashboard  
  - Total Tasks  
  - Progress  
  - Overdue Tasks  
- 🌙 Dark Mode UI  

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Spring Boot (Java)  
- **Database:** PostgreSQL  
- **Authentication:** JWT (JSON Web Tokens)  
- **Deployment:** Railway  

---

## ⚙️ How to Run Locally

### 🔧 Prerequisites

```text
Java 17+
Maven
PostgreSQL
🚀 Backend Setup
cd backend
./mvnw spring-boot:run

Update your database configuration:
Properties
spring.datasource.url=jdbc:postgresql://localhost:5432/taskdb
spring.datasource.username=your_username
spring.datasource.password=your_password

🌐 Frontend Setup
Open login.html in browser
OR
Use Live Server (recommended)

🔐 Roles
Role	Access
ADMIN	Full control (projects, members, tasks)
MEMBER	Limited (view & update tasks only)

🌐 Live Demo
Coming soon (Railway deployment)

📸 Screenshots
Login Page
Dashboard
Task Management

🧠 Key Highlights
✔ JWT Authentication
✔ Role-Based Access Control
✔ REST API Design
✔ Real-time Dashboard Updates
✔ Clean UI with Dark Mode

👤 Author
Anuj Kumar Yadav
