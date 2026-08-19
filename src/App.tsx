import React, { useState, useEffect } from "react";
import { Student, TopicRecord, Subject, Worksheet } from "./types";
import { INITIAL_STUDENTS, INITIAL_RECORDS } from "./data/initialStudents";
import { Navbar } from "./components/Navbar";
import { ProblemSolver } from "./components/ProblemSolver";
import { WorksheetGenerator } from "./components/WorksheetGenerator";
import { StudentManager } from "./components/StudentManager";
import { ReinforcementAlerts } from "./components/ReinforcementAlerts";
import { CurriculumLibrary } from "./components/CurriculumLibrary";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("solver");

  // State with LocalStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem("patricia_students");
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [records, setRecords] = useState<TopicRecord[]>(() => {
    try {
      const saved = localStorage.getItem("patricia_records");
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  // Generator prefill state
  const [generatorPrefill, setGeneratorPrefill] = useState<{
    subject?: Subject;
    topic?: string;
    level?: string;
    studentId?: string;
  }>({});

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("patricia_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("patricia_records", JSON.stringify(records));
  }, [records]);

  // Student CRUD operations
  const handleAddStudent = (student: Student) => {
    setStudents((prev) => [student, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setRecords((prev) => prev.filter((r) => r.studentId !== studentId));
  };

  // Records CRUD operations
  const handleAddRecord = (record: TopicRecord) => {
    setRecords((prev) => [record, ...prev]);
  };

  const handleUpdateRecord = (updatedRecord: TopicRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
  };

  const handleDeleteRecord = (recordId: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== recordId));
  };

  // Cross-tab actions
  const handleNavigateToGenerator = (
    subject: Subject,
    topic: string,
    level: string,
    studentId?: string
  ) => {
    setGeneratorPrefill({ subject, topic, level, studentId });
    setActiveTab("worksheets");
  };

  const handleLogTopicToStudent = (
    studentId: string,
    subject: Subject,
    topicTitle: string,
    teacherNotes?: string
  ) => {
    const newRecord: TopicRecord = {
      id: "rec_" + Date.now(),
      studentId,
      subject,
      topicTitle,
      date: new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      status: "en_proceso",
      teacherNotes: teacherNotes || "Resuelto en clase.",
    };
    handleAddRecord(newRecord);
  };

  const handleAssignWorksheetToStudent = (
    studentId: string,
    worksheet: Worksheet
  ) => {
    const newRecord: TopicRecord = {
      id: "rec_" + Date.now(),
      studentId,
      subject: worksheet.subject,
      topicTitle: worksheet.topic,
      date: worksheet.date || new Date().toLocaleDateString("es-AR"),
      status: "en_proceso",
      teacherNotes: `Asignada guía de práctica: "${worksheet.title}" (${worksheet.exercises.length} actividades).`,
      needsHomework: true,
    };
    handleAddRecord(newRecord);
  };

  // Backup and Restore
  const handleExportData = () => {
    const data = {
      app: "Aula Maestra Patricia",
      exportDate: new Date().toISOString(),
      students,
      records,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Copia_Seguridad_Alumnos_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target?.result as string);
            if (parsed.students && Array.isArray(parsed.students)) {
              setStudents(parsed.students);
            }
            if (parsed.records && Array.isArray(parsed.records)) {
              setRecords(parsed.records);
            }
            alert("¡Copia de seguridad importada con éxito!");
          } catch {
            alert("El archivo no tiene un formato válido de copia de seguridad.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const reinforcementCount = records.filter(
    (r) => r.status === "requiere_refuerzo"
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reinforcementCount={reinforcementCount}
        studentCount={students.length}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "solver" && (
          <ProblemSolver
            students={students}
            onGenerateSimilarWorksheet={handleNavigateToGenerator}
            onLogTopicToStudent={handleLogTopicToStudent}
          />
        )}

        {activeTab === "worksheets" && (
          <WorksheetGenerator
            students={students}
            initialSubject={generatorPrefill.subject}
            initialTopic={generatorPrefill.topic}
            initialLevel={generatorPrefill.level}
            initialStudentId={generatorPrefill.studentId}
            onAssignWorksheetToStudent={handleAssignWorksheetToStudent}
          />
        )}

        {activeTab === "students" && (
          <StudentManager
            students={students}
            records={records}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddRecord={handleAddRecord}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onGenerateReinforcementWorksheet={handleNavigateToGenerator}
          />
        )}

        {activeTab === "reinforcements" && (
          <ReinforcementAlerts
            students={students}
            records={records}
            onUpdateRecord={handleUpdateRecord}
            onGenerateReinforcementWorksheet={handleNavigateToGenerator}
          />
        )}

        {activeTab === "curriculum" && (
          <CurriculumLibrary
            students={students}
            onGenerateWorksheetForTopic={handleNavigateToGenerator}
            onAssignWorksheetToStudent={handleAssignWorksheetToStudent}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200/90 py-5 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">
              Aula Maestra Patricia
            </span>
            <span className="text-slate-400">·</span>
            <span>Sistema Integral para Clases Particulares y Apoyo Escolar</span>
          </div>
          <div className="text-slate-500 font-medium">
            Provincia de Buenos Aires · Matemática · Lengua · Física · Química
          </div>
        </div>
      </footer>
    </div>
  );
}
