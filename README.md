

# 📚 Shelf — Kindle-like Web App for Personal Digital Library

Shelf is a **full-stack web application** that allows users to upload, store, and read digital books online — similar to Kindle, but self-hosted.  
It provides a seamless reading experience with features like reading progress tracking, bookmarks, themes, and analytics.

---

## 🚀 Overview

Shelf enables users to build their own cloud-based personal library.  
It handles everything from **book uploads**, **storage (MinIO)**, and **metadata management (MySQL/MongoDB)** to **in-browser reading** with stateful reading progress and history.

The architecture follows a **clean separation of concerns**:
- **Spring Boot backend** for REST APIs, authentication, and data persistence
- **React frontend** for an interactive reading interface
- **MinIO** as a private cloud storage for book files (PDF/EPUB)
- **MySQL/MongoDB** for metadata (title, author, progress, etc.)



## 🧠 Architecture

```plaintext
                ┌────────────────────────────┐
                │          Client             │
                │  React.js (Reader UI)       │
                │  Book listing, reader view  │
                └────────────┬───────────────┘
                             │ REST API Calls
                             ▼
                ┌────────────────────────────┐
                │       Spring Boot API       │
                │  Controllers / Services     │
                │  Book, User, Progress, etc. │
                └────────────┬───────────────┘
                             │
          ┌──────────────────┼────────────────────┐
          ▼                  ▼                    ▼
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│   MySQL DB     │   │    MinIO       │   │ Authentication │
│ Book metadata  │   │ Book files     │   │ JWT/Session     │
│ History, notes │   │ PDF/EPUB data  │   │ OAuth Ready     │
└────────────────┘   └────────────────┘   └────────────────┘
````

---

## ⚙️ Tech Stack

### **Backend**

* **Spring Boot 3+**
* **Spring Data JPA / MongoDB**
* **Spring Security + JWT**
* **MinIO SDK for file storage**
* **MySQL / MongoDB**

### **Frontend**

* **React + Vite**
* **React Router DOM**
* **Axios for API calls**
* **Tailwind CSS / Material UI**
* **PDF.js / EPUB.js for reading**

### **Storage & Infrastructure**

* **MinIO (S3-compatible object storage)**
* **Docker for containerization**
* **Nginx (optional for reverse proxy)**

---

## 💡 Features

✅ **Book Upload & Storage**
Upload PDF or EPUB files directly — stored in MinIO, linked with metadata in DB.

✅ **In-Browser Reader**
Smooth reading interface with pagination, themes, and font control.

✅ **Reading Progress Tracking**
Automatically saves where you left off per book.

✅ **Bookmarks & Highlights** 
Mark pages or highlight text for later reference.

✅ **User Authentication** *(upcoming)*
JWT-based secure login, signup, and token refresh.

✅ **Library Search & Filtering**
Search by title, author, or genre.

✅ **Reading Analytics Dashboard** *(upcoming)*
Track total reading time, books read, and session insights.

✅ **Offline Reading & Caching** *(planned)*
Preload selected books for offline access.

---

## 🧩 Folder Structure

### Backend

```
shelf-backend/
 ├── src/main/java/com/shelf/
 │    ├── controller/
 │    ├── service/
 │    ├── model/
 │    ├── repository/
 │    └── config/
 ├── src/main/resources/
 │    └── application.yml
 └── pom.xml
```

### Frontend

```
shelf-frontend/
 ├── src/
 │    ├── components/
 │    ├── pages/
 │    ├── context/
 │    ├── utils/
 │    └── App.jsx
 ├── public/
 └── package.json
```

---

## 🛠️ Setup Instructions

### **1️⃣ Backend Setup**

#### Prerequisites

* Java 17+
* Maven
* MySQL or MongoDB
* MinIO instance running locally or remotely

#### Steps

```bash
# clone repo
git clone https://github.com/<your-username>/shelf.git
cd shelf/shelf-backend

# update application.yml
spring.datasource.url=jdbc:mysql://localhost:3306/shelf
spring.datasource.username=root
spring.datasource.password=yourpassword

minio.url=http://localhost:9000
minio.access-key=your-access-key
minio.secret-key=your-secret-key

# run server
mvn spring-boot:run
```

---

### **2️⃣ Frontend Setup**

```bash
cd shelf/shelf-frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## 🔒 Authentication Flow

1. User logs in → server issues JWT
2. Token stored in browser (HTTP-only cookie or localStorage)
3. Each API call includes JWT header
4. Token refresh handled automatically via `/auth/refresh`

---

## 📈 Planned Enhancements

* 📑 Highlighting, Notes, and Bookmarks
* 🎨 Customizable Fonts and Themes
* 📊 Analytics Dashboard (reading time, sessions)
* 💾 Offline Reading with Caching
* ⚡ Lazy Loading and Smart Pagination
* 🔍 ElasticSearch integration for advanced library search

---

## 🧑‍💻 Author

**Shubham Darekar**
Full Stack Developer | Java + React | System Design Enthusiast

* 🔗 [LinkedIn](https://www.linkedin.com/in/shubham-darekar-236424257/)
* 💻 [GitHub](https://github.com/Shubham0D4)

---

## 🧱 License

This project is licensed under the **MIT License** – you’re free to use, modify, and distribute it with attribution.

---


Would you like me to **generate a PlantUML architecture diagram** and include it directly in this README (as a code block or image) to visually represent the workflow? That’ll make it more complete for company/demo use.
```
