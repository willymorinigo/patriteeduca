import React, { useState, useEffect } from "react";
import { 
  Subject, 
  EducationLevel, 
  DifficultyLevel, 
  Worksheet, 
  Student 
} from "../types";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Share2, 
  Printer, 
  CheckCircle2, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  BookOpen, 
  HelpCircle, 
  Loader2, 
  Lightbulb, 
  ChevronRight,
  FolderOpen,
  Trash2
} from "lucide-react";
import { generateWorksheetPDF } from "../utils/pdfGenerator";
import { getWhatsAppWorksheetMessage, openWhatsApp } from "../utils/whatsappHelper";
import { CURRICULUM_TOPICS_PBA } from "../data/curriculumData";

interface WorksheetGeneratorProps {
  students: Student[];
  initialSubject?: Subject;
  initialTopic?: string;
  initialLevel?: string;
  initialStudentId?: string;
  onAssignWorksheetToStudent?: (studentId: string, worksheet: Worksheet) => void;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({
  students,
  initialSubject,
  initialTopic,
  initialLevel,
  initialStudentId,
  onAssignWorksheetToStudent,
}) => {
  const [subject, setSubject] = useState<Subject>(initialSubject || "Matemática");
  const [level, setLevel] = useState<EducationLevel>(
    (initialLevel as EducationLevel) || "Secundaria Básica (1° a 3° año)"
  );
  const [topic, setTopic] = useState<string>(initialTopic || "Ecuaciones de Primer Grado");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Intermedio");
  const [exerciseCount, setExerciseCount] = useState<number>(5);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudentId || "");
  const [customRequirements, setCustomRequirements] = useState<string>("");
  const [includeSolutionsInPDF, setIncludeSolutionsInPDF] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWorksheet, setCurrentWorksheet] = useState<Worksheet | null>(() => {
    try {
      const stored = localStorage.getItem("patricia_active_worksheet");
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      id: "ws_default_1",
      date: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      title: "Ficha de Práctica: Ecuaciones de Primer Grado",
      subject: "Matemática",
      level: "Secundaria Básica (1° a 3° año)",
      topic: "Ecuaciones de Primer Grado con Propiedad Distributiva",
      difficulty: "Intermedio",
      pedagogicalIntro: "Caja de Herramientas: Para resolver ecuaciones recuerda que toda ecuación es una balanza en equilibrio. Separa en términos, aplica propiedad distributiva con cuidado en los signos, y despeja la incógnita agrupando las 'x' en un mismo miembro.",
      exercises: [
        {
          number: 1,
          statement: "Resolver y verificar la siguiente ecuación de primer grado: 2x + 7 = 19",
          hint: "Pasa primero el 7 restando al segundo miembro y luego el 2 dividiendo.",
          solution: {
            stepSummary: "2x = 19 - 7 => 2x = 12 => x = 12 / 2 => x = 6. Verificación: 2(6) + 7 = 12 + 7 = 19.",
            answer: "x = 6",
          },
        },
        {
          number: 2,
          statement: "Aplicar propiedad distributiva y hallar el valor de la incógnita: 3(x - 4) + 5 = 2x + 1",
          hint: "Multiplica el 3 por la x y por el -4 antes de agrupar los términos.",
          solution: {
            stepSummary: "3x - 12 + 5 = 2x + 1 => 3x - 7 = 2x + 1 => 3x - 2x = 1 + 7 => x = 8.",
            answer: "x = 8",
          },
        },
        {
          number: 3,
          statement: "Resolver la ecuación con fracciones: (x + 3) / 4 = 5",
          hint: "El 4 que está dividiendo a todo el primer miembro pasa multiplicando al segundo miembro.",
          solution: {
            stepSummary: "x + 3 = 5 · 4 => x + 3 = 20 => x = 20 - 3 => x = 17.",
            answer: "x = 17",
          },
        },
        {
          number: 4,
          statement: "Plantear la ecuación correspondiente y resolver: 'El triple de un número aumentado en 8 unidades es igual a 35. ¿Cuál es dicho número?'",
          hint: "Traduce el lenguaje coloquial al simbólico: el triple de un número es 3x, aumentado en 8 es + 8.",
          solution: {
            stepSummary: "Planteo: 3x + 8 = 35 => 3x = 35 - 8 => 3x = 27 => x = 27 / 3 => x = 9.",
            answer: "El número buscado es 9",
          },
        },
        {
          number: 5,
          statement: "Resolver agrupando términos y simplificando: 5(2x - 1) - 4(x + 2) = 11",
          hint: "Cuidado con el signo menos delante del 4: -4 · (+2) = -8.",
          solution: {
            stepSummary: "10x - 5 - 4x - 8 = 11 => 6x - 13 = 11 => 6x = 11 + 13 => 6x = 24 => x = 4.",
            answer: "x = 4",
          },
        },
      ],
      resolutionTipsForTeacher: [
        "Hacer que el alumno lea el enunciado en voz alta para chequear la comprensión lectora de la consigna.",
        "Verificar que no saltee pasos intermedios en el cuaderno y mantenga el orden de los cálculos.",
        "Recordar la importancia de verificar siempre el resultado final antes de dar por terminado el ejercicio.",
      ],
      suggestedNextTopics: ["Ecuaciones con números racionales", "Sistemas de dos ecuaciones lineales"],
    };
  });
  const [showAllSolutions, setShowAllSolutions] = useState<boolean>(false);
  const [savedWorksheets, setSavedWorksheets] = useState<Worksheet[]>(() => {
    try {
      const stored = localStorage.getItem("patricia_saved_worksheets");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [assignedToast, setAssignedToast] = useState<boolean>(false);

  // Sync when initial props change
  useEffect(() => {
    if (initialSubject) setSubject(initialSubject);
    if (initialTopic) setTopic(initialTopic);
    if (initialLevel) setLevel(initialLevel as EducationLevel);
    if (initialStudentId) setSelectedStudentId(initialStudentId);
  }, [initialSubject, initialTopic, initialLevel, initialStudentId]);

  // Save active worksheet to storage
  useEffect(() => {
    if (currentWorksheet) {
      try {
        localStorage.setItem("patricia_active_worksheet", JSON.stringify(currentWorksheet));
      } catch {}
    }
  }, [currentWorksheet]);

  // Save worksheets to localStorage
  const saveWorksheetToStorage = (ws: Worksheet) => {
    setSavedWorksheets((prev) => {
      const updated = [ws, ...prev.filter((w) => w.id !== ws.id)].slice(0, 30);
      localStorage.setItem("patricia_saved_worksheets", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSavedWorksheet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedWorksheets((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      localStorage.setItem("patricia_saved_worksheets", JSON.stringify(updated));
      return updated;
    });
  };

  // Filter suggested topics from curriculum
  const suggestedTopics = CURRICULUM_TOPICS_PBA.filter((t) => t.subject === subject);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Por favor ingresa o selecciona el tema de la práctica.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const student = students.find((s) => s.id === selectedStudentId);
      const studentName = student ? student.name : undefined;

      const response = await fetch("/api/generate-worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          level,
          difficulty,
          exerciseCount,
          studentName,
          customRequirements,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "No se pudo generar la ficha.");
      }

      const data: Worksheet = await response.json();
      if (selectedStudentId) {
        data.studentId = selectedStudentId;
      }
      setCurrentWorksheet(data);
      saveWorksheetToStorage(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al conectar con el generador con IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadStudentPDF = () => {
    if (!currentWorksheet) return;
    const doc = generateWorksheetPDF(currentWorksheet, { includeSolutions: false });
    const cleanTopic = (currentWorksheet.topic || "practica").replace(/[^a-zA-Z0-9]/g, "_");
    const studentTag = currentWorksheet.studentName ? `_${currentWorksheet.studentName.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    const filename = `Ficha_${currentWorksheet.subject}_${cleanTopic}${studentTag}_ALUMNO.pdf`;
    doc.save(filename);
  };

  const handleDownloadTeacherPDF = () => {
    if (!currentWorksheet) return;
    const doc = generateWorksheetPDF(currentWorksheet, { includeSolutions: true });
    const cleanTopic = (currentWorksheet.topic || "practica").replace(/[^a-zA-Z0-9]/g, "_");
    const studentTag = currentWorksheet.studentName ? `_${currentWorksheet.studentName.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    const filename = `Ficha_${currentWorksheet.subject}_${cleanTopic}${studentTag}_DOCENTE_CON_RESPUESTAS.pdf`;
    doc.save(filename);
  };

  const handleDownloadPDF = () => {
    if (showAllSolutions || includeSolutionsInPDF) {
      handleDownloadTeacherPDF();
    } else {
      handleDownloadStudentPDF();
    }
  };

  const handleSendWhatsApp = (isTeacherVersion: boolean = false) => {
    if (!currentWorksheet) return;
    const student = students.find((s) => s.id === (currentWorksheet.studentId || selectedStudentId));
    const msg = getWhatsAppWorksheetMessage(currentWorksheet, student?.name);
    
    // Auto-trigger PDF download (Alumno version for student/family by default)
    if (isTeacherVersion) {
      handleDownloadTeacherPDF();
    } else {
      handleDownloadStudentPDF();
    }
    openWhatsApp(student?.phone, msg);
  };

  const handlePrint = (withSolutions: boolean = false) => {
    if (!currentWorksheet) return;
    const doc = generateWorksheetPDF(currentWorksheet, { includeSolutions: withSolutions });
    doc.autoPrint();
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  };

  const handleAssignToStudent = () => {
    if (!currentWorksheet || !selectedStudentId) return;
    if (onAssignWorksheetToStudent) {
      onAssignWorksheetToStudent(selectedStudentId, currentWorksheet);
      setAssignedToast(true);
      setTimeout(() => setAssignedToast(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm ring-1 ring-slate-800">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Generador de Fichas & Guías de Práctica PDF
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Crea actividades graduadas con tips iniciales y hoja de soluciones razonadas, listas para descargar en PDF e imprimir o enviar por WhatsApp.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            Formato A4 Imprimible & WhatsApp
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">1</span>
                Configurar Guía de Práctica
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Parámetros</span>
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

            {/* Tema a Practicar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Tema específico a ejercitar
                </label>
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: Suma de Fracciones, Ecuaciones 1° grado, MRU..."
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />

              {/* Temas Sugeridos PBA */}
              <div className="mt-2.5">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Sugeridos del Diseño Curricular PBA:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTopics.slice(0, 4).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setTopic(st.title)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all truncate max-w-[210px] font-medium ${
                        topic === st.title
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cantidad y Dificultad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cant. de Ejercicios
                </label>
                <select
                  value={exerciseCount}
                  onChange={(e) => setExerciseCount(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value={3}>3 ejercicios (Ficha corta)</option>
                  <option value={5}>5 ejercicios (Estándar)</option>
                  <option value={8}>8 ejercicios (Completa)</option>
                  <option value={10}>10 ejercicios (Repaso examen)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dificultad
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Inicial">Inicial / Base</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado / Desafío">Avanzado / Desafío</option>
                </select>
              </div>
            </div>

            {/* Alumno Destinatario (Opcional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personalizar para Alumno <span className="text-slate-400 font-normal">(aparece en encabezado)</span>
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Sin nombre específico (Plantilla genérica) --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.grade})
                  </option>
                ))}
              </select>
            </div>

            {/* Requisitos específicos */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Indicaciones pedagógicas especiales <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                placeholder="Ej: 'Incluir 2 problemas de la vida cotidiana', 'Enfocar en simplificación'..."
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Checkbox incluir soluciones */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="incSolutions"
                checked={includeSolutionsInPDF}
                onChange={(e) => setIncludeSolutionsInPDF(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="incSolutions" className="text-xs font-medium text-slate-700 cursor-pointer">
                Incluir hoja de soluciones razonadas en el PDF (pág. 2)
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando ficha pedagógica...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generar Ficha de Práctica con IA</span>
                </>
              )}
            </button>
          </div>

          {/* Saved Worksheets Drawer */}
          {savedWorksheets.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                  Fichas Generadas Recientes ({savedWorksheets.length})
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                {savedWorksheets.map((ws) => (
                  <div
                    key={ws.id}
                    onClick={() => setCurrentWorksheet(ws)}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer transition-all flex items-center justify-between group text-xs"
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-slate-800 truncate">{ws.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {ws.subject} · {ws.exercises.length} ejer. {ws.studentName ? `· Para: ${ws.studentName}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => deleteSavedWorksheet(ws.id, e)}
                        className="p-1 text-slate-300 hover:text-red-500 rounded-md transition-colors"
                        title="Eliminar de historial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Worksheet Preview & Actions */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[440px] shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                <FileText className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Diseñando la ficha de práctica...
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Graduando la dificultad de los ejercicios, formulando pistas didácticas y elaborando la caja de herramientas inicial.
                </p>
              </div>
            </div>
          ) : currentWorksheet ? (
            <div className="space-y-4">
              {/* Top Action Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 backdrop-blur-md bg-white/95">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      {currentWorksheet.subject}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {(currentWorksheet.exercises || []).length} actividades · Nivel {currentWorksheet.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1 truncate max-w-md">
                    {currentWorksheet.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Download Student Version */}
                  <button
                    onClick={handleDownloadStudentPDF}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                    title="Descargar versión limpia para el alumno (sin respuestas, con renglones de desarrollo)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Alumno (Limpio)</span>
                  </button>

                  {/* Download Teacher Version with Solutions */}
                  <button
                    onClick={handleDownloadTeacherPDF}
                    className="bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                    title="Descargar versión docente (con ejercicios + hoja completa de respuestas razonadas y tips)"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF Docente (Con Respuestas)</span>
                  </button>

                  <button
                    onClick={() => handleSendWhatsApp(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                    title="Enviar mensaje y descargar PDF de práctica para WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handlePrint(showAllSolutions)}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs hidden sm:flex"
                    title="Imprimir"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Imprimir</span>
                  </button>

                  {selectedStudentId && (
                    <button
                      onClick={handleAssignToStudent}
                      className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs"
                      title="Registrar en la ficha del alumno"
                    >
                      {assignedToast ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Asignada</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                          <span>Asignar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Printable Worksheet Preview Card */}
              <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Paper Header Layout */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase text-blue-700">
                      CLASES PARTICULARES Y APOYO ESCOLAR
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Prof. Patricia Morinigo · Provincia de Buenos Aires
                    </h2>
                  </div>
                  <div className="text-left sm:text-right text-xs text-slate-500 font-medium">
                    <div>Fecha: {currentWorksheet.date || new Date().toLocaleDateString("es-AR")}</div>
                    <div>Materia: {currentWorksheet.subject}</div>
                  </div>
                </div>

                {/* Student info box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-700">Alumno/a: </span>
                    <span className="text-slate-900 font-medium">
                      {currentWorksheet.studentName || "___________________________________"}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Nivel / Año: </span>
                    <span className="text-slate-900 font-medium">{currentWorksheet.level}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-bold text-slate-700">Tema: </span>
                    <span className="text-blue-700 font-semibold">{currentWorksheet.topic}</span>
                  </div>
                </div>

                {/* Pedagogical Reminder / Toolbox */}
                {currentWorksheet.pedagogicalIntro && (
                  <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      Recordatorio y Tips de Resolución:
                    </div>
                    <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                      {currentWorksheet.pedagogicalIntro}
                    </p>
                  </div>
                )}

                {/* Exercises List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                      Actividades para Resolver
                    </h4>
                    <button
                      onClick={() => setShowAllSolutions(!showAllSolutions)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {showAllSolutions ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showAllSolutions ? "Ocultar Respuestas" : "Ver Respuestas"}</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(currentWorksheet.exercises || []).map((ex, idx) => (
                      <div
                        key={idx}
                        className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {ex.number || idx + 1}
                          </span>
                          <div className="space-y-1 grow">
                            <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                              {ex.statement}
                            </p>
                            {ex.hint && (
                              <p className="text-xs text-slate-500 italic flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-slate-400" />
                                <span><strong>Pista:</strong> {ex.hint}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Space for working on paper */}
                        <div className="border-t border-dashed border-slate-200 pt-2 space-y-2">
                          <div className="h-10 border-b border-dashed border-slate-200/80"></div>
                          <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                            <span>Espacio de desarrollo</span>
                            <span>Rta: ___________________</span>
                          </div>
                        </div>

                        {/* Solution dropdown if toggled */}
                        {showAllSolutions && ex.solution && (
                          <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 text-xs space-y-1">
                            <span className="font-bold text-emerald-800 block">
                              Resolución & Autocorrección:
                            </span>
                            <p className="text-emerald-950 font-mono">
                              {ex.solution.stepSummary}
                            </p>
                            <div className="font-bold text-emerald-900 pt-1">
                              Resultado final: {ex.solution.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teacher tips footnote */}
                {currentWorksheet.resolutionTipsForTeacher && currentWorksheet.resolutionTipsForTeacher.length > 0 && (
                  <div className="border-t border-slate-200 pt-4 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800">
                      💡 Guía docente para la corrección (Prof. Patricia):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                      {currentWorksheet.resolutionTipsForTeacher.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[420px] shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <div className="max-w-sm">
                <h4 className="font-bold text-slate-800 text-sm">
                  Vista Previa de la Ficha de Práctica
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Configura la materia, el tema y la cantidad de ejercicios en el panel izquierdo para generar un documento listo para PDF o WhatsApp.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
