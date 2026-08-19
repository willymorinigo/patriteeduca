import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  Unsubscribe 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Student, TopicRecord, Worksheet } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Clean helper to remove undefined fields from objects before saving to Firestore
function sanitizePayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        clean[key] = obj[key].map((item: any) =>
          typeof item === 'object' && item !== null ? sanitizePayload(item) : item
        );
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        clean[key] = sanitizePayload(obj[key]);
      } else {
        clean[key] = obj[key];
      }
    }
  });
  return clean;
}

// ----------------------------------------------------
// STUDENTS REALTIME SYNC & CRUD
// ----------------------------------------------------

export function subscribeToStudents(
  onData: (students: Student[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colPath = 'students';
  try {
    const colRef = collection(db, colPath);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Student[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Student);
        });
        onData(list);
      },
      (error) => {
        console.error('Students snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
    return () => {};
  }
}

export async function saveStudentToFirestore(student: Student): Promise<void> {
  const docPath = `students/${student.id}`;
  try {
    const docRef = doc(db, 'students', student.id);
    const payload = sanitizePayload(student);
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteStudentFromFirestore(studentId: string): Promise<void> {
  const docPath = `students/${studentId}`;
  try {
    const docRef = doc(db, 'students', studentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ----------------------------------------------------
// TOPIC RECORDS REALTIME SYNC & CRUD
// ----------------------------------------------------

export function subscribeToRecords(
  onData: (records: TopicRecord[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colPath = 'records';
  try {
    const colRef = collection(db, colPath);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: TopicRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as TopicRecord);
        });
        onData(list);
      },
      (error) => {
        console.error('Records snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
    return () => {};
  }
}

export async function saveRecordToFirestore(record: TopicRecord): Promise<void> {
  const docPath = `records/${record.id}`;
  try {
    const docRef = doc(db, 'records', record.id);
    const payload = sanitizePayload(record);
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteRecordFromFirestore(recordId: string): Promise<void> {
  const docPath = `records/${recordId}`;
  try {
    const docRef = doc(db, 'records', recordId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ----------------------------------------------------
// WORKSHEETS REALTIME SYNC & CRUD
// ----------------------------------------------------

export function subscribeToWorksheets(
  onData: (worksheets: Worksheet[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colPath = 'worksheets';
  try {
    const colRef = collection(db, colPath);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Worksheet[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Worksheet);
        });
        onData(list);
      },
      (error) => {
        console.error('Worksheets snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
    return () => {};
  }
}

export async function saveWorksheetToFirestore(worksheet: Worksheet): Promise<void> {
  const docPath = `worksheets/${worksheet.id}`;
  try {
    const docRef = doc(db, 'worksheets', worksheet.id);
    const payload = sanitizePayload(worksheet);
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteWorksheetFromFirestore(worksheetId: string): Promise<void> {
  const docPath = `worksheets/${worksheetId}`;
  try {
    const docRef = doc(db, 'worksheets', worksheetId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// Check if database needs initial seeding (only run once if collections are completely empty)
export async function checkAndSeedInitialData(
  initialStudents: Student[],
  initialRecords: TopicRecord[]
): Promise<boolean> {
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    const isFirstTime = localStorage.getItem('aula_patricia_firebase_seeded');
    
    if (studentsSnap.empty && !isFirstTime) {
      console.log('Seeding initial student roster to Firestore...');
      for (const s of initialStudents) {
        await setDoc(doc(db, 'students', s.id), sanitizePayload(s));
      }
      for (const r of initialRecords) {
        await setDoc(doc(db, 'records', r.id), sanitizePayload(r));
      }
      localStorage.setItem('aula_patricia_firebase_seeded', 'true');
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Seeding check failed or already seeded:', err);
    return false;
  }
}
