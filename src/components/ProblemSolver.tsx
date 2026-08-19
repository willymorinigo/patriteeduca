import React, { useState } from "react";
import { 
  Subject, 
  EducationLevel, 
  SolvedProblemResult, 
  Student 
} from "../types";
import { 
  GraduationCap, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  Send, 
  Download, 
  Share2, 
  Lightbulb, 
  AlertCircle, 
  CheckCircle2, 
  PlusCircle, 
  Copy, 
  ArrowRight,
  Loader2,
  FileCheck2
} from "lucide-react";
import { generateSolvedProblemPDF } from "../utils/pdfGenerator";
import { getWhatsAppSolvedProblemMessage, openWhatsApp } from "../utils/whatsappHelper";

interface ProblemSolverProps {
  students: Student[];
  onGenerateSimilarWorksheet: (subject: Subject, topic: string, level: string, studentId?: string) => void;
  onLogTopicToStudent: (studentId: string, subject: Subject, topic: string, notes?: string) => void;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({
  students,
  onGenerateSimilarWorksheet,
  onLogTopicToStudent,
}) => {
  const [subject, setSubject] = useState<Subject>("Matemática");
  const [level, setLevel] = useState<EducationLevel>("Secundaria Básica (1° a 3° año)");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [problemText, setProblemText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [solvedResult, setSolvedResult] = useState<SolvedProblemResult | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [loggedNotification, setLoggedNotification] = useState<boolean>(false);

  const sampleProblems: { label: string; subject: Subject; level: EducationLevel; text: string }[] = [
    {
      label: "Ecuación con fracciones (Matemática)",
      subject: "Matemática",
      level: "Secundaria Básica (1° a 3° año)",
      text: "Resolver y verificar la siguiente ecuación: 2/3 (x - 1) + 1/2 = 3/4 x - 2",
    },
    {
      label: "Fracciones y decimales (Primaria)",
      subject: "Matemática",
      level: "Primaria (4° a 6° año)",
      text: "Juan compró 1 kilo y 3/4 de manzanas a $1.200 el kilo y 2 kilos y medio de naranjas a $800 el kilo. Si pagó con $5.000, ¿cuánto dinero le dieron de vuelto?",
    },
    {
      label: "Análisis Sintáctico (Lengua)",
      subject: "Prácticas del Lenguaje",
      level: "Secundaria Básica (1° a 3° año)",
      text: "Analizar sintácticamente la oración: 'Ayer por la tarde, los entusiastas alumnos de la profesora Patricia resolvieron los difíciles ejercicios de matemática con gran alegría.'",
    },
    {
      label: "Problema de MRU (Física)",
      subject: "Física",
      level: "Secundaria Básica (1° a 3° año)",
      text: "Un micro de larga distancia sale de Mar del Plata hacia La Plata a una velocidad constante de 90 km/h. Si la distancia es de 360 km y salió a las 08:30 hs, ¿a qué hora llegará a destino y cuántos metros recorre en cada segundo?",
    },
    {
      label: "Estructura de Lewis (Química)",
      subject: "Química",
      level: "Secundaria Superior (4° a 6° año)",
      text: "Explicar el tipo de unión química y graficar la estructura de Lewis para el Dióxido de Carbono (CO2) y para el Cloruro de Magnesio (MgCl2). Indicar si comparten o transfieren electrones.",
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!problemText.trim() && !imagePreview) {
      setError("Por favor escribe el ejercicio o sube una foto del enunciado.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoggedNotification(false);

    try {
      const selectedStudent = students.find((s) => s.id === selectedStudentId);
      const studentContext = selectedStudent
        ? `Alumno: ${selectedStudent.name}, Nivel: ${selectedStudent.grade}, Observaciones: ${selectedStudent.notes || "Ninguna"}`
        : undefined;

      const response = await fetch("/api/solve-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemText,
          subject,
          level,
          imageBase64: imagePreview,
          studentContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "No se pudo resolver el ejercicio.");
      }

      const data = await response.json();
      setSolvedResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al procesar el ejercicio. Verifica la conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!solvedResult) return;
    const selectedStudent = students.find((s) => s.id === selectedStudentId);
    const doc = generateSolvedProblemPDF(solvedResult, selectedStudent?.name);
    const filename = `Resolucion_${solvedResult.subject}_${Date.now()}.pdf`;
    doc.save(filename);
  };

  const handleSendWhatsApp = () => {
    if (!solvedResult) return;
    const selectedStudent = students.find((s) => s.id === selectedStudentId);
    const msg = getWhatsAppSolvedProblemMessage(solvedResult, selectedStudent?.name);
    // Also trigger PDF download so the teacher can attach it in WhatsApp
    handleDownloadPDF();
    openWhatsApp(selectedStudent?.phone, msg);
  };

  const handleCopySummary = () => {
    if (!solvedResult) return;
    const summary = `*Resolución: ${solvedResult.problemTitle}*\n\n` +
      `📌 *Materia:* ${solvedResult.subject} (${solvedResult.level})\n\n` +
      `✅ *Respuesta Final:* ${solvedResult.finalAnswer}\n\n` +
      `💡 *Tip Clave:* ${solvedResult.reinforcementConcept || solvedResult.pedagogicalTips[0]}`;
    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleQuickLog = () => {
    if (!solvedResult || !selectedStudentId) return;
    onLogTopicToStudent(
      selectedStudentId,
      solvedResult.subject,
      solvedResult.problemTitle,
      `Ejercicio resuelto en clase: ${solvedResult.finalAnswer}`
    );
    setLoggedNotification(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header Card with Professional Polish */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm ring-1 ring-slate-800">
            <GraduationCap className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Resolvelo Paso a Paso
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explicación clara como en el pizarrón, adaptada a los contenidos de PBA con tips para la docente y advertencia de errores comunes.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Asistente IA Gemini
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">1</span>
                Datos del Ejercicio
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Entrada</span>
            </div>

            {/* Materia y Nivel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Materia</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Matemática">📐 Matemática</option>
                  <option value="Prácticas del Lenguaje">📖 Prácticas del Lenguaje</option>
                  <option value="Física">⚡ Física</option>
                  <option value="Química">🧪 Química</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nivel Escolar</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as EducationLevel)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Primaria (1° a 3° año)">Primaria (1° a 3°)</option>
                  <option value="Primaria (4° a 6° año)">Primaria (4° a 6°)</option>
                  <option value="Secundaria Básica (1° a 3° año)">Secundaria Básica (1° a 3°)</option>
                  <option value="Secundaria Superior (4° a 6° año)">Secundaria Superior (4° a 6°)</option>
                </select>
              </div>
            </div>

            {/* Asignar Alumno (opcional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asignar a Alumno <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Sin alumno seleccionado (Uso general) --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.grade})
                  </option>
                ))}
              </select>
            </div>

            {/* Enunciado Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Enunciado del problema o ejercicio
                </label>
                {problemText && (
                  <button
                    onClick={() => setProblemText("")}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Borrar
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Ejemplo: 'Resolver y verificar la siguiente ecuación...'"
                className="w-full text-xs sm:text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-y placeholder:text-slate-400"
              />
            </div>

            {/* Adjuntar Foto del Ejercicio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                O adjuntar foto / captura del ejercicio
              </label>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-blue-200 bg-blue-50/50 p-2">
                  <img
                    src={imagePreview}
                    alt="Preview ejercicio"
                    className="max-h-40 w-auto mx-auto rounded-lg object-contain"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
                    title="Eliminar foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30 rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Subir foto de carpeta o fotocopia</span>
                  <span className="text-[11px] text-slate-400">JPG, PNG hasta 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSolve}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Desglosando pedagógicamente...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Resolvelo y Explicámelo Paso a Paso</span>
                </>
              )}
            </button>
          </div>

          {/* Ejemplos Rápidos */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Ejercicios de Prueba Rápida
              </span>
              <span className="text-[11px] text-slate-400">1 clic para cargar</span>
            </div>
            <div className="space-y-1.5">
              {sampleProblems.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSubject(sp.subject);
                    setLevel(sp.level);
                    setProblemText(sp.text);
                    setImagePreview(null);
                  }}
                  className="w-full text-left text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-750 font-medium transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{sp.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Output / Result */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px] shadow-xs">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                  <GraduationCap className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Analizando y resolviendo el ejercicio...
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Gemini está estructurando el paso a paso, redactando los tips didácticos y preparando advertencias de errores comunes.
                </p>
              </div>
            </div>
          ) : solvedResult ? (
            <div className="space-y-4">
              {/* Actions Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                    {solvedResult.subject} · {solvedResult.level}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1.5">
                    {solvedResult.problemTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs"
                    title="Descargar PDF imprimible"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={handleSendWhatsApp}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    title="Enviar a WhatsApp con mensaje y descargar PDF"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs"
                    title="Copiar resumen al portapapeles"
                  >
                    {copiedNotification ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Final Answer Highlight */}
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Respuesta Final
                  </span>
                  <span className="text-[11px] text-emerald-700/90 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-md">Resultado verificado</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-emerald-950 font-mono">
                  {solvedResult.finalAnswer}
                </p>
              </div>

              {/* Step by step card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                    Resolución Paso a Paso
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {solvedResult.stepByStep.length} pasos
                  </span>
                </div>

                <div className="space-y-3">
                  {solvedResult.stepByStep.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all space-y-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {step.title}
                        </h5>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 pl-8.5 leading-relaxed">
                        {step.explanation}
                      </p>

                      {step.detailOrFormula && (
                        <div className="ml-8.5 bg-blue-50/80 border border-blue-200/80 rounded-lg p-2.5 text-xs sm:text-sm font-mono text-blue-950 font-medium">
                          {step.detailOrFormula}
                        </div>
                      )}

                      {step.practicalTip && (
                        <div className="ml-8.5 text-xs text-amber-900 bg-amber-50 border border-amber-200/80 rounded-lg p-2.5 flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Tip pedagógico:</strong> {step.practicalTip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Golden Rule / Reinforcement Concept */}
              {solvedResult.reinforcementConcept && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    CONCEPTO DE ORO PARA FIJAR CON EL ALUMNO
                  </div>
                  <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                    {solvedResult.reinforcementConcept}
                  </p>
                </div>
              )}

              {/* Pedagogical Tips & Common Pitfalls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pedagogical Tips */}
                <div className="bg-white border border-amber-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
                  <h5 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 border-b border-amber-100 pb-2">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    Tips de la Profe Patricia
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {solvedResult.pedagogicalTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Pitfalls */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
                  <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <AlertCircle className="w-4 h-4 text-slate-600" />
                    Errores Frecuentes a Advertir
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {solvedResult.commonPitfalls.map((pit, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">×</span>
                        <span>{pit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="bg-[#0F172A] text-white border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="text-xs text-slate-300">
                  ¿Quieres practicar más este tema o registrarlo en el historial del alumno?
                </div>
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                  {selectedStudentId && (
                    <button
                      onClick={handleQuickLog}
                      disabled={loggedNotification}
                      className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      {loggedNotification ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">¡Registrado!</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                          <span>Guardar en Alumno</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      onGenerateSimilarWorksheet(
                        solvedResult.subject,
                        solvedResult.problemTitle,
                        solvedResult.level,
                        selectedStudentId || undefined
                      )
                    }
                    className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs ml-auto sm:ml-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Crear Ficha de Práctica Similar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[380px] shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400">
                <GraduationCap className="w-7 h-7 text-slate-400" />
              </div>
              <div className="max-w-sm">
                <h4 className="font-bold text-slate-800 text-sm">
                  Espacio de Resolución Paso a Paso
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Escribí el ejercicio o subí una foto de la carpeta/libro y hacé clic en <strong>"Resolvelo y Explicámelo Paso a Paso"</strong> para ver el desglose didáctico como en el pizarrón.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
