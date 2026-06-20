# DecisionLens AI

An AI-powered life decision simulator and second-opinion reasoning system.

## Overview

DecisionLens AI helps you make better life decisions by:
- Providing structured decision analysis
- Identifying hidden tradeoffs
- Simulating multiple scenarios
- Offering diverse perspectives
- Creating clarity reports

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: FastAPI, Python
- **AI Layer**: Gemini API, LangGraph, LangChain
- **Database**: MySQL (local)
- **PDF**: ReportLab

## Installation

### Prerequisites

- Python 3.11+
- Node.js 20+
- MySQL 8.0+
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/decisionlens-ai.git
   cd decisionlens-ai

2. Set up the backend

bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt


3. Configure environment variables
Create a .env file in the backend directory:

text
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/decisionlens
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=dev_secret_key_12345

4. Set up the database

bash
mysql -u root -p
CREATE DATABASE decisionlens;

5. Run the backend

bash
python run.py
# Or
uvicorn app.main:app --reload

6. Set up the frontend

bash
cd ../frontend
npm install
npm run dev

7. Access the application

Frontend: http://localhost:5173

Backend API: http://localhost:8000

API Documentation: http://localhost:8000/docs

Docker Deployment
8. Set up environment variables

bash
export GEMINI_API_KEY=your_gemini_api_key_here

9. Build and run

bash
docker-compose up --build

## Project Structure
text
decisionlens-ai/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── agents/         # LangGraph agents
│   │   ├── api/            # API routes
│   │   ├── database/       # SQLAlchemy models
│   │   ├── pdf/            # PDF generation
│   │   └── services/       # Business logic
│   └── requirements.txt
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── package.json
└── docker-compose.yml

Features
Decision Intake: Describe your decision in your own words

Diagnostic Questions: AI asks 5 questions about values, constraints, and risk tolerance

Tradeoff Discovery: Identify 3-5 hidden tradeoffs

Scenario Simulation: Best, expected, and worst case for each option

Multi-Agent Perspectives: 5 advisor personas provide different viewpoints

Uncertainty Mapping: Knowns, unknowns, and assumptions

Clarity Report: Comprehensive PDF report with insights and next steps

Responsible AI
The AI NEVER decides for you

Shows confidence levels and assumptions

Displays multiple perspectives

Highlights missing information

You always make the final decision

