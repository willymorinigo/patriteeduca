import { Worksheet, SolvedProblemResult, StudentDiagnosis } from "../types";

export function getWhatsAppWorksheetMessage(worksheet: Worksheet, studentName?: string): string {
  const name = studentName || worksheet.studentName || "Familia / Estudiante";
  
  const text = `¡Hola ${name}! 👋
Te saluda la *Prof. Patricia Morinigo* 👩‍🏫

📚 Te comparto la nueva *Ficha de Práctica de ${worksheet.subject}*:
📌 *Tema:* ${worksheet.topic} (${worksheet.level})
🎯 *Nivel:* ${worksheet.difficulty} · ${worksheet.exercises.length} actividades

💡 *Consejo de la Profe antes de arrancar:*
"${worksheet.pedagogicalIntro ? worksheet.pedagogicalIntro.substring(0, 180) + '...' : 'Lee atentamente cada enunciado y recuerda plantear los pasos con prolijidad.'}"

📄 *(He descargado y adjunto el archivo PDF con los ejercicios con espacio para resolver y la guía de autocorrección)*.

¡Cualquier duda que surja durante la resolución me puedes escribir! ✨💪`;

  return text;
}

export function getWhatsAppSolvedProblemMessage(solved: SolvedProblemResult, studentName?: string): string {
  const name = studentName || "Familia / Estudiante";
  
  const text = `¡Hola ${name}! 👩‍🏫
Te saluda la *Prof. Patricia Morinigo*.

Acá te envío la *Resolución didáctica paso a paso* que armamos:
📌 *Materia:* ${solved.subject}
🎯 *Ejercicio:* ${solved.problemTitle}

✅ *Respuesta final:*
👉 ${solved.finalAnswer}

🔑 *Tip de oro para recordar:*
${solved.reinforcementConcept || solved.pedagogicalTips?.[0] || 'Revisar siempre las operaciones y unidades.'}

*(Adjunto también el PDF con la explicación completa y consejos pedagógicos).* 📄✨`;

  return text;
}

export function getWhatsAppDiagnosisMessage(diagnosis: StudentDiagnosis, parentName?: string): string {
  const greeting = parentName ? `Estimada familia de ${diagnosis.studentName}` : `Hola ${diagnosis.studentName}`;
  
  const urgentList = diagnosis.urgentReinforcementTopics
    .map((t) => `• ⚠️ *${t.subject} - ${t.topic}:* ${t.recommendedAction}`)
    .join("\n");

  const text = `¡Hola! ${greeting} 👋
Les escribe la *Prof. Patricia Morinigo* con el informe pedagógico de seguimiento.

📊 *Resumen de progreso:*
${diagnosis.summary}

🎯 *Temas prioritarios para reforzar en las próximas clases:*
${urgentList || '• Continuar afianzando la práctica general.'}

🌟 *Fortalezas destacadas:*
${diagnosis.strengths.map((s) => `• ✨ ${s}`).join("\n")}

${diagnosis.parentFeedbackMessage ? `\n💬 *Mensaje de la Profe:* ${diagnosis.parentFeedbackMessage}` : ""}

¡Seguimos trabajando juntos para alcanzar los mejores resultados! 🚀`;

  return text;
}

export function getWhatsAppClassReminderMessage(studentName: string, schedule?: string): string {
  return `¡Hola! 👋 Te escribe la *Prof. Patricia Morinigo*.
  
⏰ Te recuerdo nuestra próxima clase particular${schedule ? ` (${schedule})` : ""}.
📚 Recordá tener a mano la carpeta, la cartuchera y las guías de ejercicios para aprovechar la clase al máximo.

¡Nos vemos pronto! ✨`;
}

export function getWhatsAppHomeworkReminderMessage(studentName: string, subject: string, topic: string): string {
  return `¡Hola ${studentName}! 👋 Te saluda la *Prof. Patricia Morinigo*.

📝 Te paso un recordatorio de las actividades de práctica de *${subject}* sobre *${topic}* que quedaron para afianzar antes del próximo encuentro.

Cualquier consulta puntual que tengas mientras resolvés, avisame. ¡Muchos éxitos! 💪`;
}

export function openWhatsApp(phone?: string, text?: string) {
  const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
  const encoded = encodeURIComponent(text || "");
  
  let url = "";
  if (cleanPhone) {
    url = `https://wa.me/${cleanPhone}?text=${encoded}`;
  } else {
    url = `https://wa.me/?text=${encoded}`;
  }
  
  window.open(url, "_blank");
}
