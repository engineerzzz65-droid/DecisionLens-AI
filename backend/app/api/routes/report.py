from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import tempfile

from app.database.session import get_db
from app.database import crud
from app.agents.report_agent import ReportAgent
from app.pdf.report_generator import PDFReportGenerator

router = APIRouter()

class ReportRequest(BaseModel):
    decision_id: int
    include_charts: bool = True

@router.post("/generate")
def generate_report(
    request: ReportRequest,
    db: Session = Depends(get_db)
):
    """Generate clarity report"""
    report_agent = ReportAgent()
    
    # Get decision and all data
    decision = crud.get_decision(db, request.decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    # Compile all data
    context = decision.context
    scenarios = decision.scenarios
    tradeoffs = decision.tradeoffs
    
    # Build state
    state = {
        "decision_text": decision.description,
        "user_profile": {
            "values": context.values_profile if context else {},
            "constraints": context.constraints if context else {},
            "risk_tolerance": context.risk_tolerance if context else 5
        },
        "tradeoffs": [{"description": t.description, "category": t.category} for t in tradeoffs],
        "simulated_scenarios": [
            {
                "label": s.label,
                "financial_score": s.financial_score,
                "career_score": s.career_score,
                "lifestyle_score": s.lifestyle_score,
                "risk_score": s.risk_score,
                "values_score": s.values_score,
                "confidence_level": s.confidence_level,
                "narrative": s.narrative
            }
            for s in scenarios
        ]
    }
    
    # Generate report
    result = report_agent.graph.invoke(state)
    report_data = result.get("final_report", {})
    
    # Update decision status
    crud.update_decision_status(
        db,
        request.decision_id,
        models.DecisionStatus.COMPLETE
    )
    
    return {
        "status": "success",
        "report": report_data
    }

@router.post("/export-pdf")
def export_pdf(
    request: ReportRequest,
    db: Session = Depends(get_db)
):
    """Export report as PDF"""
    # First generate the report
    report_response = generate_report(request, db)
    report_data = report_response.get("report", {})
    
    # Generate PDF
    pdf_generator = PDFReportGenerator()
    pdf_path = pdf_generator.generate_pdf(report_data)
    
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"decision_report_{request.decision_id}.pdf"
    )