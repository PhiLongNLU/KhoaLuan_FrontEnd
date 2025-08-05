# KhoaLuan_FE Project

This project includes two sub-projects: a **backend** using FastAPI with MongoDB, and a **frontend** using Next.js.

## 📁 Project Structure

```bash
.
├── backend/ # FastAPI backend with MongoDB
├── frontend/ # Next.js frontend
├── dockerfile
└── README.md
```

---


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/PhiLongNLU/KhoaLuan_FrontEnd.git
cd KhoaLuan_FE
```

---

## 🔧 Backend Setup (FastAPI)

### Step 1: Environment Variables

Go to the `backend/` folder:
```bash
cd backend
```
Copy the `.evn.example` file and rename it to `.env`:
```bash
cp .evn.example .env
```
Make sure your MongoDB URI is correctly configured in the .env file.

|   ✅ Start MongoDB before running the backend.

---

### Step 2: Create and Activate Virtual Environment
On Linux / macOS:
```bash
python3 -m venv .venv
source .venv/bin/activate
```
On Windows:
```bash
python -m venv .venv
.venv\Scripts\activate
```

---

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

---

### Step 4: Run the Backend Server
```bash
uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

Visit `http://localhost:8000/docs` to access the Swagger UI.

---

## 🌐 Frontend Setup (Next.js)

### Step 1: Environment Variables

Go to the `frontend/` folder:
```bash
cd frontend
```

Copy the `.evn.example` file and rename it to `.env`:
```bash
cp .evn.example .env
```

---

### Step 2: Install Dependencies
```bash
npm install
```

---

### Step 3: Run the Development Server
```bash
npm run dev
```

Frontend will also run at: `http://localhost:8000`


| Make sure the backend and frontend do not conflict on the same port. 

| You can change the port in the `.env` or `next.config.ts` if needed.

---


## ✅ Notes

    Ensure MongoDB is running and accessible.

    Use separate .env files in both backend/ and frontend/.

    Keep virtual environments and dependencies isolated.

Happy coding! 🚀


---