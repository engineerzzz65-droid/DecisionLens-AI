from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class PDFReportGenerator:
    """Generate PDF reports for decisions"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_styles()
    
    def _setup_styles(self):
        """Setup custom styles for the report"""
        self.styles.add(ParagraphStyle(
            name='Title',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#0ea5e9'),
            alignment=TA_CENTER,
            spaceAfter=20
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionTitle',
            parent=self.styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#0369a1'),
            spaceBefore=16,
            spaceAfter=8
        ))
        
        self.styles.add(ParagraphStyle(
            name='BodyText',
            parent=self.styles['Normal'],
            fontSize=11,
            leading=16,
            textColor=colors.HexColor('#1f2937')
        ))
        
        self.styles.add(ParagraphStyle(
            name='Disclaimer',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_CENTER,
            spaceBefore=20
        ))
    
    def generate_pdf(self, report_data: dict) -> str:
        """Generate PDF report"""
        # Create temporary file
        filename = f"decision_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join("/tmp", filename)
        
        doc = SimpleDocTemplate(
            filepath,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Build content
        story = []
        
        # Title
        story.append(Paragraph("DecisionLens AI", self.styles['Title']))
        story.append(Paragraph("Clarity Report", self.styles['Title']))
        story.append(Spacer(1, 0.2 * inch))
        
        # Date
        story.append(Paragraph(
            f"Generated: {datetime.now().strftime('%B %d, %Y')}",
            ParagraphStyle(
                'DateStyle',
                parent=self.styles['Normal'],
                alignment=TA_CENTER,
                fontSize=10,
                textColor=colors.HexColor('#6b7280')
            )
        ))
        story.append(Spacer(1, 0.3 * inch))
        
        # Decision Summary
        story.append(Paragraph("1. Decision Summary", self.styles['SectionTitle']))
        summary = report_data.get('decision_summary', '')
        if isinstance(summary, str):
            story.append(Paragraph(summary, self.styles['BodyText']))
        else:
            story.append(Paragraph(str(report_data.get('decision', '')), self.styles['BodyText']))
        story.append(Spacer(1, 0.2 * inch))
        
        # Values Profile
        story.append(Paragraph("2. Values Profile", self.styles['SectionTitle']))
        values_profile = report_data.get('values_profile', {})
        if values_profile:
            for key, value in values_profile.items():
                story.append(Paragraph(f"• <b>{key.capitalize()}</b>: {value}", self.styles['BodyText']))
        story.append(Spacer(1, 0.2 * inch))
        
        # Key Tradeoffs
        story.append(Paragraph("3. Key Tradeoffs", self.styles['SectionTitle']))
        tradeoffs = report_data.get('tradeoffs', [])
        if tradeoffs:
            for i, tradeoff in enumerate(tradeoffs, 1):
                if isinstance(tradeoff, str):
                    story.append(Paragraph(f"{i}. {tradeoff}", self.styles['BodyText']))
                elif isinstance(tradeoff, dict):
                    desc = tradeoff.get('description', '')
                    category = tradeoff.get('category', '')
                    story.append(Paragraph(
                        f"{i}. <b>{desc}</b> <i>({category})</i>",
                        self.styles['BodyText']
                    ))
        story.append(Spacer(1, 0.2 * inch))
        
        # Scenario Comparison
        story.append(Paragraph("4. Scenario Comparison", self.styles['SectionTitle']))
        scenarios = report_data.get('scenarios', [])
        if scenarios:
            # Create table
            table_data = [['Scenario', 'Financial', 'Career', 'Lifestyle', 'Risk', 'Values']]
            for scenario in scenarios:
                if isinstance(scenario, dict):
                    table_data.append([
                        scenario.get('label', ''),
                        str(scenario.get('financial_score', '')),
                        str(scenario.get('career_score', '')),
                        str(scenario.get('lifestyle_score', '')),
                        str(scenario.get('risk_score', '')),
                        str(scenario.get('values_score', ''))
                    ])
            
            table = Table(table_data, colWidths=[2*inch, 0.8*inch, 0.8*inch, 0.8*inch, 0.8*inch, 0.8*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0ea5e9')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
            ]))
            story.append(table)
            story.append(Spacer(1, 0.2 * inch))
        
        # Advisor Perspectives
        story.append(Paragraph("5. Advisor Perspectives", self.styles['SectionTitle']))
        perspectives = report_data.get('perspectives', [])
        if perspectives:
            for perspective in perspectives[:3]:  # Show top 3
                if isinstance(perspective, dict):
                    persona = perspective.get('persona', 'Advisor')
                    concern = perspective.get('key_concern', '')
                    recommendation = perspective.get('recommendation', '')
                    story.append(Paragraph(
                        f"<b>{persona}</b>",
                        self.styles['BodyText']
                    ))
                    if concern:
                        story.append(Paragraph(f"Concern: {concern}", self.styles['BodyText']))
                    if recommendation:
                        story.append(Paragraph(f"Recommendation: {recommendation}", self.styles['BodyText']))
                    story.append(Spacer(1, 0.1 * inch))
        
        # Uncertainty Map
        story.append(Paragraph("6. Uncertainty Map", self.styles['SectionTitle']))
        uncertainty = report_data.get('uncertainty', {})
        if uncertainty:
            knowns = uncertainty.get('knowns', [])
            if knowns:
                story.append(Paragraph("<b>Known Factors:</b>", self.styles['BodyText']))
                for k in knowns:
                    story.append(Paragraph(f"• {k}", self.styles['BodyText']))
            
            unknowns = uncertainty.get('unknowns', [])
            if unknowns:
                story.append(Paragraph("<b>Unknown Factors:</b>", self.styles['BodyText']))
                for k in unknowns:
                    story.append(Paragraph(f"• {k}", self.styles['BodyText']))
        
        story.append(Spacer(1, 0.3 * inch))
        
        # Reflection Questions
        story.append(Paragraph("7. Reflection Questions", self.styles['SectionTitle']))
        questions = report_data.get('reflection_questions', [])
        if questions:
            for i, q in enumerate(questions, 1):
                story.append(Paragraph(f"{i}. {q}", self.styles['BodyText']))
        else:
            story.append(Paragraph(
                "1. What would you do if you weren't afraid?",
                self.styles['BodyText']
            ))
            story.append(Paragraph(
                "2. What does your ideal life look like in 5 years?",
                self.styles['BodyText']
            ))
            story.append(Paragraph(
                "3. What's one small step you can take tomorrow?",
                self.styles['BodyText']
            ))
        
        story.append(Spacer(1, 0.3 * inch))
        
        # Next Research Step
        story.append(Paragraph("8. Next Research Step", self.styles['SectionTitle']))
        next_step = report_data.get('next_research_step', 
            "Consider gathering more information about your top options. "
            "Talk to people who have made similar decisions."
        )
        story.append(Paragraph(next_step, self.styles['BodyText']))
        story.append(Spacer(1, 0.3 * inch))
        
        # Disclaimer
        story.append(Paragraph(
            "Disclaimer: This report is for informational purposes only. "
            "All decisions are ultimately your responsibility. "
            "Consult with appropriate professionals for specific advice.",
            self.styles['Disclaimer']
        ))
        
        # Build the PDF
        try:
            doc.build(story)
            logger.info(f"PDF generated successfully: {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"Error generating PDF: {e}")
            raise