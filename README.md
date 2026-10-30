# Codesphere

A modern full-stack web application featuring a **FastAPI** Python backend and a **Vue.js (Vite)** frontend.

---

##  Project Requirements & Environment
Versions:
* **Python Version:** `v3.12.7`
* **Node.js Version:** `v24.19.0`
* **NPM Version:** `11.17.0`

---

##  Cloning the Project
To get a local copy of this repository on your computer, open your terminal and run the following commands:

```bash
# Clone the repository
git clone https://github.com/HassanUsmani/Codesphere.git

# Move into the project workspace root folder
cd Codesphere
```

---

## Backend Setup (FastAPI)

Follow these steps to set up your Python server environment:

```bash
# 1. Navigate into the Backend folder from the root directory
cd Backend

# 2. Activate the local virtual environment (.venv)
# For Windows (cmd):
.\.venv\Scripts\Activate.bat

# 3. Download and install all required Python packages from requirements.txt
pip install -r requirements.txt

# 4. run the fastapi server
uvicorn main:app --reload
```
Swagger UI for fastapi `http://127.0.0.1:8000/docs`.

---

## Frontend Setup (Vue.js + Vite)

To set up the client-side user interface, open a **separate terminal window** or stop the backend, return to the workspace root, and move into the Frontend directory:

```bash
# 1. Leave the Backend folder and return to the root workspace (if needed)
cd ..

# 2. Navigate into the Frontend folder
cd Frontend

# 3. Download and install the Node module dependencies
npm install

# 4. run the npm server
npm run dev
```
Copy the URL `http://localhost:5173/` and paste it in the browser

---


