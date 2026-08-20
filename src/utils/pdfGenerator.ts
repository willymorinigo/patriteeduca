import { jsPDF } from "jspdf";
import { Worksheet, SolvedProblemResult, Student, TopicRecord, StudentDiagnosis } from "../types";

/**
 * Cleans and sanitizes text for jsPDF default core standard fonts (Helvetica, Times, Courier).
 * Standard jsPDF fonts only support WinAnsi / Latin-1 encoding (CP1252).
 * UTF-8 emojis (e.g. 💡, ✅, 📝, 🎯, 📋, etc.) and unmapped unicode glyphs render as garbled symbols
 * (mojibake like "Ø=ÜÝ", "'").
 * This function sanitizes text cleanly, preserving all Spanish accents (á, é, í, ó, ú, ñ, ü, ¿, ¡, °, ², ³, etc.).
 */
export function cleanPDFText(text: string | null | undefined): string {
  if (!text) return "";

  return (
    text
      // Strip all 4-byte and 2-byte emoji ranges (surrogate pairs and emoji blocks)
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
      .replace(/[\u2600-\u27BF]/g, "")
      .replace(/[\uE000-\uF8FF]/g, "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      // Convert common symbols to clean readable ASCII equivalents
      .replace(/[“”«»]/g, '"')
      .replace(/[‘’`]/g, "'")
      .replace(/[—–]/g, "-")
      .replace(/…/g, "...")
      .replace(/→/g, "->")
      .replace(/←/g, "<-")
      .replace(/⇒/g, "=>")
      .replace(/•|●|▪/g, "-")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim()
  );
}

export function generateWorksheetPDF(
  worksheet: Worksheet,
  options?: { includeSolutions?: boolean; versionLabel?: string }
): jsPDF {
  const isTeacherVersion = options?.includeSolutions !== false;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm
  const maxContentY = pageHeight - margin - 6; // 277 mm

  let y = margin;

  const drawMiniHeader = () => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Prof. Patricia Morinigo · ${cleanPDFText(worksheet.subject)} - ${cleanPDFText(worksheet.topic)} (${
        isTeacherVersion ? "Versión Docente Resuelta" : "Versión Alumno"
      })`,
      margin,
      9
    );
    doc.text(`Pág. ${doc.getNumberOfPages()}`, pageWidth - margin, 9, { align: "right" });
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, 11, pageWidth - margin, 11);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > maxContentY) {
      doc.addPage();
      y = 15;
      drawMiniHeader();
    }
  };

  // 1. Header Banner
  if (isTeacherVersion) {
    doc.setFillColor(30, 41, 59); // Slate 800 Dark Navy
  } else {
    doc.setFillColor(26, 86, 219); // Royal Blue
  }
  doc.roundedRect(margin, y, contentWidth, 21, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(
    isTeacherVersion
      ? "CLASES PARTICULARES · GUÍA Y SOLUCIONARIO (DOCENTE)"
      : "CLASES PARTICULARES · FICHA DE PRÁCTICA (ALUMNO)",
    margin + 6,
    y + 7.5
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(isTeacherVersion ? 203 : 224, isTeacherVersion ? 213 : 231, 255);
  doc.text(
    isTeacherVersion
      ? "Prof. Patricia Morinigo · Versión con desarrollo paso a paso y respuestas"
      : "Prof. Patricia Morinigo · Provincia de Buenos Aires",
    margin + 6,
    y + 14
  );
  doc.text(`Fecha: ${worksheet.date || new Date().toLocaleDateString("es-AR")}`, pageWidth - margin - 6, y + 14, {
    align: "right",
  });

  y += 25;

  // 2. Student & Meta Info Card
  const colWidth = contentWidth / 2 - 6;
  const studentText = `Alumno/a: ${cleanPDFText(worksheet.studentName) || "___________________________________"}`;
  const subjectText = `Materia: ${cleanPDFText(worksheet.subject)}`;
  const levelText = `Nivel: ${cleanPDFText(worksheet.level)}`;
  const topicText = `Tema: ${cleanPDFText(worksheet.topic)}`;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  const studentLines = doc.splitTextToSize(studentText, colWidth);
  doc.setFont("helvetica", "normal");
  const subjectLines = doc.splitTextToSize(subjectText, colWidth);
  const levelLines = doc.splitTextToSize(levelText, colWidth);
  doc.setFont("helvetica", "bold");
  const topicLines = doc.splitTextToSize(topicText, colWidth);

  const leftColHeight = 3 + studentLines.length * 4.2 + subjectLines.length * 4.2;
  const rightColHeight = 3 + levelLines.length * 4.2 + topicLines.length * 4.2;
  const metaBoxHeight = Math.max(16, Math.max(leftColHeight, rightColHeight) + 3);

  checkPageBreak(metaBoxHeight + 4);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, metaBoxHeight, 1.5, 1.5, "FD");

  // Col 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(studentLines, margin + 4, y + 5.5);
  const subY = y + 5.5 + studentLines.length * 4.2;
  doc.setFont("helvetica", "normal");
  doc.text(subjectLines, margin + 4, subY);

  // Col 2
  const rightX = margin + contentWidth / 2 + 2;
  doc.setFont("helvetica", "normal");
  doc.text(levelLines, rightX, y + 5.5);
  const topY = y + 5.5 + levelLines.length * 4.2;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(isTeacherVersion ? 15 : 30, isTeacherVersion ? 118 : 64, isTeacherVersion ? 110 : 175);
  doc.text(topicLines, rightX, topY);

  y += metaBoxHeight + 5;

  // 3. Worksheet Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(cleanPDFText(worksheet.title), contentWidth);
  checkPageBreak(titleLines.length * 5.2 + 4);
  doc.text(titleLines, margin, y + 1);
  y += titleLines.length * 5.2 + 3;

  // 4. Pedagogical Intro / Toolbox Box
  if (worksheet.pedagogicalIntro) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const introLines = doc.splitTextToSize(cleanPDFText(worksheet.pedagogicalIntro), contentWidth - 14);
    const boxHeight = 10 + introLines.length * 4.0;

    checkPageBreak(boxHeight + 4);
    doc.setFillColor(254, 243, 199); // Warm Amber
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, "FD");

    // Left accent bar
    doc.setFillColor(217, 119, 6);
    doc.roundedRect(margin, y, 2.5, boxHeight, 0.5, 0.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14);
    doc.text("CAJA DE HERRAMIENTAS & REGLA DE ORO DIDÁCTICA:", margin + 6, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 53, 15);
    doc.text(introLines, margin + 6, y + 10);

    y += boxHeight + 5;
  }

  // 5. Exercises Section Header
  checkPageBreak(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(isTeacherVersion ? 30 : 30, isTeacherVersion ? 41 : 64, isTeacherVersion ? 59 : 175);
  doc.text(
    isTeacherVersion
      ? "ACTIVIDADES CON RESOLUCIÓN DETALLADA Y RESPUESTAS (DOCENTE)"
      : "ACTIVIDADES DE PRÁCTICA INDIVIDUAL",
    margin,
    y + 2
  );
  doc.setDrawColor(isTeacherVersion ? 148 : 191, isTeacherVersion ? 163 : 219, isTeacherVersion ? 184 : 254);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 3.5, pageWidth - margin, y + 3.5);
  y += 7;

  // Exercise list
  const exerciseList = worksheet.exercises && worksheet.exercises.length > 0 ? worksheet.exercises : [];

  if (exerciseList.length === 0) {
    checkPageBreak(18);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("No se registraron ejercicios adicionales para esta ficha.", margin + 6, y + 8.5);
    y += 18;
  }

  exerciseList.forEach((ex, idx) => {
    // Statement lines (width constrained accurately to fit inside card alongside badge)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const statementLines = doc.splitTextToSize(
      cleanPDFText(ex.statement),
      contentWidth - 32 // starts at margin + 28, so 182 - 32 = 150 mm width
    );
    const statementHeight = Math.max(6, statementLines.length * 4.2);

    // Hint lines
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const hintLines = ex.hint
      ? doc.splitTextToSize(`Pista didáctica: ${cleanPDFText(ex.hint)}`, contentWidth - 18)
      : [];
    const hintHeight = hintLines.length > 0 ? hintLines.length * 3.8 + 4 : 0;

    if (isTeacherVersion) {
      // -------------------------------------------------------------
      // TEACHER RESOLVED VERSION
      // -------------------------------------------------------------
      const rawSol = ex.solution;
      let stepText = "Aplicar procedimiento analítico paso a paso conforme a lo explicado.";
      let ansText = "Resultado comprobado.";

      if (typeof rawSol === "string") {
        ansText = cleanPDFText(rawSol);
        stepText = cleanPDFText(rawSol);
      } else if (rawSol && typeof rawSol === "object") {
        stepText = cleanPDFText(
          (rawSol as any).stepSummary ||
            (rawSol as any).procedimiento ||
            (rawSol as any).pasos ||
            (rawSol as any).explicacion ||
            stepText
        );
        ansText = cleanPDFText(
          (rawSol as any).answer ||
            (rawSol as any).resultado ||
            (rawSol as any).respuesta ||
            ansText
        );
      }

      // Format resolution step lines
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const solStepLines = doc.splitTextToSize(`Procedimiento: ${stepText}`, contentWidth - 20);
      const solStepHeight = solStepLines.length * 3.8;

      // Format final answer lines
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      const solAnsLines = doc.splitTextToSize(`RESPUESTA FINAL: ${ansText}`, contentWidth - 22);
      const solAnsBoxHeight = solAnsLines.length * 4.0 + 4;

      // Exact inner green box height: header(6) + stepHeight + gap(3) + ansBoxHeight + padding(3)
      const solBoxInnerHeight = 6 + solStepHeight + 3 + solAnsBoxHeight + 3;

      // Total outer card height: topPadding(4) + statementHeight + gap(2) + hintHeight + gap(2) + solBoxInnerHeight + bottomPadding(4)
      const totalCardHeight =
        5 + statementHeight + (hintHeight > 0 ? hintHeight + 2 : 0) + 2 + solBoxInnerHeight + 4;

      checkPageBreak(totalCardHeight + 3);

      // Outer Card Box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, y, contentWidth, totalCardHeight, 2, 2, "FD");

      // Badge Pill
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(margin + 3.5, y + 3.5, 22, 5.5, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`Actividad ${ex.number || idx + 1}`, margin + 4.5, y + 7.2);

      // Statement text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(statementLines, margin + 28, y + 7.2);

      let currentCursorY = y + 4 + statementHeight + 2;

      // Hint box if present
      if (hintLines.length > 0) {
        doc.setFillColor(254, 252, 232);
        doc.setDrawColor(254, 240, 138);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin + 4, currentCursorY, contentWidth - 8, hintHeight, 1, 1, "FD");

        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(161, 98, 7);
        doc.text(hintLines, margin + 7, currentCursorY + 3.8);

        currentCursorY += hintHeight + 2.5;
      }

      // Green Resolution Box
      doc.setFillColor(240, 253, 244); // Emerald 50
      doc.setDrawColor(134, 239, 172); // Emerald 300
      doc.setLineWidth(0.4);
      doc.roundedRect(margin + 4, currentCursorY, contentWidth - 8, solBoxInnerHeight, 1.5, 1.5, "FD");

      // Left green accent bar
      doc.setFillColor(22, 163, 74);
      doc.roundedRect(margin + 4, currentCursorY, 2.5, solBoxInnerHeight, 0.5, 0.5, "F");

      // Resolution Header (NO emojis to prevent encoding issues)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(20, 83, 45);
      doc.text("RESOLUCIÓN Y PROCEDIMIENTO PASO A PASO (DOCENTE):", margin + 9, currentCursorY + 4.5);

      // Step text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(solStepLines, margin + 9, currentCursorY + 8.5);

      // Final Answer Pill/Box inside Green Box
      const ansBoxY = currentCursorY + 8.5 + solStepHeight + 1.5;
      doc.setFillColor(220, 252, 231); // Emerald 100
      doc.setDrawColor(74, 222, 128); // Emerald 400
      doc.setLineWidth(0.3);
      doc.roundedRect(margin + 7, ansBoxY, contentWidth - 14, solAnsBoxHeight, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(21, 128, 61);
      doc.text(solAnsLines, margin + 10, ansBoxY + 3.8);

      y += totalCardHeight + 3.5;
    } else {
      // -------------------------------------------------------------
      // STUDENT CLEAN VERSION
      // -------------------------------------------------------------
      const workspaceHeight = 26; // Notebook grid + response line
      const totalCardHeight =
        5 + statementHeight + (hintHeight > 0 ? hintHeight + 2 : 0) + workspaceHeight + 3;

      checkPageBreak(totalCardHeight + 3);

      // Outer Card Box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, totalCardHeight, 2, 2, "FD");

      // Badge Pill
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(margin + 3.5, y + 3.5, 22, 5.5, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`Actividad ${ex.number || idx + 1}`, margin + 4.5, y + 7.2);

      // Statement text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(statementLines, margin + 28, y + 7.2);

      let currentCursorY = y + 4 + statementHeight + 2;

      // Hint box if present
      if (hintLines.length > 0) {
        doc.setFillColor(254, 252, 232);
        doc.setDrawColor(254, 240, 138);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin + 4, currentCursorY, contentWidth - 8, hintHeight, 1, 1, "FD");

        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(161, 98, 7);
        doc.text(hintLines, margin + 7, currentCursorY + 3.8);

        currentCursorY += hintHeight + 2.5;
      }

      // Work area inside exercise box (dotted notebook grid)
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.setLineDashPattern([1.5, 1.5], 0);
      doc.line(margin + 5, currentCursorY + 2, margin + contentWidth - 5, currentCursorY + 2);
      doc.line(margin + 5, currentCursorY + 7.5, margin + contentWidth - 5, currentCursorY + 7.5);
      doc.line(margin + 5, currentCursorY + 13, margin + contentWidth - 5, currentCursorY + 13);
      doc.line(margin + 5, currentCursorY + 18.5, margin + contentWidth - 5, currentCursorY + 18.5);
      doc.setLineDashPattern([], 0); // reset dash

      // Answer line & Self-assessment
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Respuesta / Justificación: ____________________________________", margin + 5, currentCursorY + 23.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("Autoevaluación: [  ] Fácil   [  ] Con dudas   [  ] A reforzar", pageWidth - margin - 5, currentCursorY + 23.5, {
        align: "right",
      });

      y += totalCardHeight + 3.5;
    }
  });

  // Footer / Teacher Signature Line
  checkPageBreak(20);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4.5;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    isTeacherVersion
      ? "Guía oficial de trabajo y corrección pedagógica para el apoyo escolar individualizado."
      : "¡Buen trabajo! Recuerda revisar cada paso con atención y fundamentar el procedimiento.",
    margin,
    y + 1.5
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Firma de la Docente: Prof. Patricia Morinigo", pageWidth - margin, y + 1.5, { align: "right" });

  // 6. Solucionario Completo y Tabla de Corrección (Docente)
  if (isTeacherVersion && exerciseList.length > 0) {
    doc.addPage();
    y = margin;
    drawMiniHeader();

    doc.setFillColor(30, 41, 59); // Slate Dark
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("TABLA DE CORRECCIÓN RÁPIDA Y GUÍA DIDÁCTICA", margin + 6, y + 7.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text(`Materia: ${cleanPDFText(worksheet.subject)} · Tema: ${cleanPDFText(worksheet.topic)}`, margin + 6, y + 13.5);
    doc.text(`Nivel: ${cleanPDFText(worksheet.level)}`, pageWidth - margin - 6, y + 13.5, { align: "right" });

    y += 23;

    // Tips for teacher
    if (worksheet.resolutionTipsForTeacher && worksheet.resolutionTipsForTeacher.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const tipItemsLines = worksheet.resolutionTipsForTeacher.map((tip) =>
        doc.splitTextToSize(`- ${cleanPDFText(tip)}`, contentWidth - 12)
      );
      const totalTipLines = tipItemsLines.reduce((acc, lines) => acc + lines.length, 0);
      const tipsBoxHeight = 8 + totalTipLines * 4.0 + (tipItemsLines.length - 1) * 1.5;

      checkPageBreak(tipsBoxHeight + 4);

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, tipsBoxHeight, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text("RECOMENDACIONES PEDAGÓGICAS DE CORRECCIÓN:", margin + 5, y + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      let tipCursorY = y + 9;
      tipItemsLines.forEach((lines) => {
        doc.text(lines, margin + 5, tipCursorY);
        tipCursorY += lines.length * 4.0 + 1.5;
      });

      y += tipsBoxHeight + 5;
    }

    // Quick Summary Table of All Results
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("CUADRO RESUMEN DE RESPUESTAS FINALES (PARA CORRECCIÓN RÁPIDA):", margin, y + 2);
    y += 5;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, 24, 6, "FD");
    doc.rect(margin + 24, y, contentWidth - 24, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text("Actividad", margin + 3, y + 4.2);
    doc.text("Respuesta / Resultado Esperado", margin + 27, y + 4.2);
    y += 6;

    exerciseList.forEach((ex, idx) => {
      const rawSol = ex.solution;
      let ansText = "Verificado.";
      if (typeof rawSol === "string") {
        ansText = cleanPDFText(rawSol);
      } else if (rawSol && typeof rawSol === "object") {
        ansText = cleanPDFText(
          (rawSol as any).answer || (rawSol as any).resultado || (rawSol as any).respuesta || ansText
        );
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const ansLines = doc.splitTextToSize(ansText, contentWidth - 30);
      const rowHeight = Math.max(6, ansLines.length * 4.0 + 2);

      checkPageBreak(rowHeight + 2);

      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, 24, rowHeight, "FD");
      doc.rect(margin + 24, y, contentWidth - 24, rowHeight, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(`Actividad ${ex.number || idx + 1}`, margin + 3, y + 4.2);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(21, 128, 61); // Emerald
      doc.text(ansLines, margin + 27, y + 4.2);

      y += rowHeight;
    });

    y += 6;

    // Next Suggested Topics
    if (worksheet.suggestedNextTopics && worksheet.suggestedNextTopics.length > 0) {
      const cleanTopics = worksheet.suggestedNextTopics.map((t) => cleanPDFText(t)).join(" · ");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const topicsLines = doc.splitTextToSize(cleanTopics, contentWidth - 10);
      const topicsBoxH = 8 + topicsLines.length * 4.0 + 2;

      checkPageBreak(topicsBoxH + 3);
      doc.setFillColor(239, 246, 255); // Blue 50
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(margin, y, contentWidth, topicsBoxH, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 64, 175);
      doc.text("CONTENIDOS SUGERIDOS PARA LA PRÓXIMA CLASE:", margin + 5, y + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(topicsLines, margin + 5, y + 9.5);
      y += topicsBoxH + 4;
    }
  }

  return doc;
}

export function generateSolvedProblemPDF(solved: SolvedProblemResult, studentName?: string): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const maxContentY = pageHeight - margin - 6;

  let y = margin;

  const drawMiniHeader = () => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Prof. Patricia Morinigo · ${cleanPDFText(solved.subject)} - ${cleanPDFText(solved.problemTitle)}`, margin, 9);
    doc.text(`Pág. ${doc.getNumberOfPages()}`, pageWidth - margin, 9, { align: "right" });
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, 11, pageWidth - margin, 11);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > maxContentY) {
      doc.addPage();
      y = 15;
      drawMiniHeader();
    }
  };

  // Header Banner
  doc.setFillColor(15, 118, 110); // Teal
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("GUÍA DE RESOLUCIÓN PASO A PASO", margin + 6, y + 7.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(204, 251, 241);
  doc.text(`Prof. Patricia Morinigo · ${cleanPDFText(solved.subject)} · ${cleanPDFText(solved.level)}`, margin + 6, y + 13.5);
  if (studentName) {
    doc.text(`Para: ${cleanPDFText(studentName)}`, pageWidth - margin - 6, y + 13.5, { align: "right" });
  }

  y += 24;

  // Problem statement box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  const origProblemText = cleanPDFText(solved.originalProblem || solved.problemTitle);
  const origLines = doc.splitTextToSize(origProblemText, contentWidth - 14);
  const origHeight = 10 + origLines.length * 4.6;

  checkPageBreak(origHeight + 4);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, origHeight, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 58, 138);
  doc.text("ENUNCIADO DEL EJERCICIO PLANTEADO:", margin + 5, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(origLines, margin + 5, y + 10);

  y += origHeight + 5;

  // Section Header
  checkPageBreak(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 118, 110);
  doc.text("RESOLUCIÓN PASO A PASO DIDÁCTICA", margin, y + 2);
  doc.setDrawColor(153, 246, 228);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 3.5, pageWidth - margin, y + 3.5);
  y += 7;

  // Step-by-step resolution
  solved.stepByStep.forEach((step) => {
    // Applied rule tag
    const ruleText = step.appliedRule ? `Regla / Ley: ${cleanPDFText(step.appliedRule)}` : "";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const ruleLines = ruleText ? doc.splitTextToSize(ruleText, contentWidth - 14) : [];
    const ruleH = ruleLines.length > 0 ? ruleLines.length * 3.8 + 1 : 0;

    // Math / Numerical Development
    const mathContent = cleanPDFText(step.mathDevelopment || step.detailOrFormula);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    const mathLines = mathContent ? doc.splitTextToSize(mathContent, contentWidth - 18) : [];
    const mathSubBoxH = mathLines.length > 0 ? 5 + mathLines.length * 4.2 : 0;

    // Explanation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const expLines = doc.splitTextToSize(cleanPDFText(step.explanation), contentWidth - 14);
    const expH = expLines.length * 4.0;

    // Tip
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    const tipText = step.practicalTip ? `Consejo didáctico: ${cleanPDFText(step.practicalTip)}` : "";
    const tipLines = tipText ? doc.splitTextToSize(tipText, contentWidth - 18) : [];
    const tipSubBoxH = tipLines.length > 0 ? 4 + tipLines.length * 3.8 : 0;

    const totalStepBoxH =
      7 +
      (ruleH > 0 ? ruleH + 2 : 0) +
      (mathSubBoxH > 0 ? mathSubBoxH + 2.5 : 0) +
      expH +
      (tipSubBoxH > 0 ? tipSubBoxH + 2.5 : 0) +
      3;

    checkPageBreak(totalStepBoxH + 3);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, totalStepBoxH, 1.5, 1.5, "FD");

    // Step Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Paso ${step.stepNumber}: ${cleanPDFText(step.title)}`, margin + 4, y + 5);

    let curY = y + 5 + 4.5;

    // Rule Tag
    if (ruleLines.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(79, 70, 229); // Indigo
      doc.text(ruleLines, margin + 4, curY);
      curY += ruleH + 2;
    }

    // Math/Numerical Development Box
    if (mathLines.length > 0) {
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin + 4, curY, contentWidth - 8, mathSubBoxH, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(mathLines, margin + 7, curY + 3.8);
      curY += mathSubBoxH + 2.5;
    }

    // Explanation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(expLines, margin + 4, curY);
    curY += expH + 1.5;

    // Tip if present
    if (tipLines.length > 0) {
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin + 4, curY, contentWidth - 8, tipSubBoxH, 1, 1, "FD");

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(146, 64, 14);
      doc.text(tipLines, margin + 7, curY + 3.5);
    }

    y += totalStepBoxH + 3.5;
  });

  // Final Answer Highlight Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const ansLines = doc.splitTextToSize(cleanPDFText(solved.finalAnswer), contentWidth - 14);
  const ansH = 9 + ansLines.length * 4.4;

  checkPageBreak(ansH + 4);
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, ansH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70);
  doc.text("RESPUESTA FINAL:", margin + 5, y + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(4, 120, 87);
  doc.text(ansLines, margin + 5, y + 10);
  y += ansH + 5;

  // Key Rule / Reinforcement Concept
  if (solved.reinforcementConcept) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const ruleLines = doc.splitTextToSize(cleanPDFText(solved.reinforcementConcept), contentWidth - 14);
    const ruleH = 9 + ruleLines.length * 4.2;

    checkPageBreak(ruleH + 4);
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(239, 68, 68);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, ruleH, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(153, 27, 27);
    doc.text("CONCEPTO CLAVE PARA REFORZAR:", margin + 5, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28);
    doc.text(ruleLines, margin + 5, y + 9.5);
    y += ruleH + 4;
  }

  return doc;
}

export function generateStudentReportPDF(
  student: Student,
  records: TopicRecord[],
  diagnosis?: StudentDiagnosis | null
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const maxContentY = pageHeight - margin - 6;

  let y = margin;

  const drawMiniHeader = () => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Informe Pedagógico · ${cleanPDFText(student.name)} · Prof. Patricia Morinigo`, margin, 9);
    doc.text(`Pág. ${doc.getNumberOfPages()}`, pageWidth - margin, 9, { align: "right" });
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, 11, pageWidth - margin, 11);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > maxContentY) {
      doc.addPage();
      y = 15;
      drawMiniHeader();
    }
  };

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("INFORME DE PROGRESO Y SEGUIMIENTO PEDAGÓGICO", margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text("Clases Particulares y Apoyo Escolar · Prof. Patricia Morinigo", margin + 6, y + 14.5);
  doc.text(`Emitido: ${new Date().toLocaleDateString("es-AR")}`, pageWidth - margin - 6, y + 14.5, {
    align: "right",
  });

  y += 26;

  // Student Profile Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Alumno/a: ${cleanPDFText(student.name)}`, margin + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Nivel/Grado: ${cleanPDFText(student.grade)} (${cleanPDFText(student.level)})`, margin + 5, y + 13);
  if (student.school) {
    doc.text(`Escuela: ${cleanPDFText(student.school)}`, margin + 5, y + 18.5);
  }

  const rightColX = margin + contentWidth / 2 + 5;
  if (student.parentName) {
    doc.text(`Familia / Tutor: ${cleanPDFText(student.parentName)}`, rightColX, y + 7);
  }
  doc.text(`Materias de apoyo: ${cleanPDFText(student.targetSubjects?.join(", ")) || "General"}`, rightColX, y + 13);
  if (student.phone) {
    doc.text(`Contacto WhatsApp: ${cleanPDFText(student.phone)}`, rightColX, y + 18.5);
  }

  y += 28;

  // Summary statistics bar
  const mastered = records.filter((r) => r.status === "afianzado").length;
  const inProgress = records.filter((r) => r.status === "en_proceso").length;
  const reinforcement = records.filter((r) => r.status === "requiere_refuerzo").length;
  const total = records.length;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text("RESUMEN DE CONTENIDOS TRABAJADOS:", margin, y);
  y += 4;

  const statWidth = (contentWidth - 6) / 3;
  // Box 1: Afianzados
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, y, statWidth, 14, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(6, 95, 70);
  doc.text(`${mastered} Afianzados`, margin + statWidth / 2, y + 6.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    `${total > 0 ? Math.round((mastered / total) * 100) : 0}% del total`,
    margin + statWidth / 2,
    y + 11,
    { align: "center" }
  );

  // Box 2: En Proceso
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin + statWidth + 3, y, statWidth, 14, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 64, 175);
  doc.text(`${inProgress} En Proceso`, margin + statWidth + 3 + statWidth / 2, y + 6.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    `${total > 0 ? Math.round((inProgress / total) * 100) : 0}% del total`,
    margin + statWidth + 3 + statWidth / 2,
    y + 11,
    { align: "center" }
  );

  // Box 3: Requiere Refuerzo
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + (statWidth + 3) * 2, y, statWidth, 14, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(153, 27, 27);
  doc.text(`${reinforcement} Por Reforzar`, margin + (statWidth + 3) * 2 + statWidth / 2, y + 6.5, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    `${total > 0 ? Math.round((reinforcement / total) * 100) : 0}% del total`,
    margin + (statWidth + 3) * 2 + statWidth / 2,
    y + 11,
    { align: "center" }
  );

  y += 19;

  // Diagnosis Section
  if (diagnosis) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const diagLines = doc.splitTextToSize(cleanPDFText(diagnosis.summary), contentWidth - 10);
    const diagBoxH = 10 + diagLines.length * 4.2;

    checkPageBreak(diagBoxH + 4);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, diagBoxH, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text("SÍNTESIS DEL DIAGNÓSTICO PEDAGÓGICO:", margin + 5, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(diagLines, margin + 5, y + 10);
    y += diagBoxH + 5;
  }

  // Topic Records Table
  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("HISTORIAL DE TEMAS EVALUADOS EN CLASE:", margin, y);
  y += 5;

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("Fecha", margin + 3, y + 4.5);
  doc.text("Materia / Tema", margin + 25, y + 4.5);
  doc.text("Estado", margin + 110, y + 4.5);
  doc.text("Observaciones del Docente", margin + 140, y + 4.5);
  y += 8;

  records.forEach((rec) => {
    const topicText = `${cleanPDFText(rec.subject)}: ${cleanPDFText(rec.topicTitle)}`;
    const topicLines = doc.splitTextToSize(topicText, 80);
    const notesText = cleanPDFText(rec.teacherNotes) || (rec.score ? `Nota: ${cleanPDFText(rec.score)}` : "-");
    const notesLines = doc.splitTextToSize(notesText, 38);
    const rowHeight = Math.max(7, Math.max(topicLines.length, notesLines.length) * 4.2 + 2);

    checkPageBreak(rowHeight + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(rec.date || "-", margin + 3, y + 3.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(topicLines, margin + 25, y + 3.5);

    // Status badge
    if (rec.status === "afianzado") {
      doc.setTextColor(5, 150, 105);
      doc.text("Afianzado", margin + 110, y + 3.5);
    } else if (rec.status === "en_proceso") {
      doc.setTextColor(37, 99, 235);
      doc.text("En Proceso", margin + 110, y + 3.5);
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text("A Reforzar", margin + 110, y + 3.5);
    }

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(notesLines, margin + 140, y + 3.5);

    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    y += rowHeight + 1;
  });

  return doc;
}
