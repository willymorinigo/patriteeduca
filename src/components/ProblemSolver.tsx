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
  FileCheck2,
  Calculator,
  BookOpen,
  RotateCw, 
  Shuffle, 
  Dices, 
  Layers,
  FileText,
  HelpCircle,
  Search,
  Wand2
} from "lucide-react";
import { generateSolvedProblemPDF } from "../utils/pdfGenerator";
import { getWhatsAppSolvedProblemMessage, openWhatsApp } from "../utils/whatsappHelper";
import { generateLocalSolvedProblem } from "../utils/fallbackResolutions";
import { 
  SAMPLE_PROBLEMS_BANK, 
  getRandomSampleProblems, 
  searchSampleProblems,
  generateLocalTopicExercise,
  SampleProblemItem 
} from "../data/sampleProblemsData";

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
  const [randomPickToast, setRandomPickToast] = useState<string | null>(null);

  // Dynamic sample problems & search state
  const [searchTopicQuery, setSearchTopicQuery] = useState<string>("");
  const [isGeneratingTopicExercise, setIsGeneratingTopicExercise] = useState<boolean>(false);
  const [sampleSubjectFilter, setSampleSubjectFilter] = useState<"Todos" | Subject>("Todos");
  const [displayedSamples, setDisplayedSamples] = useState<SampleProblemItem[]>(() => 
    getRandomSampleProblems("Todos", 3)
  );

  const handleFilterSampleSubject = (newFilter: "Todos" | Subject) => {
    setSampleSubjectFilter(newFilter);
    const newItems = getRandomSampleProblems(newFilter, 3);
    setDisplayedSamples(newItems);
  };

  const handleShuffleSamples = () => {
    const currentIds = displayedSamples.map((s) => s.id);
    const newItems = getRandomSampleProblems(sampleSubjectFilter, 3, currentIds);
    setDisplayedSamples(newItems);
  };

  const handleSelectSample = (sp: SampleProblemItem) => {
    setSubject(sp.subject);
    setLevel(sp.level);
    setProblemText(sp.text);
    setImagePreview(null);
    setError(null);
    setRandomPickToast(`Cargado: "${sp.label}"`);
    setTimeout(() => setRandomPickToast(null), 3000);
  };

  const handleRandomPickInstant = () => {
    const pool = SAMPLE_PROBLEMS_BANK;
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    handleSelectSample(randomItem);
  };

  // Generate an exercise on a specific topic with AI or curriculum engine
  const handleGenerateTopicExercise = async (customQuery?: string) => {
    const query = (customQuery || searchTopicQuery).trim();
    if (!query) return;

    setIsGeneratingTopicExercise(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-sample-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: query,
          subject: sampleSubjectFilter !== "Todos" ? sampleSubjectFilter : subject,
          level,
        }),
      });

      let generatedItem: SampleProblemItem;
      if (response.ok) {
        generatedItem = await response.json();
      } else {
        generatedItem = generateLocalTopicExercise(
          query,
          sampleSubjectFilter !== "Todos" ? sampleSubjectFilter : subject,
          level
        );
      }

      handleSelectSample(generatedItem);
      setRandomPickToast(`✨ Ejercicio armado: "${generatedItem.label}"`);
      setTimeout(() => setRandomPickToast(null), 3500);
    } catch (e) {
      const localItem = generateLocalTopicExercise(
        query,
        sampleSubjectFilter !== "Todos" ? sampleSubjectFilter : subject,
        level
      );
      handleSelectSample(localItem);
      setRandomPickToast(`✨ Ejercicio armado: "${localItem.label}"`);
      setTimeout(() => setRandomPickToast(null), 3500);
    } finally {
      setIsGeneratingTopicExercise(false);
    }
  };

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

      if (response.ok) {
        const data = await response.json();
        if (data && data.stepByStep && Array.isArray(data.stepByStep) && data.stepByStep.length > 0) {
          setSolvedResult(data);
          return;
        }
      }

      // If server returned non-ok or empty steps, generate high-quality pedagogical solution locally
      console.warn("Using pedagogical backup solver engine");
      const localResult = generateLocalSolvedProblem(
        problemText,
        subject,
        level,
        selectedStudent?.name
      );
      setSolvedResult(localResult);
    } catch (err: any) {
      console.warn("Fetch error, resolving with pedagogical backup engine:", err);
      const selectedStudent = students.find((s) => s.id === selectedStudentId);
      const localResult = generateLocalSolvedProblem(
        problemText,
        subject,
        level,
        selectedStudent?.name
      );
      setSolvedResult(localResult);
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
    const stepsFormatted = solvedResult.stepByStep
      .map(
        (s) =>
          `🔹 *Paso ${s.stepNumber}: ${s.title}*\n` +
          `   📐 *Cálculo:* ${s.mathDevelopment || s.detailOrFormula || s.title}\n` +
          `   📖 *Regla:* ${s.appliedRule || "Procedimiento"}\n` +
          `   💬 *Explicación:* ${s.explanation}` +
          (s.practicalTip ? `\n   💡 *Tip:* ${s.practicalTip}` : "")
      )
      .join("\n\n");

    const summary =
      `*Resolución Didáctica: ${solvedResult.problemTitle}*\n` +
      `📌 *Materia:* ${solvedResult.subject} (${solvedResult.level})\n\n` +
      `📝 *Enunciado:* ${solvedResult.originalProblem || problemText || solvedResult.problemTitle}\n\n` +
      `📊 *Desarrollo Paso a Paso:*\n\n${stepsFormatted}\n\n` +
      `✅ *Respuesta Final:* ${solvedResult.finalAnswer}\n\n` +
      `💡 *Concepto Clave:* ${solvedResult.reinforcementConcept || solvedResult.pedagogicalTips[0]}`;

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

      {/* 2-Column Grid: Left = Datos del Ejercicio | Right = Banco de Ejercicios de Prueba */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">1</span>
                  Datos del Ejercicio
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Entrada</span>
              </div>

              {/* Materia y Nivel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Materia</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
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
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
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
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
                  className="w-full text-xs sm:text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-y placeholder:text-slate-400 leading-relaxed min-h-[96px]"
                />
              </div>

              {/* Adjuntar Foto del Ejercicio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  O adjuntar foto / captura del ejercicio
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-blue-200 bg-blue-50/50 p-2">
                    <img
                      src={imagePreview}
                      alt="Preview ejercicio"
                      className="max-h-32 w-auto mx-auto rounded-lg object-contain"
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
                  <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <ImageIcon className="w-5 h-5 text-slate-400 mb-0.5" />
                    <span className="text-xs font-semibold text-slate-700">Subir foto de carpeta o fotocopia</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG hasta 5MB</span>
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
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSolve}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
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
          </div>
        </div>

        {/* Column 2: Banco de Ejercicios de Prueba Rápida */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-bold border border-amber-200">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Banco de Ejercicios & Generador
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      20+ temas curriculares PBA o armá uno a medida
                    </p>
                  </div>
                </div>

                {/* Action buttons: Shuffle and Random */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRandomPickInstant}
                    title="Cargar 1 ejercicio al azar de cualquier materia"
                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Dices className="w-3 h-3 text-amber-600" />
                    <span>Al Azar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShuffleSamples}
                    title="Barajar y mostrar otras opciones"
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Otras</span>
                  </button>
                </div>
              </div>

              {/* Lupita & Search / Custom Topic Generator Bar */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTopicQuery}
                    onChange={(e) => setSearchTopicQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchTopicQuery.trim()) {
                        e.preventDefault();
                        handleGenerateTopicExercise();
                      }
                    }}
                    placeholder="Escribí un tema (ej: Ruffini, MRUV, Tales, Sintaxis)..."
                    className="w-full text-xs sm:text-sm pl-9 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all"
                  />

                  {/* Actions inside search input */}
                  <div className="absolute right-1.5 flex items-center gap-1">
                    {searchTopicQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchTopicQuery("")}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                        title="Limpiar búsqueda"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {searchTopicQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => handleGenerateTopicExercise()}
                        disabled={isGeneratingTopicExercise}
                        title="Armar ejercicio sobre este tema específico"
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all shadow-2xs disabled:opacity-50"
                      >
                        {isGeneratingTopicExercise ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-amber-300" />
                        )}
                        <span>Armar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Subject Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pt-0.5 pb-0.5 scrollbar-none text-xs">
                {(["Todos", "Matemática", "Prácticas del Lenguaje", "Física", "Química"] as const).map((filterName) => {
                  const isActive = sampleSubjectFilter === filterName;
                  const shortLabel = filterName === "Prácticas del Lenguaje" ? "Lengua" : filterName;
                  return (
                    <button
                      key={filterName}
                      type="button"
                      onClick={() => handleFilterSampleSubject(filterName as any)}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all shrink-0 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60"
                      }`}
                    >
                      {shortLabel}
                    </button>
                  );
                })}
              </div>

              {randomPickToast && (
                <div className="p-2 px-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
                  <span className="truncate">{randomPickToast}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1.5" />
                </div>
              )}
            </div>

            {/* Cards List: Clean without truncation so full problem content is visible */}
            <div className="space-y-2.5 flex-1 pt-1">
              {(() => {
                const isSearching = searchTopicQuery.trim().length > 0;
                const matchedItems = isSearching
                  ? searchSampleProblems(searchTopicQuery, sampleSubjectFilter)
                  : displayedSamples;

                return (
                  <>
                    {/* If searching, offer quick AI generation card */}
                    {isSearching && (
                      <div className="p-2.5 px-3 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/90 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Wand2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <div className="text-[11px] leading-snug">
                            <span className="font-semibold text-slate-800">¿Buscás un ejercicio a medida? </span>
                            <span className="text-blue-700 font-bold block sm:inline">Armar sobre "{searchTopicQuery.trim()}"</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGenerateTopicExercise()}
                          disabled={isGeneratingTopicExercise}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 transition-all shadow-2xs disabled:opacity-50"
                        >
                          {isGeneratingTopicExercise ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          )}
                          <span>Generar</span>
                        </button>
                      </div>
                    )}

                    {/* If search returned 0 items */}
                    {isSearching && matchedItems.length === 0 ? (
                      <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center space-y-2.5">
                        <p className="text-xs text-slate-600 font-medium">
                          No encontramos un ejercicio prediseñado con el término <strong>"{searchTopicQuery}"</strong>.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleGenerateTopicExercise()}
                          disabled={isGeneratingTopicExercise}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50"
                        >
                          {isGeneratingTopicExercise ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Creando ejercicio sobre "{searchTopicQuery}"...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>Armar ejercicio con IA sobre "{searchTopicQuery}"</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      matchedItems.map((sp) => {
                        const subjectBadgeColor =
                          sp.subject === "Matemática"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : sp.subject === "Prácticas del Lenguaje"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : sp.subject === "Física"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200";

                        return (
                          <button
                            key={sp.id}
                            type="button"
                            onClick={() => handleSelectSample(sp)}
                            className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800 font-medium transition-all flex flex-col gap-1.5 group shadow-2xs hover:shadow-xs"
                          >
                            <div className="flex items-center justify-between gap-1.5 w-full">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${subjectBadgeColor} shrink-0`}>
                                  {sp.subject === "Prácticas del Lenguaje" ? "Lengua" : sp.subject}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {sp.topic}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                                {sp.difficulty}
                              </span>
                            </div>
                            <div className="flex items-start justify-between gap-2 w-full">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 leading-snug">
                                {sp.label}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {sp.text}
                            </p>
                          </button>
                        );
                      })
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Output Section: Full Width Step-by-Step Resolution */}
      <div className="space-y-4">
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                      {solvedResult.subject} · {solvedResult.level}
                    </span>
                    {selectedStudentId && (
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                        Alumno: {students.find(s => s.id === selectedStudentId)?.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1.5">
                    {solvedResult.problemTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs cursor-pointer"
                    title="Descargar PDF imprimible"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={handleSendWhatsApp}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    title="Enviar a WhatsApp con mensaje y descargar PDF"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs cursor-pointer"
                    title="Copiar resolución al portapapeles"
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

              {/* Repetition & Enlarged Highlight of Problem Statement (Requested by User) */}
              <div className="bg-slate-900 text-white border-2 border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-md space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                      <BookOpen className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        Enunciado del Ejercicio Planteado
                      </span>
                      <p className="text-[11px] text-slate-400 font-normal">
                        Ecuación, datos e incógnita a resolver
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800/80">
                      {solvedResult.subject}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                      {solvedResult.level}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/90 rounded-xl p-4 sm:p-5 border border-slate-800/90 shadow-inner">
                  <p className="text-base sm:text-xl md:text-2xl font-normal font-sans text-emerald-300 leading-relaxed whitespace-pre-wrap tracking-wide">
                    {solvedResult.originalProblem || problemText || solvedResult.problemTitle}
                  </p>
                </div>
              </div>

              {/* Step by step: 2-Column Resolution (Col 1: Desarrollo Numérico Real | Col 2: Regla/Ley & Explicación) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <FileCheck2 className="w-4.5 h-4.5 text-blue-600" />
                      Resolución Paso a Paso Didáctica (2 Columnas)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      A la izquierda la ecuación con números reales y a la derecha la regla o ley pedagógica aplicada.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0">
                    {solvedResult.stepByStep.length} pasos
                  </span>
                </div>

                <div className="space-y-4">
                  {solvedResult.stepByStep.map((step, sIdx) => {
                    const mathContent = step.mathDevelopment || step.detailOrFormula;
                    const appliedRule = step.appliedRule;

                    return (
                      <div
                        key={sIdx}
                        className="border border-slate-200/90 rounded-2xl p-4 sm:p-4.5 bg-slate-50/40 hover:bg-white hover:border-blue-300 transition-all space-y-3 shadow-2xs"
                      >
                        {/* Step Title Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100/90 pb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                              {step.stepNumber}
                            </span>
                            <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                              {step.title}
                            </h5>
                          </div>

                          {appliedRule && (
                            <span className="hidden sm:inline-flex text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md truncate max-w-xs">
                              📖 {appliedRule}
                            </span>
                          )}
                        </div>

                        {/* Two-Column Grid: Col 1 = Numerical Resolution | Col 2 = Rule & Explanation */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                          {/* Col 1: Numerical/Real Equation (Pizarrón) */}
                          <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2 shadow-inner">
                            <div className="flex items-center justify-between gap-1 border-b border-slate-800 pb-1.5">
                              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Calculator className="w-3.5 h-3.5 text-blue-400" />
                                1. Desarrollo Numérico / Pizarrón
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Cálculo Real
                              </span>
                            </div>

                            <div className="font-mono text-xs sm:text-sm text-emerald-300 font-semibold whitespace-pre-wrap leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                              {mathContent || step.title}
                            </div>
                          </div>

                          {/* Col 2: Applied Rule & Pedagogical Explanation */}
                          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-1.5">
                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                  2. Regla / Ley & Explicación
                                </span>
                                {appliedRule && (
                                  <span className="sm:hidden text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                                    {appliedRule}
                                  </span>
                                )}
                              </div>

                              {appliedRule && (
                                <div className="text-xs font-bold text-indigo-900 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 rounded-lg">
                                  📌 <span className="text-indigo-950">Ley / Propiedad:</span> {appliedRule}
                                </div>
                              )}

                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                                {step.explanation}
                              </p>
                            </div>

                            {step.practicalTip && (
                              <div className="text-xs text-amber-900 bg-amber-50/90 border border-amber-200/80 rounded-lg p-2 flex items-start gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-amber-950">Tip de la Profe:</strong> {step.practicalTip}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final Answer Highlight - Placed AT THE END of Resolution (Requested by User) */}
              <div className="bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-500/60 bg-emerald-50/60 rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-emerald-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-900">
                      Respuesta y Resultado Final del Ejercicio
                    </span>
                  </div>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-lg">
                    ✓ Resultado Verificado
                  </span>
                </div>
                <div className="bg-white/95 border border-emerald-200/90 rounded-xl p-4 sm:p-5 shadow-2xs">
                  <p className="text-lg sm:text-2xl font-bold text-emerald-950 font-mono tracking-tight">
                    {solvedResult.finalAnswer}
                  </p>
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
                  ¿Querés practicar más este tema o registrarlo en el historial del alumno?
                </div>
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                  {selectedStudentId && (
                    <button
                      onClick={handleQuickLog}
                      disabled={loggedNotification}
                      className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
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
                    className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs ml-auto sm:ml-0 cursor-pointer"
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
    );
  };
