import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
];

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
for (const scope of SCOPES) {
  googleAuthProvider.addScope(scope);
}

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

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

const OWNER_ADMIN_EMAILS = new Set([
  'saraswatiedutrust01@gmail.com',
  'secratary@saraswatiedutrust.online',
]);

export async function syncFirestoreUserRecord(params: {
  uid: string;
  email: string;
  displayName: string;
  designation?: string;
  emailVerified: boolean;
}) {
  if (!params.emailVerified) return;
  const userPath = `users/${params.uid}`;
  try {
    const userRef = doc(db, 'users', params.uid);
    const snap = await getDoc(userRef);
    const cleanEmail = params.email.trim().toLowerCase().slice(0, 140);
    const cleanName = params.displayName.trim().slice(0, 120);
    const cleanDesig = (params.designation || '').trim().slice(0, 120);
    const isOwner = OWNER_ADMIN_EMAILS.has(cleanEmail);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: params.uid,
        email: cleanEmail,
        displayName: cleanName,
        designation: cleanDesig,
        role: isOwner ? 'admin' : 'viewer',
        status: isOwner ? 'active' : 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else if (cleanName || cleanDesig) {
      await updateDoc(userRef, {
        displayName: cleanName || snap.data()?.displayName || '',
        designation: cleanDesig || snap.data()?.designation || '',
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export async function submitFirestoreAccessRequest(params: {
  uid: string;
  email: string;
  displayName: string;
  designation: string;
  requestedRole: 'editor' | 'content_manager';
  emailVerified: boolean;
}) {
  if (!params.emailVerified) return;
  const reqPath = `access_requests/${params.uid}`;
  try {
    const reqRef = doc(db, 'access_requests', params.uid);
    const snap = await getDoc(reqRef);
    const cleanEmail = params.email.trim().toLowerCase().slice(0, 140);
    const cleanName = params.displayName.trim().slice(0, 120);
    const cleanDesig = params.designation.trim().slice(0, 120);

    if (!snap.exists()) {
      await setDoc(reqRef, {
        uid: params.uid,
        email: cleanEmail,
        displayName: cleanName,
        designation: cleanDesig,
        requestedRole: params.requestedRole,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else if (snap.data()?.status === 'pending') {
      await updateDoc(reqRef, {
        displayName: cleanName,
        designation: cleanDesig,
        requestedRole: params.requestedRole,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, reqPath);
  }
}

export async function syncAdminRoleToFirestore(params: {
  targetUid: string;
  email: string;
  role: 'admin' | 'editor' | 'content_manager' | 'viewer';
  status: 'active' | 'pending' | 'revoked';
}) {
  if (!params.targetUid || params.targetUid.startsWith('pending-')) return;
  const userPath = `users/${params.targetUid}`;
  try {
    const userRef = doc(db, 'users', params.targetUid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      await updateDoc(userRef, {
        role: params.role,
        status: params.status,
        updatedAt: serverTimestamp(),
      });
    }
    const reqRef = doc(db, 'access_requests', params.targetUid);
    const reqSnap = await getDoc(reqRef);
    if (reqSnap.exists()) {
      await updateDoc(reqRef, {
        status: params.status === 'active' ? 'approved' : 'rejected',
        updatedAt: serverTimestamp(),
      });
    }
    if (params.role === 'admin' && params.status === 'active') {
      await setDoc(doc(db, 'admins', params.targetUid), {
        uid: params.targetUid,
        email: params.email.trim().toLowerCase().slice(0, 140),
        grantedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}
