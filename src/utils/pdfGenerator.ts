import { jsPDF } from "jspdf";
import { Worksheet, SolvedProblemResult, Student, TopicRecord, StudentDiagnosis } from "../types";

export function generateWorksheetPDF(worksheet: Worksheet, options?: { includeSolutions?: boolean; versionLabel?: string }): jsPDF {
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
      `Prof. Patricia Morinigo · ${worksheet.subject} - ${worksheet.topic} (${isTeacherVersion ? "Versión Docente Resuelta" : "Versión Alumno"})`,
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
    doc.setFillColor(30, 41, 59); // Slate 800 Dark Navy for Teacher
  } else {
    doc.setFillColor(26, 86, 219); // Royal Blue for Student
  }
  doc.roundedRect(margin, y, contentWidth, 21, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(
    isTeacherVersion
      ? "CLASES PARTICULARES · GUÍA Y SOLUCIONARIO (DOCENTE RESUELTO)"
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

  // 2. Student & Meta Info Card (2-column safe box with line clamping)
  const colWidth = (contentWidth / 2) - 6;
  const studentText = `Alumno/a: ${worksheet.studentName || "___________________________________"}`;
  const subjectText = `Materia: ${worksheet.subject}`;
  const levelText = `Nivel: ${worksheet.level}`;
  const topicText = `Tema: ${worksheet.topic}`;

  const studentLines = doc.splitTextToSize(studentText, colWidth);
  const subjectLines = doc.splitTextToSize(subjectText, colWidth);
  const levelLines = doc.splitTextToSize(levelText, colWidth);
  const topicLines = doc.splitTextToSize(topicText, colWidth);

  const leftColHeight = 4 + studentLines.length * 4.2 + subjectLines.length * 4.2;
  const rightColHeight = 4 + levelLines.length * 4.2 + topicLines.length * 4.2;
  const metaBoxHeight = Math.max(17, Math.max(leftColHeight, rightColHeight) + 3);

  checkPageBreak(metaBoxHeight);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, metaBoxHeight, 1.5, 1.5, "FD");

  // Col 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(studentLines, margin + 4, y + 5.5);
  const subY = y + 5.5 + studentLines.length * 4.2;
  doc.setFont("helvetica", "normal");
  doc.text(subjectLines, margin + 4, subY);

  // Col 2
  const rightX = margin + (contentWidth / 2) + 2;
  doc.setFont("helvetica", "normal");
  doc.text(levelLines, rightX, y + 5.5);
  const topY = y + 5.5 + levelLines.length * 4.2;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(isTeacherVersion ? 15 : 30, isTeacherVersion ? 118 : 64, isTeacherVersion ? 110 : 175);
  doc.text(topicLines, rightX, topY);

  y += metaBoxHeight + 5;

  // 3. Worksheet Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(worksheet.title, contentWidth);
  checkPageBreak(titleLines.length * 5.5 + 4);
  doc.text(titleLines, margin, y + 1);
  y += titleLines.length * 5.5 + 3;

  // 4. Pedagogical Intro / Reminder Box (Visual Toolbox)
  if (worksheet.pedagogicalIntro) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const introLines = doc.splitTextToSize(worksheet.pedagogicalIntro, contentWidth - 14);
    const boxHeight = 11 + introLines.length * 4.2;

    checkPageBreak(boxHeight + 4);
    doc.setFillColor(254, 243, 199); // Warm Amber
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, "FD");

    // Left accent bar
    doc.setFillColor(217, 119, 6);
    doc.roundedRect(margin, y, 3, boxHeight, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14);
    doc.text("💡 CAJA DE HERRAMIENTAS & REGLA DE ORO DIDÁCTICA:", margin + 6, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 53, 15);
    doc.text(introLines, margin + 6, y + 10.5);

    y += boxHeight + 5;
  }

  // 5. Exercises Section Header
  checkPageBreak(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(isTeacherVersion ? 30 : 30, isTeacherVersion ? 41 : 64, isTeacherVersion ? 59 : 175);
  doc.text(
    isTeacherVersion
      ? "ACTIVIDADES CON RESOLUCIÓN DETALLADA Y RESPUESTAS (DOCENTE)"
      : "ACTIVIDADES DE PRÁCTICA INDIVIDUAL",
    margin,
    y + 2
  );
  doc.setDrawColor(isTeacherVersion ? 148 : 191, isTeacherVersion ? 163 : 219, isTeacherVersion ? 184 : 254);
  doc.setLineWidth(0.6);
  doc.line(margin, y + 3.5, pageWidth - margin, y + 3.5);
  y += 7;

  // Ensure exercises array exists
  const exerciseList = worksheet.exercises && worksheet.exercises.length > 0 ? worksheet.exercises : [];

  if (exerciseList.length === 0) {
    checkPageBreak(20);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 16, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("No se registraron ejercicios adicionales para esta ficha.", margin + 6, y + 9);
    y += 20;
  }

  exerciseList.forEach((ex, idx) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const statementLines = doc.splitTextToSize(
      `${ex.statement}`,
      contentWidth - 20
    );

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const hintLines = ex.hint ? doc.splitTextToSize(`Pista didáctica: ${ex.hint}`, contentWidth - 16) : [];

    const statementHeight = statementLines.length * 4.4;
    const hintHeight = hintLines.length > 0 ? hintLines.length * 3.8 + 2 : 0;

    if (isTeacherVersion) {
      // -------------------------------------------------------------
      // TEACHER RESOLVED VERSION: Renders Step-by-Step & Final Answer
      // -------------------------------------------------------------
      const rawSol = ex.solution;
      let stepText = "Aplicar procedimiento analítico paso a paso conforme a lo explicado.";
      let ansText = "Resultado comprobado.";

      if (typeof rawSol === "string") {
        ansText = rawSol;
        stepText = rawSol;
      } else if (rawSol && typeof rawSol === "object") {
        stepText = (rawSol as any).stepSummary || (rawSol as any).procedimiento || (rawSol as any).pasos || (rawSol as any).explicacion || stepText;
        ansText = (rawSol as any).answer || (rawSol as any).resultado || (rawSol as any).respuesta || ansText;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const solStepLines = doc.splitTextToSize(`Procedimiento: ${stepText}`, contentWidth - 16);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      const solAnsLines = doc.splitTextToSize(`✅ RESPUESTA FINAL: ${ansText}`, contentWidth - 18);

      const solBoxInnerHeight = 8 + solStepLines.length * 3.9 + solAnsLines.length * 4.2 + 4;
      const boxInnerHeight = 9 + statementHeight + hintHeight + solBoxInnerHeight + 3;

      checkPageBreak(boxInnerHeight + 3);

      // Exercise Container Box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, y, contentWidth, boxInnerHeight, 2, 2, "FD");

      // Exercise Badge Pill (Docente Resuelta)
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(margin + 3.5, y + 3.5, 24, 5.5, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`Actividad ${ex.number || idx + 1}`, margin + 4.5, y + 7.2);

      // Statement Text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(statementLines, margin + 30, y + 7.5);
      let curY = y + 7.5 + statementHeight;

      // Hint Box (Light Amber)
      if (hintLines.length > 0) {
        curY += 1.5;
        doc.setFillColor(254, 252, 232);
        doc.setDrawColor(254, 240, 138);
        doc.roundedRect(margin + 5, curY, contentWidth - 10, hintHeight + 2, 1, 1, "FD");

        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(161, 98, 7);
        doc.text(hintLines, margin + 8, curY + 3.5);
        curY += hintHeight + 3.5;
      }

      // Teacher Resolution Box (Emerald/Soft Mint)
      curY += 1.5;
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(134, 239, 172);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin + 5, curY, contentWidth - 10, solBoxInnerHeight, 1.5, 1.5, "FD");

      // Left green accent
      doc.setFillColor(22, 163, 74);
      doc.roundedRect(margin + 5, curY, 2.5, solBoxInnerHeight, 0.5, 0.5, "F");

      // Resolution title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(20, 83, 45);
      doc.text("📝 RESOLUCIÓN Y PROCEDIMIENTO PASO A PASO (DOCENTE):", margin + 10, curY + 4.5);

      // Step text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(solStepLines, margin + 10, curY + 9);

      // Final Answer Pill/Box
      const ansBoxY = curY + 9 + solStepLines.length * 3.9;
      doc.setFillColor(220, 252, 231);
      doc.setDrawColor(74, 222, 128);
      doc.roundedRect(margin + 8, ansBoxY - 0.5, contentWidth - 16, solAnsLines.length * 4.2 + 2, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(21, 128, 61);
      doc.text(solAnsLines, margin + 11, ansBoxY + 3.5);

      y += boxInnerHeight + 3.5;
    } else {
      // -------------------------------------------------------------
      // STUDENT CLEAN VERSION: Renders Notebook Space & Autoevaluation
      // -------------------------------------------------------------
      const workspaceHeight = 28; // Notebook grid + answer area
      const boxInnerHeight = 7 + statementHeight + hintHeight + workspaceHeight + 4;

      checkPageBreak(boxInnerHeight + 3);

      // Exercise Container Box with subtle shadow border
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, boxInnerHeight, 2, 2, "FD");

      // Exercise Badge Pill
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(margin + 3.5, y + 3.5, 22, 5.5, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`Actividad ${ex.number || idx + 1}`, margin + 5, y + 7.2);

      // Statement Text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(statementLines, margin + 28, y + 7.5);
      let curY = y + 7.5 + statementHeight;

      // Hint Box (Light Amber)
      if (hintLines.length > 0) {
        curY += 1.5;
        doc.setFillColor(254, 252, 232);
        doc.setDrawColor(254, 240, 138);
        doc.roundedRect(margin + 5, curY, contentWidth - 10, hintHeight + 2, 1, 1, "FD");

        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(161, 98, 7);
        doc.text(hintLines, margin + 8, curY + 3.5);
        curY += hintHeight + 3.5;
      }

      // Work area inside exercise box (notebook style grid)
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.setLineDashPattern([1.5, 1.5], 0);
      doc.line(margin + 5, curY + 3, margin + contentWidth - 5, curY + 3);
      doc.line(margin + 5, curY + 9, margin + contentWidth - 5, curY + 9);
      doc.line(margin + 5, curY + 15, margin + contentWidth - 5, curY + 15);
      doc.line(margin + 5, curY + 21, margin + contentWidth - 5, curY + 21);
      doc.setLineDashPattern([], 0); // reset

      // Answer badge & Self-assessment Traffic Light
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Respuesta / Justificación: ____________________________________", margin + 5, curY + 26);

      // Self-assessment chips for student
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("Autoevaluación: [  ] Fácil   [  ] Con dudas   [  ] A reforzar", pageWidth - margin - 6, curY + 26, { align: "right" });

      y += boxInnerHeight + 3.5;
    }
  });

  // Footer / Teacher Signature Line
  checkPageBreak(22);
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
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("TABLA DE CORRECCIÓN RÁPIDA Y GUÍA DIDÁCTICA", margin + 6, y + 7.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text(`Materia: ${worksheet.subject} · Tema: ${worksheet.topic}`, margin + 6, y + 13.5);
    doc.text(`Nivel: ${worksheet.level}`, pageWidth - margin - 6, y + 13.5, { align: "right" });

    y += 23;

    // Tips for teacher (calculate exact wrapped height)
    if (worksheet.resolutionTipsForTeacher && worksheet.resolutionTipsForTeacher.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const tipItemsLines = worksheet.resolutionTipsForTeacher.map((tip) =>
        doc.splitTextToSize(`• ${tip}`, contentWidth - 12)
      );
      const totalTipLines = tipItemsLines.reduce((acc, lines) => acc + lines.length, 0);
      const tipsBoxHeight = 8 + totalTipLines * 4.2 + (tipItemsLines.length - 1) * 1.5;

      checkPageBreak(tipsBoxHeight + 4);

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, tipsBoxHeight, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text("💡 Recomendaciones pedagógicas de corrección en clase:", margin + 5, y + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      let tipCursorY = y + 9.5;
      tipItemsLines.forEach((lines) => {
        doc.text(lines, margin + 5, tipCursorY);
        tipCursorY += lines.length * 4.2 + 1.5;
      });

      y += tipsBoxHeight + 5;
    }

    // Quick Summary Table of All Results
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("📋 Cuadro Resumen de Respuestas Finales (Para corrección rápida):", margin, y + 2);
    y += 5;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, 22, 6, "FD");
    doc.rect(margin + 22, y, contentWidth - 22, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text("Actividad", margin + 3, y + 4.2);
    doc.text("Respuesta / Resultado Esperado", margin + 25, y + 4.2);
    y += 6;

    exerciseList.forEach((ex, idx) => {
      const rawSol = ex.solution;
      let ansText = "Verificado.";
      if (typeof rawSol === "string") {
        ansText = rawSol;
      } else if (rawSol && typeof rawSol === "object") {
        ansText = (rawSol as any).answer || (rawSol as any).resultado || (rawSol as any).respuesta || ansText;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const ansLines = doc.splitTextToSize(ansText, contentWidth - 28);
      const rowHeight = Math.max(6, ansLines.length * 4.2 + 2);

      checkPageBreak(rowHeight + 2);

      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, 22, rowHeight, "FD");
      doc.rect(margin + 22, y, contentWidth - 22, rowHeight, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(`Actividad ${ex.number || idx + 1}`, margin + 3, y + 4.2);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(21, 128, 61); // Emerald
      doc.text(ansLines, margin + 25, y + 4.2);

      y += rowHeight;
    });

    y += 6;

    // Next Suggested Topics
    if (worksheet.suggestedNextTopics && worksheet.suggestedNextTopics.length > 0) {
      checkPageBreak(22);
      doc.setFillColor(239, 246, 255); // Blue 50
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(margin, y, contentWidth, 16, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 64, 175);
      doc.text("🎯 Contenidos sugeridos para afianzar en la próxima clase:", margin + 5, y + 5.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(worksheet.suggestedNextTopics.join(" · "), margin + 5, y + 11);
      y += 20;
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
    doc.text(`Prof. Patricia Morinigo · ${solved.subject} - ${solved.problemTitle}`, margin, 9);
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
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("GUÍA DE RESOLUCIÓN PASO A PASO", margin + 6, y + 7.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(204, 251, 241);
  doc.text(`Prof. Patricia Morinigo · ${solved.subject} · ${solved.level}`, margin + 6, y + 13.5);
  if (studentName) {
    doc.text(`Para: ${studentName}`, pageWidth - margin - 6, y + 13.5, { align: "right" });
  }

  y += 24;

  // Problem statement box (Enlarged and highlighted)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const origLines = doc.splitTextToSize(solved.originalProblem || solved.problemTitle, contentWidth - 14);
  const origHeight = 11 + origLines.length * 4.8;

  checkPageBreak(origHeight + 4);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, origHeight, 1.8, 1.8, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text("ENUNCIADO DEL EJERCICIO PLANTEADO:", margin + 5, y + 5.5);

  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(origLines, margin + 5, y + 10.5);

  y += origHeight + 5;

  // Section Header
  checkPageBreak(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 118, 110);
  doc.text("RESOLUCIÓN PASO A PASO DIDÁCTICA", margin, y + 2);
  doc.setDrawColor(153, 246, 228);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 3.5, pageWidth - margin, y + 3.5);
  y += 7;

  // Step-by-step resolution
  solved.stepByStep.forEach((step) => {
    // Applied rule tag if present
    const ruleText = step.appliedRule ? `Regla/Ley: ${step.appliedRule}` : "";
    const ruleLines = ruleText ? doc.splitTextToSize(ruleText, contentWidth - 14) : [];

    // Math / Numerical Development
    const mathContent = step.mathDevelopment || step.detailOrFormula;
    const mathLines = mathContent ? doc.splitTextToSize(mathContent, contentWidth - 16) : [];

    // Explanation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const expLines = doc.splitTextToSize(step.explanation, contentWidth - 14);

    // Tip
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const tipLines = step.practicalTip ? doc.splitTextToSize(`💡 Tip: ${step.practicalTip}`, contentWidth - 16) : [];

    const ruleHeight = ruleLines.length > 0 ? 3 + ruleLines.length * 4 : 0;
    const mathHeight = mathLines.length > 0 ? 6 + mathLines.length * 4.2 : 0;
    const expHeight = expLines.length * 4.2;
    const tipHeight = tipLines.length > 0 ? 5 + tipLines.length * 3.8 : 0;

    const totalStepBoxH = 8 + ruleHeight + mathHeight + expHeight + tipHeight + 4;

    checkPageBreak(totalStepBoxH + 3);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, totalStepBoxH, 1.5, 1.5, "FD");

    // Step Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Paso ${step.stepNumber}: ${step.title}`, margin + 4, y + 5);
    let curY = y + 5 + 4.5;

    // Rule Tag
    if (ruleLines.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(79, 70, 229); // Indigo
      doc.text(ruleLines, margin + 4, curY);
      curY += ruleHeight + 1;
    }

    // Math/Numerical Development Box (Left / Primary block)
    if (mathLines.length > 0) {
      curY += 1;
      const subBoxH = 4 + mathLines.length * 4.2;
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin + 4, curY, contentWidth - 8, subBoxH, 1, 1, "FD");

      doc.setFont("courier", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(mathLines, margin + 7, curY + 3.8);
      curY += subBoxH + 2.5;
    }

    // Explanation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(expLines, margin + 4, curY);
    curY += expHeight;

    // Tip if present
    if (tipLines.length > 0) {
      curY += 2;
      const tipBoxH = 3.5 + tipLines.length * 3.8;
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(margin + 4, curY, contentWidth - 8, tipBoxH, 1, 1, "FD");

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(146, 64, 14);
      doc.text(tipLines, margin + 6, curY + 3.5);
    }

    y += totalStepBoxH + 3.5;
  });

  // Final Answer Highlight Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  const ansLines = doc.splitTextToSize(solved.finalAnswer, contentWidth - 12);
  const ansH = 9 + ansLines.length * 4.6;

  checkPageBreak(ansH + 4);
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, ansH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(6, 95, 70);
  doc.text("RESPUESTA FINAL:", margin + 5, y + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(4, 120, 87);
  doc.text(ansLines, margin + 5, y + 10);
  y += ansH + 5;

  // Key Rule / Reinforcement Concept
  if (solved.reinforcementConcept) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const ruleLines = doc.splitTextToSize(solved.reinforcementConcept, contentWidth - 12);
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
    doc.text(`Informe Pedagógico · ${student.name} · Prof. Patricia Morinigo`, margin, 9);
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
  doc.setFontSize(13);
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
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Alumno/a: ${student.name}`, margin + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Nivel/Grado: ${student.grade} (${student.level})`, margin + 5, y + 13);
  if (student.school) {
    doc.text(`Escuela: ${student.school}`, margin + 5, y + 18.5);
  }

  const rightColX = margin + contentWidth / 2 + 5;
  if (student.parentName) {
    doc.text(`Familia / Tutor: ${student.parentName}`, rightColX, y + 7);
  }
  doc.text(`Materias de apoyo: ${student.targetSubjects?.join(", ") || "General"}`, rightColX, y + 13);
  if (student.phone) {
    doc.text(`Contacto WhatsApp: ${student.phone}`, rightColX, y + 18.5);
  }

  y += 28;

  // Summary statistics bar
  const mastered = records.filter((r) => r.status === "afianzado").length;
  const inProgress = records.filter((r) => r.status === "en_proceso").length;
  const reinforcement = records.filter((r) => r.status === "requiere_refuerzo").length;
  const total = records.length;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("RESUMEN DE CONTENIDOS TRABAJADOS:", margin, y);
  y += 4;

  const statWidth = (contentWidth - 6) / 3;
  // Box 1: Afianzados
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, y, statWidth, 14, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(6, 95, 70);
  doc.text(`${mastered} Afianzados`, margin + statWidth / 2, y + 6.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(`${total > 0 ? Math.round((mastered / total) * 100) : 0}% del total`, margin + statWidth / 2, y + 11, { align: "center" });

  // Box 2: En Proceso
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin + statWidth + 3, y, statWidth, 14, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text(`${inProgress} En Proceso`, margin + statWidth + 3 + statWidth / 2, y + 6.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(`${total > 0 ? Math.round((inProgress / total) * 100) : 0}% del total`, margin + statWidth + 3 + statWidth / 2, y + 11, { align: "center" });

  // Box 3: Requiere Refuerzo
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + (statWidth + 3) * 2, y, statWidth, 14, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(153, 27, 27);
  doc.text(`${reinforcement} Por Reforzar`, margin + (statWidth + 3) * 2 + statWidth / 2, y + 6.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(`${total > 0 ? Math.round((reinforcement / total) * 100) : 0}% del total`, margin + (statWidth + 3) * 2 + statWidth / 2, y + 11, { align: "center" });

  y += 19;

  // AI or Pedagogical Diagnosis Section
  if (diagnosis) {
    checkPageBreak(35);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 8, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text("SÍNTESIS DEL DIAGNÓSTICO PEDAGÓGICO", margin + 4, y + 5.5);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const diagLines = doc.splitTextToSize(diagnosis.summary, contentWidth - 4);
    checkPageBreak(diagLines.length * 4.2 + 6);
    doc.text(diagLines, margin + 2, y);
    y += diagLines.length * 4.2 + 5;
  }

  // Topic Records Table / List
  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
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
    const topicText = `${rec.subject}: ${rec.topicTitle}`;
    const topicLines = doc.splitTextToSize(topicText, 80);
    const notesText = rec.teacherNotes || (rec.score ? `Nota: ${rec.score}` : "-");
    const notesLines = doc.splitTextToSize(notesText, 40);
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

