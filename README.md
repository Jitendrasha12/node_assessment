# 🧠 Node.js Assessment Project

This project demonstrates multi-threaded file processing using **Worker Threads** in Node.js and data management with **MongoDB**.  
It also includes real-time CPU monitoring and scheduled database insertion using background services.

---

## 🚀 Features

### **Task 1 – Data Management**
1. Upload and parse **CSV/XLSX** data into MongoDB using **Worker Threads**.  
   - Collections:  
     - Agent  
     - User  
     - Account  
     - LOB (Policy Category)  
     - Carrier  
     - Policy  
2. Search API to find policy info by **username**.  
3. Aggregation API to show policies grouped by each user.

### **Task 2 – System and Services**
1. **Real-time CPU Utilization Tracker**  
   - Restarts the server automatically if CPU usage exceeds **70%**.
2. **Scheduled Post Service**  
   - Inserts a message into the database at a specified **day and time** (using cron/scheduler).

---

## 🧩 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Worker Threads**
- **XLSX / CSV Parser**
- **os-utils** for CPU tracking
- **Node-cron** for scheduling

---

## 🗂️ Project Structure

```
📁 project-root/
│
├── models/
│   ├── Agent.js
│   ├── User.js
│   ├── Account.js
│   ├── Lob.js
│   ├── Carrier.js
│   └── Policy.js
│
├── worker/
│   └── parseWorker.js
│
├── routes/
│   ├── uploadRoutes.js
│   ├── searchRoutes.js
│   └── aggregateRoutes.js
│
├── utils/
│   ├── cpuMonitor.js
│   └── scheduler.js
│
├── .env
├── server.js
└── README.md
```

---

## ⚙️ Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nodejs-assessment.git
   cd nodejs-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://nodeAssessment:hf0H26gJhp7hkAtc@cluster0.eil9lvj.mongodb.net/nodeAssessment
   ```

4. **Start the server**
   ```bash
   npm start
   ```

---

## 🧵 How Worker Threads Work in This Project

When you upload a CSV/XLSX file:

- The **API route** spawns a **Worker Thread** (`parseWorker.js`).
- Worker runs in a separate thread (non-blocking to main server).
- It:
  - Connects to MongoDB.
  - Parses the file.
  - Inserts records into collections (Agent, User, Account, LOB, Carrier, Policy).
- Once done, it sends a success message back to the main thread via:
  ```js
  parentPort.postMessage({ success: true, inserted: rows.length });
  ```

This prevents the main thread from freezing during heavy uploads.

---

## 🔗 API Endpoints

### 1️⃣ Upload Data (CSV/XLSX)
**POST** `/api/upload`  
Uploads and processes the data file.

```bash
curl -X POST http://localhost:5000/api/upload   -F "file=@./data.csv"
```

---

### 2️⃣ Search Policy by Username
**GET** `/api/policy/search?username=John`

```bash
curl "http://localhost:5000/api/policy/search?username=John"
```

---

### 3️⃣ Aggregate Policy by User
**GET** `/api/policy/aggregate`

```bash
curl "http://localhost:5000/api/policy/aggregate"
```

---

### 4️⃣ CPU Monitor Service
Monitors real-time CPU usage; restarts the server if usage >70%.

You can run it as a background service:
```js
require('./utils/cpuMonitor')();
```

---

### 5️⃣ Scheduled Message Service
**POST** `/api/schedule`

Request Body:
```json
{
  "message": "Database backup",
  "day": "Monday",
  "time": "15:00"
}
```

```bash
curl -X POST http://localhost:5000/api/schedule   -H "Content-Type: application/json"   -d '{"message": "Backup", "day": "Monday", "time": "15:00"}'
```

---

## 📊 MongoDB Collections Overview

| Collection | Description |
|-------------|--------------|
| **Agent** | Contains agent details |
| **User** | Stores user profile info |
| **Account** | User account reference |
| **Lob** | Policy categories |
| **Carrier** | Insurance company details |
| **Policy** | Policy info with user, agent, carrier references |

---

## 🧠 Interview Key Points

| Question | Answer |
|-----------|---------|
| Why use Worker Threads? | To handle CPU-intensive tasks (like file parsing) without blocking the event loop. |
| How do `parentPort` and `workerData` work? | `workerData` sends input to the worker, and `parentPort.postMessage()` sends result back. |
| Can we call `run()` from API? | Not directly — worker runs in its own thread, but we can trigger it via messages. |
| Why restart server on 70% CPU? | To prevent performance degradation and maintain stability under heavy load. |

---

## 📦 Example Response (Upload API)
```json
{
  "success": true,
  "inserted": 120
}
```

---

## 🧰 Scripts

| Command | Description |
|----------|-------------|
| `npm start` | Start server |
| `npm run dev` | Start server in development (with nodemon) |
| `npm test` | Run test suite |

---

## 👨‍💻 Author

**Jitendra Sharma**  
Node.js Backend Developer  
📧 [your-email@example.com]  
🌐 [GitHub Profile](https://github.com/your-username)

---

## 🛡️ License

This project is licensed under the **MIT License**.
