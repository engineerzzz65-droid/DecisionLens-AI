# DecisionLens AI

DecisionLens AI is a structured decision support platform that combines AI-guided analysis, scenario simulation, and tradeoff discovery to help you make clearer, more confident decisions.

## What it does

- Helps you define a decision clearly and capture what matters most.
- Generates diagnostic insight questions to reveal values, constraints, and risk tolerance.
- Identifies hidden tradeoffs and strengths across your options.
- Simulates best, expected, and downside scenarios.
- Presents multiple advisor perspectives to broaden your view.
- Produces a concise clarity report for review or sharing.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, Python
- AI / Langchain Layer: Gemini API, LangGraph, LangChain
- Database: MySQL
- PDF reporting: ReportLab

## Prerequisites

- Python 3.11+
- Node.js 20+
- MySQL 8.0+
- Docker (optional)

## Local development

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/decisionlens-ai.git
cd decisionlens-ai
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in `backend/` with values similar to the example below:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/decisionlens
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=dev_secret_key_12345
```

### 4. Create the database

```bash
mysql -u root -p
CREATE DATABASE decisionlens;
```

### 5. Run the backend

```bash
python run.py
```

Alternatively, if you prefer Uvicorn:

```bash
uvicorn app.main:app --reload
```

### 6. Run the frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 7. Open the app

- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs

## Docker setup

If you want to run the app with Docker, use the provided compose file.

```bash
docker-compose up --build
```

You may still need to configure environment variables for the backend service depending on your setup.

## Project structure

```text
decisionlens-ai/
├── backend/                 # FastAPI backend and AI services
│   ├── app/
│   │   ├── agents/         # LangGraph / AI agents
│   │   ├── api/            # REST routes and request schemas
│   │   ├── database/       # SQLAlchemy models and CRUD layers
│   │   ├── pdf/            # PDF report generation
│   │   └── services/       # AI helper logic and external integration
│   ├── requirements.txt
│   └── run.py
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # app state providers
│   │   ├── pages/          # route pages
│   │   └── services/       # frontend API client
│   └── package.json
└── docker-compose.yml
```

## Core features

- Decision intake and structure
- Diagnostic question flow
- Tradeoff discovery and comparison
- Scenario simulation for risk and reward
- Advisor perspectives for alternate viewpoints
- Downloadable clarity report

## Responsible AI guidance

- AI is intended to support your thinking, not replace it.
- The system highlights assumptions and confidence levels.
- You always retain the final decision authority.

## Notes

- Replace `yourusername` in the clone command with the actual GitHub repository owner.
- Ensure your MySQL service is running and accessible before starting the backend.
- If you make frontend changes, restart `npm run dev` to load updates.

