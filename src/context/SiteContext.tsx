import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  auth,
  googleAuthProvider,
  submitFirestoreAccessRequest,
  syncFirestoreUserRecord,
} from '../lib/firebase';
import { AppUser, BootstrapData } from '../types/cms';

interface SiteContextValue {
  data: BootstrapData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  firebaseUser: User | null;
  appUser: AppUser | null;
  driveAccessToken: string | null;
  authLoading: boolean;
  authError: string | null;
  authNotice: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (params: {
    fullName: string;
    email: string;
    password: string;
    designation: string;
    requestedRole: 'editor' | 'content_manager';
  }) => Promise<void>;
  registerWithGoogle: (params: {
    designation: string;
    requestedRole: 'editor' | 'content_manager';
  }) => Promise<void>;
  submitAccessRequest: (params: {
    fullName: string;
    designation: string;
    requestedRole: 'editor' | 'content_manager';
  }) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshAuthSession: () => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (input: string, init?: RequestInit) => Promise<Response>;
}

const SiteContext = createContext<SiteContextValue | undefined>(undefined);

function mapFirebaseAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not yet enabled in Firebase Console (Authentication → Sign-in method → Email/Password). Use Sign in with Google, or enable Email/Password in Firebase Console.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please use the Staff Sign In tab.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials or use Sign in with Google.';
    case 'auth/weak-password':
      return 'Please choose a stronger password (at least 8 characters).';
    case 'auth/popup-closed-by-user':
      return 'Google Sign-In popup was closed before completion.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes before trying again.';
    default:
      return err instanceof Error ? err.message : 'Authentication failed';
  }
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/public/bootstrap');
      if (!res.ok) {
        throw new Error('Unable to load organization content');
      }
      const json = (await res.json()) as BootstrapData;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load website content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const seo = data?.settings?.seo_settings;
    if (seo?.siteTitle) {
      document.title = seo.siteTitle;
    }
    if (seo?.metaDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', seo.metaDescription);
      }
    }
  }, [data?.settings?.seo_settings]);

  const syncUserSession = useCallback(async (user: User, forceRefresh = false) => {
    const token = await user.getIdToken(forceRefresh);
    setIdToken(token);
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const payload = await res.json();
      setAppUser(payload.user);
      setAuthError(null);
      if (user.emailVerified && user.email) {
        await syncFirestoreUserRecord({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || payload.user?.displayName || '',
          designation: payload.user?.designation || '',
          emailVerified: user.emailVerified,
        }).catch((fsErr) => {
          console.error('Firestore profile sync warning:', fsErr);
        });
      }
    } else {
      const payload = await res.json().catch(() => ({}));
      setAuthError(payload.error || 'Could not verify staff access');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setIdToken(null);
        setDriveAccessToken(null);
        setAppUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        await syncUserSession(user);
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : 'Authentication check failed');
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [syncUserSession]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setAuthNotice(null);
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setDriveAccessToken(credential.accessToken);
      }
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
      setAuthLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    setAuthNotice(null);
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
      setAuthLoading(false);
    }
  }, []);

  const registerWithEmail = useCallback(
    async ({
      fullName,
      email,
      password,
      designation,
      requestedRole,
    }: {
      fullName: string;
      email: string;
      password: string;
      designation: string;
      requestedRole: 'editor' | 'content_manager';
    }) => {
      setAuthError(null);
      setAuthNotice(null);
      setAuthLoading(true);
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: fullName.trim() });
        await sendEmailVerification(cred.user).catch(() => {});
        const token = await cred.user.getIdToken(true);
        setIdToken(token);
        const res = await fetch('/api/auth/register-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            displayName: fullName.trim(),
            designation: designation.trim(),
            requestedRole,
          }),
        });
        if (res.ok) {
          const payload = await res.json();
          setAppUser(payload.user);
        }
        setAuthNotice(
          'Registration submitted. Please verify your email address from the inbox link, then wait for Administrator role approval.'
        );
      } catch (err) {
        setAuthError(mapFirebaseAuthError(err));
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const registerWithGoogle = useCallback(
    async ({
      designation,
      requestedRole,
    }: {
      designation: string;
      requestedRole: 'editor' | 'content_manager';
    }) => {
      setAuthError(null);
      setAuthNotice(null);
      setAuthLoading(true);
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          setDriveAccessToken(credential.accessToken);
        }
        const token = await result.user.getIdToken(true);
        setIdToken(token);
        const fullName = result.user.displayName || result.user.email || 'Trust Staff';
        const res = await fetch('/api/auth/register-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            displayName: fullName,
            designation: designation.trim() || 'Programmes & Operations',
            requestedRole,
          }),
        });
        if (res.ok) {
          const payload = await res.json();
          setAppUser(payload.user);
          if (result.user.emailVerified && result.user.email) {
            await syncFirestoreUserRecord({
              uid: result.user.uid,
              email: result.user.email,
              displayName: fullName,
              designation: designation.trim() || 'Programmes & Operations',
              emailVerified: result.user.emailVerified,
            }).catch(() => {});
            if (payload.user?.role === 'viewer') {
              await submitFirestoreAccessRequest({
                uid: result.user.uid,
                email: result.user.email,
                displayName: fullName,
                designation: designation.trim() || 'Programmes & Operations',
                requestedRole,
                emailVerified: result.user.emailVerified,
              }).catch(() => {});
            }
          }
        }
        setAuthNotice('Google registration recorded. Pending Administrator role review if not pre-authorized.');
      } catch (err) {
        setAuthError(mapFirebaseAuthError(err));
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const submitAccessRequest = useCallback(
    async ({
      fullName,
      designation,
      requestedRole,
    }: {
      fullName: string;
      designation: string;
      requestedRole: 'editor' | 'content_manager';
    }) => {
      if (!firebaseUser) return;
      setAuthError(null);
      const token = await firebaseUser.getIdToken();
      const res = await fetch('/api/auth/register-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: fullName.trim(),
          designation: designation.trim(),
          requestedRole,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || 'Could not update registration profile');
      }
      setAppUser(json.user);
      if (firebaseUser.emailVerified && firebaseUser.email) {
        await submitFirestoreAccessRequest({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: fullName.trim(),
          designation: designation.trim(),
          requestedRole,
          emailVerified: firebaseUser.emailVerified,
        }).catch(() => {});
      }
      setAuthNotice('Your staff access request has been sent to the Trust Administrator.');
    },
    [firebaseUser]
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    setAuthError(null);
    setAuthNotice(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setAuthNotice(`Password reset instructions sent to ${email.trim()}.`);
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
    }
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    if (!auth.currentUser) return;
    setAuthError(null);
    try {
      await sendEmailVerification(auth.currentUser);
      setAuthNotice(`Verification email sent to ${auth.currentUser.email}.`);
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
    }
  }, []);

  const refreshAuthSession = useCallback(async () => {
    if (!auth.currentUser) return;
    setAuthLoading(true);
    try {
      await auth.currentUser.reload();
      const refreshedUser = auth.currentUser;
      setFirebaseUser(refreshedUser);
      if (refreshedUser) {
        await syncUserSession(refreshedUser, true);
      }
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setAuthLoading(false);
    }
  }, [syncUserSession]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setIdToken(null);
    setDriveAccessToken(null);
    setAppUser(null);
    setAuthError(null);
    setAuthNotice(null);
  }, []);

  const authFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      let token = idToken;
      if (firebaseUser) {
        token = await firebaseUser.getIdToken();
        setIdToken(token);
      }
      const headers = new Headers(init.headers);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return fetch(input, { ...init, headers });
    },
    [firebaseUser, idToken]
  );

  return (
    <SiteContext.Provider
      value={{
        data,
        loading,
        error,
        refreshData,
        firebaseUser,
        appUser,
        driveAccessToken,
        authLoading,
        authError,
        authNotice,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        registerWithGoogle,
        submitAccessRequest,
        sendPasswordReset,
        resendVerificationEmail,
        refreshAuthSession,
        logout,
        authFetch,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used inside SiteProvider');
  }
  return ctx;
}
