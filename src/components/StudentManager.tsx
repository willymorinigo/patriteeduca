import React, { useState } from "react";
import { 
  Student, 
  TopicRecord, 
  Subject, 
  EducationLevel, 
  MasteryStatus, 
  StudentStatus,
  PaymentStatus,
  StudentDiagnosis 
} from "../types";
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Share2, 
  BookOpen, 
  Send, 
  Check, 
  X, 
  Loader2, 
  Calendar, 
  School,
  ArrowRight,
  TrendingUp,
  Download,
  FileText,
  DollarSign,
  MessageCircle,
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  CheckSquare
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  openWhatsApp, 
  getWhatsAppDiagnosisMessage, 
  getWhatsAppClassReminderMessage, 
  getWhatsAppHomeworkReminderMessage 
} from "../utils/whatsappHelper";
import { generateStudentReportPDF } from "../utils/pdfGenerator";

interface StudentManagerProps {
  students: Student[];
  records: TopicRecord[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddRecord: (record: TopicRecord) => void;
  onUpdateRecord: (record: TopicRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  onGenerateReinforcementWorksheet: (subject: Subject, topic: string, level: string, studentId: string) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  records,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onGenerateReinforcementWorksheet,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"records" | "diagnosis" | "info">("records");

  // Filter topics within student profile
  const [topicStatusFilter, setTopicStatusFilter] = useState<string>("all");
  const [topicSubjectFilter, setTopicSubjectFilter] = useState<string>("all");

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingRecord, setEditingRecord] = useState<TopicRecord | null>(null);

  // Student Form State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("5° Primaria");
  const [newStudentLevel, setNewStudentLevel] = useState<EducationLevel>("Primaria (4° a 6° año)");
  const [newStudentSchool, setNewStudentSchool] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentParent, setNewStudentParent] = useState("");
  const [newStudentSubjects, setNewStudentSubjects] = useState<Subject[]>(["Matemática"]);
  const [newStudentNotes, setNewStudentNotes] = useState("");
  const [newStudentStatus, setNewStudentStatus] = useState<StudentStatus>("activo");
  const [newStudentShift, setNewStudentShift] = useState<"Mañana" | "Tarde" | "Noche" | "Jornada Completa">("Tarde");
  const [newStudentSchedule, setNewStudentSchedule] = useState("");
  const [newStudentHourlyRate, setNewStudentHourlyRate] = useState("");
  const [newStudentPaymentStatus, setNewStudentPaymentStatus] = useState<PaymentStatus>("al_dia");

  // Record Form State
  const [newRecordSubject, setNewRecordSubject] = useState<Subject>("Matemática");
  const [newRecordTopic, setNewRecordTopic] = useState("");
  const [newRecordDate, setNewRecordDate] = useState(
    new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
  );
  const [newRecordStatus, setNewRecordStatus] = useState<MasteryStatus>("en_proceso");
  const [newRecordScore, setNewRecordScore] = useState("");
  const [newRecordTeacherNotes, setNewRecordTeacherNotes] = useState("");
  const [newRecordDuration, setNewRecordDuration] = useState<number>(60);
  const [newRecordPaymentStatus, setNewRecordPaymentStatus] = useState<"abonada" | "pendiente" | "incluida_en_abono">("abonada");
  const [newRecordHomework, setNewRecordHomework] = useState<"si" | "no" | "parcial" | "no_aplica">("no_aplica");
  const [newRecordNeedsHomework, setNewRecordNeedsHomework] = useState<boolean>(false);

  // AI Diagnosis State
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<StudentDiagnosis | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const studentRecords = records.filter((r) => r.studentId === selectedStudentId);

  // Filter students roster
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.school && s.school.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || s.level === levelFilter;
    const matchesStatus = statusFilter === "all" || (s.status || "activo") === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Filtered topics for the selected student
  const filteredStudentRecords = studentRecords.filter((r) => {
    const matchesStatus = topicStatusFilter === "all" || r.status === topicStatusFilter;
    const matchesSub = topicSubjectFilter === "all" || r.subject === topicSubjectFilter;
    return matchesStatus && matchesSub;
  });

  const reinforcementRecords = studentRecords.filter((r) => r.status === "requiere_refuerzo");
  const inProgressRecords = studentRecords.filter((r) => r.status === "en_proceso");
  const masteredRecords = studentRecords.filter((r) => r.status === "afianzado");

  // Save new or updated Student
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        name: newStudentName.trim(),
        grade: newStudentGrade.trim(),
        level: newStudentLevel,
        school: newStudentSchool.trim(),
        phone: newStudentPhone.trim(),
        parentName: newStudentParent.trim(),
        targetSubjects: newStudentSubjects,
        notes: newStudentNotes.trim(),
        status: newStudentStatus,
        shift: newStudentShift,
        preferredSchedule: newStudentSchedule.trim(),
        hourlyRate: newStudentHourlyRate.trim(),
        paymentStatus: newStudentPaymentStatus,
      });
      setEditingStudent(null);
    } else {
      const newStudent: Student = {
        id: "std_" + Date.now(),
        name: newStudentName.trim(),
        grade: newStudentGrade.trim(),
        level: newStudentLevel,
        school: newStudentSchool.trim(),
        phone: newStudentPhone.trim(),
        parentName: newStudentParent.trim(),
        targetSubjects: newStudentSubjects,
        notes: newStudentNotes.trim(),
        status: newStudentStatus,
        shift: newStudentShift,
        preferredSchedule: newStudentSchedule.trim(),
        hourlyRate: newStudentHourlyRate.trim(),
        paymentStatus: newStudentPaymentStatus,
        createdAt: new Date().toISOString().split("T")[0],
      };
      onAddStudent(newStudent);
      setSelectedStudentId(newStudent.id);
    }

    setIsAddStudentOpen(false);
  };

  const openAddStudent = () => {
    setEditingStudent(null);
    setNewStudentName("");
    setNewStudentGrade("5° Primaria");
    setNewStudentLevel("Primaria (4° a 6° año)");
    setNewStudentSchool("");
    setNewStudentPhone("");
    setNewStudentParent("");
    setNewStudentSubjects(["Matemática"]);
    setNewStudentNotes("");
    setNewStudentStatus("activo");
    setNewStudentShift("Tarde");
    setNewStudentSchedule("");
    setNewStudentHourlyRate("");
    setNewStudentPaymentStatus("al_dia");
    setIsAddStudentOpen(true);
  };

  const openEditStudent = (student: Student) => {
    setEditingStudent(student);
    setNewStudentName(student.name);
    setNewStudentGrade(student.grade);
    setNewStudentLevel(student.level);
    setNewStudentSchool(student.school || "");
    setNewStudentPhone(student.phone || "");
    setNewStudentParent(student.parentName || "");
    setNewStudentSubjects(student.targetSubjects || ["Matemática"]);
    setNewStudentNotes(student.notes || "");
    setNewStudentStatus(student.status || "activo");
    setNewStudentShift(student.shift || "Tarde");
    setNewStudentSchedule(student.preferredSchedule || "");
    setNewStudentHourlyRate(student.hourlyRate || "");
    setNewStudentPaymentStatus(student.paymentStatus || "al_dia");
    setIsAddStudentOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!selectedStudent) return;
    onDeleteStudent(selectedStudent.id);
    setIsDeleteConfirmOpen(false);
    const remaining = students.filter((s) => s.id !== selectedStudent.id);
    if (remaining.length > 0) {
      setSelectedStudentId(remaining[0].id);
    } else {
      setSelectedStudentId("");
    }
  };

  // Save new or updated Topic Record
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordTopic.trim() || !selectedStudentId) return;

    if (editingRecord) {
      onUpdateRecord({
        ...editingRecord,
        subject: newRecordSubject,
        topicTitle: newRecordTopic.trim(),
        date: newRecordDate.trim(),
        status: newRecordStatus,
        score: newRecordScore.trim(),
        teacherNotes: newRecordTeacherNotes.trim(),
        classDurationMinutes: newRecordDuration,
        classPaymentStatus: newRecordPaymentStatus,
        homeworkCompleted: newRecordHomework,
        needsHomework: newRecordNeedsHomework,
      });
      setEditingRecord(null);
    } else {
      const newRecord: TopicRecord = {
        id: "rec_" + Date.now(),
        studentId: selectedStudentId,
        subject: newRecordSubject,
        topicTitle: newRecordTopic.trim(),
        date: newRecordDate.trim(),
        status: newRecordStatus,
        score: newRecordScore.trim(),
        teacherNotes: newRecordTeacherNotes.trim(),
        classDurationMinutes: newRecordDuration,
        classPaymentStatus: newRecordPaymentStatus,
        homeworkCompleted: newRecordHomework,
        needsHomework: newRecordNeedsHomework || newRecordStatus === "requiere_refuerzo",
      };
      onAddRecord(newRecord);

      if (newRecordStatus === "afianzado") {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }
    }

    setIsAddRecordOpen(false);
    setNewRecordTopic("");
    setNewRecordTeacherNotes("");
    setNewRecordScore("");
  };

  const openAddRecord = () => {
    setEditingRecord(null);
    setNewRecordSubject(selectedStudent?.targetSubjects?.[0] || "Matemática");
    setNewRecordTopic("");
    setNewRecordDate(
      new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
    );
    setNewRecordStatus("en_proceso");
    setNewRecordScore("");
    setNewRecordTeacherNotes("");
    setNewRecordDuration(60);
    setNewRecordPaymentStatus("abonada");
    setNewRecordHomework("no_aplica");
    setNewRecordNeedsHomework(false);
    setIsAddRecordOpen(true);
  };

  const openEditRecord = (record: TopicRecord) => {
    setEditingRecord(record);
    setNewRecordSubject(record.subject);
    setNewRecordTopic(record.topicTitle);
    setNewRecordDate(record.date);
    setNewRecordStatus(record.status);
    setNewRecordScore(record.score || "");
    setNewRecordTeacherNotes(record.teacherNotes || "");
    setNewRecordDuration(record.classDurationMinutes || 60);
    setNewRecordPaymentStatus(record.classPaymentStatus || "abonada");
    setNewRecordHomework(record.homeworkCompleted || "no_aplica");
    setNewRecordNeedsHomework(!!record.needsHomework);
    setIsAddRecordOpen(true);
  };

  const handleStatusQuickChange = (record: TopicRecord, newStatus: MasteryStatus) => {
    onUpdateRecord({ ...record, status: newStatus });
    if (newStatus === "afianzado") {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }
  };

  // Run AI Pedagogical Diagnosis
  const handleRunDiagnosis = async () => {
    if (!selectedStudent) return;
    setIsDiagnosing(true);
    setCurrentDiagnosis(null);

    try {
      const response = await fetch("/api/diagnose-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: selectedStudent,
          records: studentRecords,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo generar el diagnóstico.");
      }

      const data = await response.json();
      setCurrentDiagnosis(data);
      setActiveTab("diagnosis");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al ejecutar el diagnóstico con IA.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Download Student Progress Report PDF
  const handleDownloadReportPDF = () => {
    if (!selectedStudent) return;
    const doc = generateStudentReportPDF(selectedStudent, studentRecords, currentDiagnosis);
    const cleanName = selectedStudent.name.replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`Informe_Pedagogico_${cleanName}_Prof_Patricia.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm ring-1 ring-slate-800">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Gestión Integral de Alumnos & Progreso Individual
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Alta, baja y modificación de alumnos particulares, seguimiento por semáforo de contenidos, diagnóstico con IA y reportes en PDF.
            </p>
          </div>
        </div>

        <button
          onClick={openAddStudent}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Cargar Nuevo Alumno</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Roster List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search and Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre, grado o escuela..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden font-medium"
              >
                <option value="all">Todos los niveles</option>
                <option value="Primaria (1° a 3° año)">Primaria (1°-3°)</option>
                <option value="Primaria (4° a 6° año)">Primaria (4°-6°)</option>
                <option value="Secundaria Básica (1° a 3° año)">Sec. Básica (1°-3°)</option>
                <option value="Secundaria Superior (4° a 6° año)">Sec. Superior (4°-6°)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden font-medium"
              >
                <option value="all">Todos los estados</option>
                <option value="activo">Solo Activos</option>
                <option value="pausado">En Pausa</option>
                <option value="egresado">Egresados</option>
              </select>
            </div>
          </div>

          {/* Student Cards List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1 no-scrollbar">
            {filteredStudents.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
                No se encontraron alumnos con ese criterio.
              </div>
            ) : (
              filteredStudents.map((st) => {
                const isSelected = st.id === selectedStudentId;
                const stRecords = records.filter((r) => r.studentId === st.id);
                const stReinforcements = stRecords.filter((r) => r.status === "requiere_refuerzo").length;
                const isPausado = st.status === "pausado";
                const isEgresado = st.status === "egresado";

                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStudentId(st.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                        : "bg-white border-slate-200/90 hover:border-blue-300 hover:bg-slate-50/60"
                    } ${isPausado || isEgresado ? "opacity-75" : ""}`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected
                            ? "bg-slate-900 text-white"
                            : isPausado
                            ? "bg-amber-100 text-amber-800"
                            : isEgresado
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {st.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                          <span>{st.name}</span>
                          {isPausado && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded-md">
                              Pausa
                            </span>
                          )}
                          {isEgresado && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-md">
                              Egresado
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                          <span>{st.grade}</span>
                          {st.school && (
                            <>
                              <span>•</span>
                              <span className="truncate">{st.school}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {stReinforcements > 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          {stReinforcements} {stReinforcements === 1 ? "refuerzo" : "refuerzos"}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Al día
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {stRecords.length} {stRecords.length === 1 ? "clase" : "clases"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Student Profile & Topic Tracker */}
        <div className="lg:col-span-8 space-y-4">
          {selectedStudent ? (
            <div className="space-y-4">
              {/* Student Header Details Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">
                          {selectedStudent.name}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {selectedStudent.grade}
                        </span>
                        {selectedStudent.status === "pausado" && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            En Pausa
                          </span>
                        )}
                        {selectedStudent.paymentStatus === "pendiente" && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Pago Pendiente
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        {selectedStudent.school && (
                          <span className="flex items-center gap-1">
                            <School className="w-3.5 h-3.5 text-slate-400" />
                            {selectedStudent.school}
                          </span>
                        )}
                        {selectedStudent.parentName && (
                          <span>Familia: {selectedStudent.parentName}</span>
                        )}
                        {selectedStudent.preferredSchedule && (
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            {selectedStudent.preferredSchedule}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions on student */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* PDF Progress Report */}
                    <button
                      onClick={handleDownloadReportPDF}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      title="Descargar informe pedagógico en PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Informe PDF</span>
                    </button>

                    {/* WhatsApp center */}
                    <button
                      onClick={() => setIsWhatsAppModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      title="Enviar mensaje por WhatsApp"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Edit Student */}
                    <button
                      onClick={() => openEditStudent(selectedStudent)}
                      className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs"
                      title="Editar datos del alumno"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    {/* Delete Student */}
                    <button
                      onClick={() => setIsDeleteConfirmOpen(true)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
                      title="Dar de baja / Eliminar alumno"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Target Subjects, Rate and Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block mb-1">Materias de Apoyo:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.targetSubjects?.map((sub, i) => (
                        <span key={i} className="font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          {sub}
                        </span>
                      ))}
                    </div>
                    {selectedStudent.hourlyRate && (
                      <div className="mt-2 text-slate-600 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        <span>Arancel: {selectedStudent.hourlyRate}</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block mb-1">Observaciones Pedagógicas:</span>
                    <p className="text-slate-700 italic">
                      {selectedStudent.notes || "Sin observaciones registradas."}
                    </p>
                  </div>
                </div>

                {/* Progress Summary Metrics Bar */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-center shadow-2xs">
                    <div className="text-xl font-bold text-emerald-800">{masteredRecords.length}</div>
                    <div className="text-[11px] font-semibold text-emerald-700">🟢 Afianzados</div>
                  </div>
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-center shadow-2xs">
                    <div className="text-xl font-bold text-blue-800">{inProgressRecords.length}</div>
                    <div className="text-[11px] font-semibold text-blue-700">🟡 En Proceso</div>
                  </div>
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center shadow-2xs">
                    <div className="text-xl font-bold text-amber-800">{reinforcementRecords.length}</div>
                    <div className="text-[11px] font-semibold text-amber-700">🔴 Requiere Refuerzo</div>
                  </div>
                </div>
              </div>

              {/* URGENT REINFORCEMENT ALERT PANEL */}
              {reinforcementRecords.length > 0 && (
                <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
                      <h4 className="font-bold text-amber-950 text-sm sm:text-base">
                        Temas que Requieren Refuerzo Inmediato ({reinforcementRecords.length})
                      </h4>
                    </div>
                    <span className="text-xs text-amber-800 font-medium hidden sm:inline">
                      Dificultad detectada en clase
                    </span>
                  </div>

                  <div className="space-y-2">
                    {reinforcementRecords.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                              {r.subject}
                            </span>
                            <span className="font-bold text-slate-800 text-xs sm:text-sm">
                              {r.topicTitle}
                            </span>
                            {r.score && (
                              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                                Nota: {r.score}
                              </span>
                            )}
                          </div>
                          {r.teacherNotes && (
                            <p className="text-xs text-slate-600 mt-1 italic pl-1">
                              "{r.teacherNotes}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() =>
                              onGenerateReinforcementWorksheet(
                                r.subject,
                                r.topicTitle,
                                selectedStudent.level,
                                selectedStudent.id
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                            title="Generar Ficha Práctica de Refuerzo en PDF"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Crear Ficha de Refuerzo</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 gap-2 overflow-x-auto">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab("records")}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === "records"
                        ? "border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Historial de Clases & Temas ({studentRecords.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("diagnosis")}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === "diagnosis"
                        ? "border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Diagnóstico con IA</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pb-1.5">
                  <button
                    onClick={openAddRecord}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Registrar Clase</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: TOPIC & CLASS RECORDS */}
              {activeTab === "records" && (
                <div className="space-y-3">
                  {/* Filter bar for records */}
                  <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs text-xs flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold">Filtrar por:</span>
                      <select
                        value={topicStatusFilter}
                        onChange={(e) => setTopicStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium"
                      >
                        <option value="all">Todos los estados</option>
                        <option value="afianzado">🟢 Solo Afianzados</option>
                        <option value="en_proceso">🟡 Solo En Proceso</option>
                        <option value="requiere_refuerzo">🔴 Requiere Refuerzo</option>
                      </select>

                      <select
                        value={topicSubjectFilter}
                        onChange={(e) => setTopicSubjectFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium"
                      >
                        <option value="all">Todas las materias</option>
                        <option value="Matemática">📐 Matemática</option>
                        <option value="Prácticas del Lenguaje">📖 Lengua</option>
                        <option value="Física">⚡ Física</option>
                        <option value="Química">🧪 Química</option>
                      </select>
                    </div>

                    <span className="text-slate-400 font-medium">
                      Mostrando {filteredStudentRecords.length} de {studentRecords.length} registros
                    </span>
                  </div>

                  {filteredStudentRecords.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs space-y-2">
                      <p>No hay registros de clases o temas que coincidan con el filtro.</p>
                      <button
                        onClick={openAddRecord}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        + Registrar la primera clase para este alumno
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredStudentRecords.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                {rec.subject}
                              </span>
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                {rec.topicTitle}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {rec.date}
                              </span>
                              {rec.classDurationMinutes && (
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {rec.classDurationMinutes} min
                                </span>
                              )}
                            </div>

                            {/* Quick status selector */}
                            <div className="flex items-center gap-1.5 self-start sm:self-auto">
                              <button
                                onClick={() => handleStatusQuickChange(rec, "afianzado")}
                                className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                                  rec.status === "afianzado"
                                    ? "bg-emerald-600 text-white border-emerald-700 shadow-2xs"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50"
                                }`}
                                title="Marcar como Afianzado"
                              >
                                🟢 Afianzado
                              </button>
                              <button
                                onClick={() => handleStatusQuickChange(rec, "en_proceso")}
                                className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                                  rec.status === "en_proceso"
                                    ? "bg-blue-600 text-white border-blue-700 shadow-2xs"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50"
                                }`}
                                title="Marcar como En Proceso"
                              >
                                🟡 En Proceso
                              </button>
                              <button
                                onClick={() => handleStatusQuickChange(rec, "requiere_refuerzo")}
                                className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                                  rec.status === "requiere_refuerzo"
                                    ? "bg-amber-600 text-white border-amber-700 shadow-2xs"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50"
                                }`}
                                title="Marcar como Requiere Refuerzo"
                              >
                                🔴 Refuerzo
                              </button>

                              <button
                                onClick={() => openEditRecord(rec)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 ml-1 transition-colors"
                                title="Editar registro de clase"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteRecord(rec.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Extra notes or scores */}
                          {(rec.teacherNotes || rec.score || rec.homeworkCompleted) && (
                            <div className="bg-slate-50 p-2.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between text-slate-700 gap-2 border border-slate-200/60">
                              <span className="italic">{rec.teacherNotes || "Clase dictada según programa."}</span>
                              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                {rec.homeworkCompleted && rec.homeworkCompleted !== "no_aplica" && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                                    Tarea: {rec.homeworkCompleted === "si" ? "Entregada" : rec.homeworkCompleted === "parcial" ? "Parcial" : "Incompleta"}
                                  </span>
                                )}
                                {rec.score && (
                                  <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                                    Nota: {rec.score}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: AI PEDAGOGICAL DIAGNOSIS */}
              {activeTab === "diagnosis" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Diagnóstico Pedagógico con IA
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Analiza todo el historial de {selectedStudent.name} para detectar puntos ciegos, planificar las próximas semanas y redactar mensajes para los padres.
                      </p>
                    </div>

                    <button
                      onClick={handleRunDiagnosis}
                      disabled={isDiagnosing}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                    >
                      {isDiagnosing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Analizando...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{currentDiagnosis ? "Actualizar Diagnóstico" : "Ejecutar Diagnóstico"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {currentDiagnosis ? (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-1.5">
                        <h5 className="font-bold text-purple-950 text-xs uppercase tracking-wide">
                          Resumen Pedagógico General:
                        </h5>
                        <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">
                          {currentDiagnosis.summary}
                        </p>
                      </div>

                      {/* Urgent Topics */}
                      {currentDiagnosis.urgentReinforcementTopics?.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-amber-800 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            Temas Urgentes a Reforzar en Próximas Clases:
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {currentDiagnosis.urgentReinforcementTopics.map((t, idx) => (
                              <div
                                key={idx}
                                className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs space-y-1"
                              >
                                <div className="font-bold text-amber-950 flex items-center justify-between">
                                  <span>{t.subject} - {t.topic}</span>
                                </div>
                                <p className="text-amber-900">{t.reason}</p>
                                <div className="text-[11px] font-semibold text-amber-800 pt-1">
                                  Acción: {t.recommendedAction}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Strengths & Study Plan */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                          <h5 className="font-bold text-emerald-950 uppercase">Fortalezas del Alumno:</h5>
                          <ul className="list-disc list-inside space-y-1 text-emerald-900">
                            {currentDiagnosis.strengths?.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2">
                          <h5 className="font-bold text-blue-950 uppercase">Plan de Estudio Sugerido:</h5>
                          <ul className="list-decimal list-inside space-y-1 text-blue-900">
                            {currentDiagnosis.recommendedStudyPlan?.map((plan, idx) => (
                              <li key={idx}>{plan}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Parent Message */}
                      {currentDiagnosis.parentFeedbackMessage && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs">
                              Mensaje Redactado para los Padres (WhatsApp):
                            </span>
                            <button
                              onClick={() => {
                                const text = getWhatsAppDiagnosisMessage(currentDiagnosis, selectedStudent.parentName);
                                openWhatsApp(selectedStudent.phone, text);
                              }}
                              className="text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Enviar a la Familia</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-200/80">
                            "{currentDiagnosis.parentFeedbackMessage}"
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs space-y-2">
                      <p>Presioná "Ejecutar Diagnóstico" para analizar las dificultades y fortalezas de {selectedStudent.name}.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
              Selecciona un alumno de la lista o carga uno nuevo para ver su progreso individual.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CARGAR / EDITAR ALUMNO (FULL ABM) */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl w-full shadow-xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingStudent ? "Editar Ficha del Alumno" : "Cargar Nuevo Alumno Particular"}
                </h3>
                <p className="text-xs text-slate-500">
                  Completa los datos académicos, de contacto y pedagógicos.
                </p>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Ej: Sofía Gómez"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Año / Grado Escolar *</label>
                  <input
                    type="text"
                    required
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value)}
                    placeholder="Ej: 5° Primaria, 2° Secundaria"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nivel Pedagógico</label>
                  <select
                    value={newStudentLevel}
                    onChange={(e) => setNewStudentLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Primaria (1° a 3° año)">Primaria (1° a 3° año)</option>
                    <option value="Primaria (4° a 6° año)">Primaria (4° a 6° año)</option>
                    <option value="Secundaria Básica (1° a 3° año)">Secundaria Básica (1° a 3°)</option>
                    <option value="Secundaria Superior (4° a 6° año)">Secundaria Superior (4° a 6°)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Escuela / Colegio</label>
                  <input
                    type="text"
                    value={newStudentSchool}
                    onChange={(e) => setNewStudentSchool(e.target.value)}
                    placeholder="Ej: Colegio San Martín"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Turno Escolar</label>
                  <select
                    value={newStudentShift}
                    onChange={(e) => setNewStudentShift(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Mañana">Turno Mañana</option>
                    <option value="Tarde">Turno Tarde</option>
                    <option value="Jornada Completa">Jornada Completa / Doble Turno</option>
                    <option value="Noche">Turno Noche / Vespertino</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Días y Horarios de Clase</label>
                  <input
                    type="text"
                    value={newStudentSchedule}
                    onChange={(e) => setNewStudentSchedule(e.target.value)}
                    placeholder="Ej: Martes y Jueves 17:30 a 19:00 hs"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Arancel / Valor Acordado</label>
                  <input
                    type="text"
                    value={newStudentHourlyRate}
                    onChange={(e) => setNewStudentHourlyRate(e.target.value)}
                    placeholder="Ej: $6.500 / clase o $26.000 / mes"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nombre del Adulto / Tutor</label>
                  <input
                    type="text"
                    value={newStudentParent}
                    onChange={(e) => setNewStudentParent(e.target.value)}
                    placeholder="Ej: Mariana (Mamá)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Contacto WhatsApp (Familia)</label>
                  <input
                    type="text"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="Ej: 1155443322 (sin 0 ni 15)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Estado del Alumno</label>
                  <select
                    value={newStudentStatus}
                    onChange={(e) => setNewStudentStatus(e.target.value as StudentStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="activo">🟢 Activo (Asiste a clases regulares)</option>
                    <option value="pausado">🟡 En Pausa (Vacaciones / Suspendido)</option>
                    <option value="egresado">🎓 Egresado (Aprobó materias / Finalizó)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Estado de Pago</label>
                  <select
                    value={newStudentPaymentStatus}
                    onChange={(e) => setNewStudentPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="al_dia">✅ Al Día</option>
                    <option value="pendiente">⚠️ Pago Pendiente</option>
                    <option value="a_convenir">🤝 A Convenir / Por Clase</option>
                  </select>
                </div>
              </div>

              {/* Materias de Apoyo Checkboxes */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Materias de Apoyo</label>
                <div className="flex flex-wrap gap-2">
                  {(["Matemática", "Prácticas del Lenguaje", "Física", "Química"] as Subject[]).map((sub) => {
                    const isChecked = newStudentSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setNewStudentSubjects(newStudentSubjects.filter((s) => s !== sub));
                          } else {
                            setNewStudentSubjects([...newStudentSubjects, sub]);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                          isChecked
                            ? "bg-blue-600 text-white border-blue-700 shadow-2xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Observaciones pedagógicas iniciales de la docente</label>
                <textarea
                  rows={2}
                  value={newStudentNotes}
                  onChange={(e) => setNewStudentNotes(e.target.value)}
                  placeholder="Ej: 'Viene para preparar examen de fracciones y ecuaciones... Le cuesta despejar incógnitas negativas.'"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingStudent ? "Guardar Cambios" : "Cargar Alumno"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR / EDITAR CLASE Y TEMA */}
      {isAddRecordOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingRecord ? "Editar Registro de Clase" : "Registrar Clase / Tema Evaluado"}
                </h3>
                <p className="text-xs text-slate-500">
                  Alumno: <strong className="text-slate-800">{selectedStudent?.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsAddRecordOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Materia</label>
                  <select
                    value={newRecordSubject}
                    onChange={(e) => setNewRecordSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Matemática">📐 Matemática</option>
                    <option value="Prácticas del Lenguaje">📖 Lengua</option>
                    <option value="Física">⚡ Física</option>
                    <option value="Química">🧪 Química</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Fecha</label>
                  <input
                    type="text"
                    value={newRecordDate}
                    onChange={(e) => setNewRecordDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tema / Contenido Visto *</label>
                <input
                  type="text"
                  required
                  value={newRecordTopic}
                  onChange={(e) => setNewRecordTopic(e.target.value)}
                  placeholder="Ej: Ecuaciones con fracciones, MRU, Análisis sintáctico..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Semáforo de Asimilación</label>
                <select
                  value={newRecordStatus}
                  onChange={(e) => setNewRecordStatus(e.target.value as MasteryStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                >
                  <option value="afianzado">🟢 Afianzado (Comprende y resuelve con soltura)</option>
                  <option value="en_proceso">🟡 En Proceso (Resuelve con guía de la docente)</option>
                  <option value="requiere_refuerzo">🔴 Requiere Refuerzo (Dificultades notorias)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Calificación / Nota <span className="text-slate-400 font-normal">(opcional)</span></label>
                  <input
                    type="text"
                    value={newRecordScore}
                    onChange={(e) => setNewRecordScore(e.target.value)}
                    placeholder="Ej: 8/10, Muy Bien"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Duración de la Clase</label>
                  <select
                    value={newRecordDuration}
                    onChange={(e) => setNewRecordDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value={60}>60 minutos (1 hora)</option>
                    <option value={90}>90 minutos (1 h 30 m)</option>
                    <option value={120}>120 minutos (2 horas)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">¿Trajo la tarea resuelta?</label>
                  <select
                    value={newRecordHomework}
                    onChange={(e) => setNewRecordHomework(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="no_aplica">No aplicaba</option>
                    <option value="si">✅ Sí, completa</option>
                    <option value="parcial">🟡 Parcial / Con dudas</option>
                    <option value="no">❌ No la hizo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pago de la Sesión</label>
                  <select
                    value={newRecordPaymentStatus}
                    onChange={(e) => setNewRecordPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="abonada">✅ Abonada</option>
                    <option value="pendiente">⚠️ Pendiente</option>
                    <option value="incluida_en_abono">📦 Incluida en Abono Mensual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Observación pedagógica de la clase</label>
                <textarea
                  rows={2}
                  value={newRecordTeacherNotes}
                  onChange={(e) => setNewRecordTeacherNotes(e.target.value)}
                  placeholder="Ej: 'Se equivoca en la regla de los signos al distribuir', 'Comprendió el concepto rápido'..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddRecordOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingRecord ? "Actualizar" : "Guardar Registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR BAJA DE ALUMNO */}
      {isDeleteConfirmOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">
                ¿Dar de baja a {selectedStudent.name}?
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Esta acción eliminará al alumno y sus {studentRecords.length} registros de temas y clases asociadas.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div>💡 <strong>Consejo:</strong> Si el alumno solo pausó sus clases temporalmente, podés editar su ficha y cambiar el estado a <strong>"En Pausa"</strong> sin perder el historial.</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs shadow-xs"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CENTRO DE MENSAJES WHATSAPP */}
      {isWhatsAppModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Mensajes de WhatsApp para {selectedStudent.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Teléfono: {selectedStudent.phone || "No registrado"} {selectedStudent.parentName ? `· ${selectedStudent.parentName}` : ""}
                </p>
              </div>
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Option 1: Recordatorio de clase */}
              <button
                onClick={() => {
                  const msg = getWhatsAppClassReminderMessage(
                    selectedStudent.name,
                    selectedStudent.preferredSchedule
                  );
                  openWhatsApp(selectedStudent.phone, msg);
                  setIsWhatsAppModalOpen(false);
                }}
                className="w-full p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-blue-700">
                    ⏰ Recordatorio de Próxima Clase
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Recuerda el horario pactado ({selectedStudent.preferredSchedule || "próxima sesión"}) y útiles necesarios.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2" />
              </button>

              {/* Option 2: Recordatorio de tareas */}
              <button
                onClick={() => {
                  const latestTopic = studentRecords[0]?.topicTitle || "actividades vistas en clase";
                  const latestSub = studentRecords[0]?.subject || "apoyo escolar";
                  const msg = getWhatsAppHomeworkReminderMessage(selectedStudent.name, latestSub, latestTopic);
                  openWhatsApp(selectedStudent.phone, msg);
                  setIsWhatsAppModalOpen(false);
                }}
                className="w-full p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-amber-800">
                    📝 Recordatorio de Tareas / Práctica
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Envía un aviso de los ejercicios pendientes para la próxima clase.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
              </button>

              {/* Option 3: Saludo personalizado */}
              <button
                onClick={() => {
                  const msg = `¡Hola ${selectedStudent.parentName || selectedStudent.name}! 👋 Te escribe la Prof. Patricia Morinigo para coordinar la próxima clase.`;
                  openWhatsApp(selectedStudent.phone, msg);
                  setIsWhatsAppModalOpen(false);
                }}
                className="w-full p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-emerald-800">
                    💬 Mensaje Libre a la Familia
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Abre el chat de WhatsApp con el saludo inicial de la profesora.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
