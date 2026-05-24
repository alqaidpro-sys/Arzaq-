import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocFromServer,
  onSnapshot
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Exact Firebase Web Config provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDavPVw8l0YIrpVEledPh2gMKO-LYLIfOI",
  authDomain: "arzeq-25bfd.firebaseapp.com",
  projectId: "arzeq-25bfd",
  storageBucket: "arzeq-25bfd.firebasestorage.app",
  messagingSenderId: "801723961908",
  appId: "1:801723961908:web:dd86e5288da7f90b317061",
  measurementId: "G-CHEH7NW4B0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

// ── ERROR HANDLING AS INSTRUCTED BY SKILL ──

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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Detailed Object: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ── FIREBASE DB CONNECTION VALIDATION ──
export async function validateFirebaseConnection() {
  try {
    // Using standard getDoc handles deferred connection gracefully without throwing immediate offline errors
    await getDoc(doc(db, 'test_sdk_connection', 'status'));
    console.log("Firebase Connection verified successfully.");
    return true;
  } catch (error) {
    console.log("Firebase warm-up connection deferred.");
    return false;
  }
}
