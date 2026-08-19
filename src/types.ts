export type Subject = 'Matemática' | 'Prácticas del Lenguaje' | 'Física' | 'Química';

export type EducationLevel = 
  | 'Primaria (1° a 3° año)'
  | 'Primaria (4° a 6° año)'
  | 'Secundaria Básica (1° a 3° año)'
  | 'Secundaria Superior (4° a 6° año)';

export type MasteryStatus = 'afianzado' | 'en_proceso' | 'requiere_refuerzo';

export type StudentStatus = 'activo' | 'pausado' | 'egresado';

export type PaymentStatus = 'al_dia' | 'pendiente' | 'a_convenir';

export type DifficultyLevel = 'Inicial' | 'Intermedio' | 'Avanzado / Desafío';

export interface Student {
  id: string;
  name: string;
  grade: string; // e.g. "5° Primaria", "2° Secundaria"
  level: EducationLevel;
  school?: string;
  phone?: string; // WhatsApp number
  parentName?: string;
  targetSubjects: Subject[];
  notes?: string;
  createdAt: string;
  status?: StudentStatus;
  shift?: 'Mañana' | 'Tarde' | 'Noche' | 'Jornada Completa';
  preferredSchedule?: string;
  hourlyRate?: string;
  paymentStatus?: PaymentStatus;
  totalClassesAttended?: number;
}

export interface TopicRecord {
  id: string;
  studentId: string;
  subject: Subject;
  topicTitle: string;
  date: string;
  status: MasteryStatus;
  score?: string; // e.g. "8/10", "Aprobado", "Bien"
  teacherNotes?: string;
  needsHomework?: boolean;
  classDurationMinutes?: number;
  classPaymentStatus?: 'abonada' | 'pendiente' | 'incluida_en_abono';
  homeworkCompleted?: 'si' | 'no' | 'parcial' | 'no_aplica';
}

export interface StepItem {
  stepNumber: number;
  title: string;
  explanation: string;
  detailOrFormula?: string;
  practicalTip?: string;
}

export interface SolvedProblemResult {
  problemTitle: string;
  subject: Subject;
  level: string;
  originalProblem: string;
  stepByStep: StepItem[];
  finalAnswer: string;
  pedagogicalTips: string[];
  commonPitfalls: string[];
  reinforcementConcept: string;
}

export interface WorksheetExercise {
  number: number;
  statement: string;
  hint?: string;
  solution: {
    stepSummary: string;
    answer: string;
  };
}

export interface Worksheet {
  id: string;
  title: string;
  subject: Subject;
  level: string;
  topic: string;
  difficulty: DifficultyLevel;
  studentName?: string;
  studentId?: string;
  date: string;
  pedagogicalIntro: string;
  exercises: WorksheetExercise[];
  resolutionTipsForTeacher: string[];
  suggestedNextTopics?: string[];
}

export interface StudentDiagnosis {
  studentName: string;
  summary: string;
  urgentReinforcementTopics: {
    subject: Subject;
    topic: string;
    reason: string;
    recommendedAction: string;
  }[];
  strengths: string[];
  recommendedStudyPlan: string[];
  parentFeedbackMessage: string;
}

export interface CurriculumTopicItem {
  id: string;
  subject: Subject;
  levelCategory: 'Primaria' | 'Secundaria';
  gradeName: string;
  title: string;
  summary: string;
  keyRule: string;
  exampleProblem: string;
  teacherTip: string;
}
