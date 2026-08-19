import React, { useState, useEffect, useRef } from "react";
import { Student, TopicRecord, Subject, Worksheet } from "./types";
import { INITIAL_STUDENTS, INITIAL_RECORDS } from "./data/initialStudents";
import { Navbar } from "./components/Navbar";
import { ProblemSolver } from "./components/ProblemSolver";
import { WorksheetGenerator } from "./components/WorksheetGenerator";
import { StudentManager } from "./components/StudentManager";
import { ReinforcementAlerts } from "./components/ReinforcementAlerts";
import { CurriculumLibrary } from "./components/CurriculumLibrary";
import { 
  testFirestoreConnection, 
} from "./firebase";
import {
  subscribeToStudents,
  subscribeToRecords,
  saveStudentToFirestore,
  deleteStudentFromFirestore,
  saveRecordToFirestore,
  deleteRecordFromFirestore,
  checkAndSeedInitialData,
} from "./services/firebaseService";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("solver");
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState<boolean>(false);

  // State with LocalStorage fallback and Firestore synchronization
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

  // Connect to Firebase and establish real-time Firestore listeners
  useEffect(() => {
    let unsubscribeStudents: (() => void) | undefined;
    let unsubscribeRecords: (() => void) | undefined;

    async function initFirestore() {
      try {
        await testFirestoreConnection();

        // Seed initial data once to Firestore only if database is completely empty
        await checkAndSeedInitialData(INITIAL_STUDENTS, INITIAL_RECORDS);

        // Real-time listener for students
        unsubscribeStudents = subscribeToStudents((firestoreStudents) => {
          setStudents(firestoreStudents);
          setIsInitialLoadDone(true);
          setIsCloudSynced(true);
          try {
            localStorage.setItem("patricia_students", JSON.stringify(firestoreStudents));
          } catch (e) {
            console.error("Local storage error:", e);
          }
        });

        // Real-time listener for records
        unsubscribeRecords = subscribeToRecords((firestoreRecords) => {
          setRecords(firestoreRecords);
          try {
            localStorage.setItem("patricia_records", JSON.stringify(firestoreRecords));
          } catch (e) {
            console.error("Local storage error:", e);
          }
        });
      } catch (err) {
        console.error("Error initializing Firestore listeners:", err);
        setIsCloudSynced(false);
      }
    }

    initFirestore();

    return () => {
      if (unsubscribeStudents) unsubscribeStudents();
      if (unsubscribeRecords) unsubscribeRecords();
    };
  }, []);

  // Persist to localStorage whenever state changes as an offline fallback
  useEffect(() => {
    localStorage.setItem("patricia_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("patricia_records", JSON.stringify(records));
  }, [records]);

  // Student CRUD operations with Firestore synchronization
  const handleAddStudent = async (student: Student) => {
    setStudents((prev) => [student, ...prev.filter(s => s.id !== student.id)]);
    try {
      await saveStudentToFirestore(student);
    } catch (err) {
      console.error("Error saving student to Firestore:", err);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    try {
      await saveStudentToFirestore(updatedStudent);
    } catch (err) {
      console.error("Error updating student in Firestore:", err);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setRecords((prev) => prev.filter((r) => r.studentId !== studentId));
    try {
      await deleteStudentFromFirestore(studentId);
      // Also delete any associated topic records
      const studentRecords = records.filter((r) => r.studentId === studentId);
      for (const rec of studentRecords) {
        await deleteRecordFromFirestore(rec.id);
      }
    } catch (err) {
      console.error("Error deleting student from Firestore:", err);
    }
  };

  // Records CRUD operations with Firestore synchronization
  const handleAddRecord = async (record: TopicRecord) => {
    setRecords((prev) => [record, ...prev.filter(r => r.id !== record.id)]);
    try {
      await saveRecordToFirestore(record);
    } catch (err) {
      console.error("Error saving record to Firestore:", err);
    }
  };

  const handleUpdateRecord = async (updatedRecord: TopicRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
    try {
      await saveRecordToFirestore(updatedRecord);
    } catch (err) {
      console.error("Error updating record in Firestore:", err);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== recordId));
    try {
      await deleteRecordFromFirestore(recordId);
    } catch (err) {
      console.error("Error deleting record from Firestore:", err);
    }
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
      app: "Patric-IA te Educa",
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
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const parsed = JSON.parse(event.target?.result as string);
            if (parsed.students && Array.isArray(parsed.students)) {
              setStudents(parsed.students);
              for (const s of parsed.students) {
                await saveStudentToFirestore(s);
              }
            }
            if (parsed.records && Array.isArray(parsed.records)) {
              setRecords(parsed.records);
              for (const r of parsed.records) {
                await saveRecordToFirestore(r);
              }
            }
            alert("¡Copia de seguridad importada y sincronizada en la nube con éxito!");
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
        isCloudSynced={isCloudSynced}
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
