import React, { useState } from "react";
import { Subject, CurriculumTopicItem, Student, Worksheet } from "../types";
import { CURRICULUM_TOPICS_PBA } from "../data/curriculumData";
import { 
  BookOpen, 
  Search, 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  X, 
  CheckCircle2, 
  HelpCircle,
  Bookmark,
  Download,
  Share2,
  FileText,
  UserCheck,
  Eye,
  Copy,
  Check
} from "lucide-react";
import { VisualConceptBoard } from "./VisualConceptBoard";
import { generateWorksheetPDF } from "../utils/pdfGenerator";
import { getWhatsAppWorksheetMessage, openWhatsApp } from "../utils/whatsappHelper";

interface CurriculumLibraryProps {
  students?: Student[];
  onGenerateWorksheetForTopic: (subject: Subject, topic: string, level: string, studentId?: string) => void;
  onAssignWorksheetToStudent?: (studentId: string, worksheet: Worksheet) => void;
}

export const CurriculumLibrary: React.FC<CurriculumLibraryProps> = ({
  students = [],
  onGenerateWorksheetForTopic,
  onAssignWorksheetToStudent,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedLevelCategory, setSelectedLevelCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Quick concept explainer modal state
  const [explainingTopic, setExplainingTopic] = useState<CurriculumTopicItem | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explanationResult, setExplanationResult] = useState<any | null>(null);
  const [copiedExplanation, setCopiedExplanation] = useState<boolean>(false);

  // Quick PDF Generator Modal State
  const [pdfModalTopic, setPdfModalTopic] = useState<CurriculumTopicItem | null>(null);
  const [pdfStudentId, setPdfStudentId] = useState<string>("");
  const [pdfDifficulty, setPdfDifficulty] = useState<string>("Intermedio");
  const [pdfExerciseCount, setPdfExerciseCount] = useState<number>(5);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [generatedQuickWorksheet, setGeneratedQuickWorksheet] = useState<Worksheet | null>(null);
  const [assignedSuccess, setAssignedSuccess] = useState<boolean>(false);

  const filteredTopics = CURRICULUM_TOPICS_PBA.filter((item) => {
    const matchesSub = selectedSubject === "all" || item.subject === selectedSubject;
    const matchesLevel = selectedLevelCategory === "all" || item.levelCategory === selectedLevelCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyRule.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSub && matchesLevel && matchesSearch;
  });

  const handleExplainConcept = async (topic: CurriculumTopicItem) => {
    setExplainingTopic(topic);
    setIsExplaining(true);
    setExplanationResult(null);
    setCopiedExplanation(false);

    try {
      const response = await fetch("/api/explain-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: topic.subject,
          topic: topic.title,
          level: topic.gradeName,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la explicación.");
      }

      const data = await response.json();
      setExplanationResult(data);
    } catch (err: any) {
      console.error(err);
      // Fallback with topic item data
      setExplanationResult({
        conceptTitle: topic.title,
        simpleDefinition: topic.summary,
        everydayAnalogy: "Como en una receta de cocina, respetar el orden de los pasos garantiza el resultado exacto.",
        goldenRule: topic.keyRule,
        practicalExample: {
          statement: topic.exampleProblem,
          stepByStepSolution: "1. Identificar datos -> 2. Plantear regla o fórmula -> 3. Operar -> 4. Verificar.",
        },
        teacherTips: [topic.teacherTip],
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const handleCopyExplanationWhatsApp = () => {
    if (!explainingTopic || !explanationResult) return;
    const text = `💡 *Tip Didáctico de Aula Maestra Patricia*\n📚 *Materia:* ${explainingTopic.subject} (${explainingTopic.gradeName})\n🎯 *Tema:* ${explainingTopic.title}\n\n📝 *En pocas palabras:* ${explanationResult.simpleDefinition}\n\n🌟 *Regla de Oro:* ${explanationResult.goldenRule || explainingTopic.keyRule}\n\n🚗 *Analogía cotidiana:* "${explanationResult.everydayAnalogy || 'Práctica guiada en clase'}"\n\n📌 *Ejemplo:* ${explanationResult.practicalExample?.statement || explainingTopic.exampleProblem}\n\n_Clases de Apoyo Escolar - Prof. Patricia Morinigo_`;
    navigator.clipboard.writeText(text);
    setCopiedExplanation(true);
    setTimeout(() => setCopiedExplanation(false), 2500);
  };

  const handleOpenQuickPDFModal = (topic: CurriculumTopicItem) => {
    setPdfModalTopic(topic);
    setPdfStudentId("");
    setPdfDifficulty("Intermedio");
    setPdfExerciseCount(5);
    setGeneratedQuickWorksheet(null);
    setAssignedSuccess(false);
  };

  const handleGenerateQuickPDF = async () => {
    if (!pdfModalTopic) return;
    setIsGeneratingPDF(true);
    setAssignedSuccess(false);

    try {
      const student = students.find((s) => s.id === pdfStudentId);
      const studentName = student ? student.name : undefined;

      const response = await fetch("/api/generate-worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: pdfModalTopic.subject,
          topic: pdfModalTopic.title,
          level: pdfModalTopic.gradeName,
          difficulty: pdfDifficulty,
          exerciseCount: pdfExerciseCount,
          studentName,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo generar la ficha didáctica.");
      }

      const data: Worksheet = await response.json();
      if (pdfStudentId) {
        data.studentId = pdfStudentId;
      }
      setGeneratedQuickWorksheet(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al generar la ficha didáctica con IA.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadStudentPDF = (ws: Worksheet) => {
    const doc = generateWorksheetPDF(ws, { includeSolutions: false });
    const cleanTopic = (ws.topic || "practica").replace(/[^a-zA-Z0-9]/g, "_");
    const studentTag = ws.studentName ? `_${ws.studentName.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    doc.save(`Ficha_${ws.subject}_${cleanTopic}${studentTag}_ALUMNO.pdf`);
  };

  const handleDownloadTeacherPDF = (ws: Worksheet) => {
    const doc = generateWorksheetPDF(ws, { includeSolutions: true });
    const cleanTopic = (ws.topic || "practica").replace(/[^a-zA-Z0-9]/g, "_");
    const studentTag = ws.studentName ? `_${ws.studentName.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    doc.save(`Ficha_${ws.subject}_${cleanTopic}${studentTag}_DOCENTE_CON_RESPUESTAS.pdf`);
  };

  const handleAssignQuickWorksheet = () => {
    if (!generatedQuickWorksheet || !pdfStudentId || !onAssignWorksheetToStudent) return;
    onAssignWorksheetToStudent(pdfStudentId, generatedQuickWorksheet);
    setAssignedSuccess(true);
    setTimeout(() => setAssignedSuccess(false), 3000);
  };

  const handleShareWorksheetWhatsApp = () => {
    if (!generatedQuickWorksheet) return;
    const student = students.find((s) => s.id === pdfStudentId);
    const msg = getWhatsAppWorksheetMessage(
      generatedQuickWorksheet,
      student?.name
    );
    openWhatsApp(student?.phone, msg);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm ring-1 ring-slate-800">
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Biblioteca Curricular PBA & Tips Didácticos
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Guía didáctica de conceptos clave para la Provincia de Buenos Aires con <strong>pizarras visuales interactivas</strong>, analogías cotidianas argentinas y fichas PDF para Alumno y Docente.
            </p>
          </div>
        </div>
        <span className="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3.5 py-1.5 rounded-xl font-bold shadow-2xs">
          Diseño Curricular Bonaerense
        </span>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar tema, regla de oro o concepto curricular..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="all">Todas las Materias</option>
              <option value="Matemática">📐 Matemática</option>
              <option value="Prácticas del Lenguaje">📖 Prácticas del Lenguaje</option>
              <option value="Física">⚡ Física</option>
              <option value="Química">🧪 Química</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedLevelCategory}
              onChange={(e) => setSelectedLevelCategory(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="all">Todos los Niveles</option>
              <option value="Primaria">Solo Primaria (1° a 6°)</option>
              <option value="Secundaria">Solo Secundaria (1° a 6°)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header: Subject badge and grade */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg">
                  {item.subject}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {item.gradeName}
                </span>
              </div>

              {/* Title and summary */}
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Golden Rule Box */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 text-xs space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                  Regla de Oro Didáctica:
                </span>
                <p className="text-amber-950 font-medium leading-relaxed">
                  {item.keyRule}
                </p>
              </div>

              {/* Teacher tip */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Tip Pedagógico de Patricia:
                </span>
                <p className="text-slate-650 italic">
                  "{item.teacherTip}"
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleExplainConcept(item)}
                className="bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Explicación Gráfica IA</span>
              </button>

              <button
                onClick={() => handleOpenQuickPDFModal(item)}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generar Ficha PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EXPLICACIÓN DIDÁCTICA CON PIZARRA GRÁFICA INTERACTIVA */}
      {/* ========================================================================= */}
      {explainingTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {explainingTopic.subject} · {explainingTopic.gradeName}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1">
                  Explicación Didáctica: {explainingTopic.title}
                </h3>
              </div>
              <button
                onClick={() => setExplainingTopic(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isExplaining ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-700">
                  Generando pizarra gráfica, analogía cotidiana y pasos didácticos...
                </p>
                <p className="text-xs text-slate-500">
                  Adaptando el contenido al currículum de la Provincia de Buenos Aires
                </p>
              </div>
            ) : explanationResult ? (
              <div className="space-y-5">
                {/* Visual Concept Board Component */}
                <VisualConceptBoard
                  subject={explainingTopic.subject}
                  topicTitle={explainingTopic.title}
                  gradeName={explainingTopic.gradeName}
                  goldenRule={explanationResult.goldenRule || explainingTopic.keyRule}
                  everydayAnalogy={explanationResult.everydayAnalogy}
                  practicalExample={explanationResult.practicalExample}
                />

                {/* Definition Box */}
                {explanationResult.simpleDefinition && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5 font-bold uppercase text-2xs tracking-wide">
                      Resumen para el cuaderno:
                    </strong>
                    {explanationResult.simpleDefinition}
                  </div>
                )}

                {/* Teacher Tips List */}
                {explanationResult.teacherTips && explanationResult.teacherTips.length > 0 && (
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 text-xs space-y-1.5">
                    <span className="font-bold text-blue-900 block text-2xs uppercase tracking-wide flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                      Tips de Patricia para la clase particular:
                    </span>
                    <ul className="space-y-1 text-blue-950 font-medium list-disc list-inside">
                      {explanationResult.teacherTips.map((tip: string, idx: number) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={handleCopyExplanationWhatsApp}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200"
                  >
                    {copiedExplanation ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">¡Copiado para WhatsApp!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Copiar Tip para WhatsApp</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const t = explainingTopic;
                        setExplainingTopic(null);
                        handleOpenQuickPDFModal(t);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generar Ficha PDF de este tema</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: GENERADOR RÁPIDO DE FICHA DIDÁCTICA EN PDF (ALUMNO Y DOCENTE) */}
      {/* ========================================================================= */}
      {pdfModalTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Generar Ficha Práctica PDF: {pdfModalTopic.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {pdfModalTopic.subject} · {pdfModalTopic.gradeName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPdfModalTopic(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customization Options */}
            {!generatedQuickWorksheet ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <span className="text-2xs font-bold text-slate-500 uppercase tracking-wide block">
                    Configuración de la Ficha:
                  </span>

                  {/* Student selector */}
                  {students.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Personalizar para un Alumno (Opcional):
                      </label>
                      <select
                        value={pdfStudentId}
                        onChange={(e) => setPdfStudentId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden"
                      >
                        <option value="">-- Ficha genérica (Sin nombre específico) --</option>
                        {students.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name} ({st.grade})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Difficulty and Exercise Count */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Nivel de Dificultad:
                      </label>
                      <select
                        value={pdfDifficulty}
                        onChange={(e) => setPdfDifficulty(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden"
                      >
                        <option value="Inicial">Inicial (Guiado)</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado / Desafío">Avanzado / Desafío</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Cantidad de Ejercicios:
                      </label>
                      <select
                        value={pdfExerciseCount}
                        onChange={(e) => setPdfExerciseCount(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden"
                      >
                        <option value={3}>3 Ejercicios</option>
                        <option value={5}>5 Ejercicios (Estándar)</option>
                        <option value={8}>8 Ejercicios (Práctica Intensa)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pedagogical preview summary */}
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-xs space-y-1.5">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Caja de herramientas que se incluirá en el PDF:
                  </span>
                  <p className="text-amber-950 font-medium">
                    {pdfModalTopic.keyRule}
                  </p>
                </div>

                {/* Action button to generate */}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      const t = pdfModalTopic;
                      setPdfModalTopic(null);
                      onGenerateWorksheetForTopic(t.subject, t.title, t.gradeName, pdfStudentId);
                    }}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Abrir en Editor Completo
                  </button>

                  <button
                    onClick={handleGenerateQuickPDF}
                    disabled={isGeneratingPDF}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Diseñando Ficha Didáctica...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generar Ficha Ahora</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Generated Quick Worksheet Result */
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>¡Ficha Didáctica Diseñada con Éxito!</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {generatedQuickWorksheet.title}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {generatedQuickWorksheet.exercises.length} actividades listas con espacio cuadriculado de resolución, pistas y solucionario.
                  </p>
                </div>

                {/* Quick preview of exercises */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wide text-2xs block">
                    Previsualización de Ejercicios:
                  </span>
                  {generatedQuickWorksheet.exercises.map((ex, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800">
                      <strong>Actividad {ex.number || idx + 1}:</strong> {ex.statement}
                    </div>
                  ))}
                </div>

                {/* PDF Dual Download Action Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Alumno Clean PDF */}
                    <button
                      onClick={() => handleDownloadStudentPDF(generatedQuickWorksheet)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF Alumno (Limpio)</span>
                    </button>

                    {/* Docente with Solutions PDF */}
                    <button
                      onClick={() => handleDownloadTeacherPDF(generatedQuickWorksheet)}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>PDF Docente (Con Respuestas)</span>
                    </button>
                  </div>

                  {/* Secondary buttons: Assign & WhatsApp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    {pdfStudentId && onAssignWorksheetToStudent && (
                      <button
                        onClick={handleAssignQuickWorksheet}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        {assignedSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">¡Asignada al Alumno!</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Registrar en Historial de Alumno</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={handleShareWorksheetWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ml-auto"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Avisar por WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
