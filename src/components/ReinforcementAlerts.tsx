import React, { useState } from "react";
import { Student, TopicRecord, Subject } from "../types";
import { 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  Filter, 
  BookOpen, 
  ArrowRight,
  TrendingDown
} from "lucide-react";
import confetti from "canvas-confetti";
import { openWhatsApp } from "../utils/whatsappHelper";

interface ReinforcementAlertsProps {
  students: Student[];
  records: TopicRecord[];
  onUpdateRecord: (record: TopicRecord) => void;
  onGenerateReinforcementWorksheet: (subject: Subject, topic: string, level: string, studentId: string) => void;
}

export const ReinforcementAlerts: React.FC<ReinforcementAlertsProps> = ({
  students,
  records,
  onUpdateRecord,
  onGenerateReinforcementWorksheet,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");

  const reinforcementRecords = records.filter((r) => r.status === "requiere_refuerzo");

  const filteredRecords = reinforcementRecords.filter((r) => {
    return selectedSubjectFilter === "all" || r.subject === selectedSubjectFilter;
  });

  const handleMarkAsMastered = (rec: TopicRecord) => {
    onUpdateRecord({ ...rec, status: "afianzado" });
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const getStudent = (studentId: string) => {
    return students.find((s) => s.id === studentId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm ring-1 ring-slate-800">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Radar de Temas que Requieren Refuerzo
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Detección automática de dificultades observadas en clase para planificar tareas y fichas de apoyo personalizadas.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl text-center shrink-0 shadow-2xs">
          <div className="text-2xl font-black text-slate-900">{reinforcementRecords.length}</div>
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            {reinforcementRecords.length === 1 ? "Tema a Reforzar" : "Temas a Reforzar"}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filtrar por Materia:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["all", "Matemática", "Prácticas del Lenguaje", "Física", "Química"].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubjectFilter(sub)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium ${
                selectedSubjectFilter === sub
                  ? "bg-slate-900 text-white border-slate-900 font-semibold shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {sub === "all" ? "Todas las Materias" : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              ¡Excelente! No hay temas en alerta en este momento.
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Todos los temas registrados para los alumnos se encuentran al día o completamente afianzados.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => {
            const student = getStudent(rec.studentId);
            if (!student) return null;

            return (
              <div
                key={rec.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-amber-400/80 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header: Student and Subject */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">
                          {student.name}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({student.grade})
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Detectado el: {rec.date}</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      {rec.subject}
                    </span>
                  </div>

                  {/* Topic Title */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                      Tema con Dificultad:
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {rec.topicTitle}
                    </p>
                    {rec.score && (
                      <span className="text-xs font-semibold text-rose-600 bg-white border border-rose-200 px-2 py-0.5 rounded-md inline-block mt-1">
                        Nota en clase: {rec.score}
                      </span>
                    )}
                  </div>

                  {/* Observation note */}
                  {rec.teacherNotes && (
                    <p className="text-xs text-slate-650 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <strong className="text-slate-800 not-italic">Observación docente:</strong> "{rec.teacherNotes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleMarkAsMastered(rec)}
                    className="bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all border border-slate-300 shadow-2xs"
                    title="Marcar como superado y afianzado"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Marcar Superado</span>
                  </button>

                  <button
                    onClick={() =>
                      onGenerateReinforcementWorksheet(
                        rec.subject,
                        rec.topicTitle,
                        student.grade,
                        student.id
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Crear Ficha PDF</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
