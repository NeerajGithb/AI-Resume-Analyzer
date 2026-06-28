import jsPDF from 'jspdf';
import { AnalysisResult } from '@/types';
import { getScoreLabel } from './utils';

export function exportReportAsPDF(result: AnalysisResult, fileName: string): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const LINE_HEIGHT = 7;
  const SECTION_GAP = 10;

  // ─── Helpers ─────────────────────────────────────────────────────────────
  function checkPage(height = 20) {
    if (y + height > 270) {
      doc.addPage();
      y = 20;
    }
  }

  function drawHRule() {
    checkPage(5);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4;
  }

  function heading1(text: string) {
    checkPage(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39);
    doc.text(text, margin, y);
    y += 10;
  }

  function heading2(text: string) {
    checkPage(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(55, 65, 81);
    doc.text(text, margin, y);
    y += 8;
  }

  function bodyText(text: string, color: [number, number, number] = [75, 85, 99]) {
    checkPage(LINE_HEIGHT);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * LINE_HEIGHT;
  }

  function label(text: string) {
    checkPage(LINE_HEIGHT);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(text.toUpperCase(), margin, y);
    y += 6;
  }

  // ─── Header ───────────────────────────────────────────────────────────────
  doc.setFillColor(124, 58, 237); // brand accent
  doc.rect(0, 0, pageWidth, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('AI Resume Analyzer — Analysis Report', margin, 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(221, 214, 254);
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin, 9, { align: 'right' });
  y = 24;

  // ─── Score Overview ────────────────────────────────────────────────────────
  heading1(`ATS Score: ${result.overall_score}/100 — Grade ${result.grade}`);
  bodyText(`Overall assessment: ${getScoreLabel(result.overall_score)}. File analyzed: ${fileName}`);
  y += SECTION_GAP;
  drawHRule();

  // ─── Section Scores ────────────────────────────────────────────────────────────
  heading2('Section Scores');
  const sections = [
    { name: 'ATS Compatibility',  score: result.ats_compatibility?.score  ?? 0, feedback: result.ats_compatibility?.issues?.join(', ') ?? 'No issues found' },
    { name: 'Keyword Analysis',   score: result.keyword_analysis?.score   ?? 0, feedback: '' },
    { name: 'Experience Impact',  score: result.experience_impact?.score  ?? 0, feedback: result.experience_impact?.feedback ?? '' },
    { name: 'Content Quality',    score: result.content_quality?.score    ?? 0, feedback: result.content_quality?.feedback  ?? '' },
    { name: 'Resume Structure',   score: result.resume_structure?.score   ?? 0, feedback: result.resume_structure?.feedback  ?? '' },
    { name: 'Role Matching',      score: result.role_matching?.score      ?? 0, feedback: result.role_matching?.match_explanation ?? '' },
  ];
  for (const section of sections) {
    checkPage(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text(`${section.name}`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`${section.score}/100`, pageWidth - margin, y, { align: 'right' });
    y += 6;
    if (section.feedback) bodyText(section.feedback);
    y += 2;
  }
  y += SECTION_GAP;
  drawHRule();

  // ─── Missing Keywords ──────────────────────────────────────────────────────
  heading2('Missing Keywords');
  const missing = result.keyword_analysis?.missing ?? { technical: [], soft_skills: [], industry: [] };
  if ((missing.technical ?? []).length > 0) {
    label('Technical');
    bodyText(missing.technical.join(', '));
    y += 3;
  }
  if ((missing.soft_skills ?? []).length > 0) {
    label('Soft Skills');
    bodyText(missing.soft_skills.join(', '));
    y += 3;
  }
  if ((missing.industry ?? []).length > 0) {
    label('Industry');
    bodyText(missing.industry.join(', '));
    y += 3;
  }
  y += SECTION_GAP;
  drawHRule();

  // ─── Improvements ──────────────────────────────────────────────────────────
  heading2('Suggested Improvements');
  (result.improvements ?? []).forEach((imp, idx) => {
    checkPage(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text(`${idx + 1}. ${imp.section}`, margin, y);
    y += 7;

    label('Original');
    bodyText(`"${imp.original}"`);
    y += 2;

    label('Improved');
    bodyText(`"${imp.rewrite}"`, [5, 150, 105]);
    y += 2;

    label('Impact');
    bodyText(imp.impact ?? '');
    y += 5;
  });
  drawHRule();

  // ─── Tone & Language Analysis ─────────────────────────────────────────────
  heading2('Tone & Language Analysis');
  const toneFeedback = result.content_quality?.feedback ?? 'Analysis not available';
  bodyText(toneFeedback);
  y += SECTION_GAP;
  drawHRule();

  // ─── ATS Recommendations ────────────────────────────────────────────────────
  heading2('ATS Recommendations');
  const atsTips = (result.ats_compatibility?.issues ?? []);
  atsTips.forEach((tip: string, idx: number) => {
    checkPage(10);
    bodyText(`${idx + 1}. ${tip}`);
    y += 2;
  });

  // ─── Footer ───────────────────────────────────────────────────────────────
  const totalPages = (doc.internal as { pages: unknown[] }).pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Generated by AI Resume Analyzer · Page ${i} of ${totalPages}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  doc.save(`resume-analysis-${Date.now()}.pdf`);
}

