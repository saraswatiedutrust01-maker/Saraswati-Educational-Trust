import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { count, eq } from 'drizzle-orm';
import { adminAuth } from '../lib/firebase-admin.ts';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';

const OWNER_ADMIN_EMAILS = new Set([
  'saraswatiedutrust01@gmail.com',
  'secratary@saraswatiedutrust.online',
]);

export interface AppUserRecord {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  designation: string | null;
  requestedRole: string | null;
  registrationStatus: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  appUser?: AppUserRecord;
}

export async function syncFirebaseUser(
  uid: string,
  email: string,
  displayName = '',
  emailVerified = false
): Promise<AppUserRecord> {
  const normalizedEmail = email.trim().toLowerCase();
  const isVerifiedOwner = emailVerified && OWNER_ADMIN_EMAILS.has(normalizedEmail);

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.uid, uid))
    .limit(1);

  if (existing.length > 0) {
    const current = existing[0];
    if (isVerifiedOwner && (current.role !== 'admin' || current.registrationStatus !== 'active')) {
      const updated = await db
        .update(users)
        .set({
          role: 'admin',
          registrationStatus: 'active',
          email: normalizedEmail,
          updatedAt: new Date(),
        })
        .where(eq(users.uid, uid))
        .returning();
      return updated[0];
    }
    if (displayName && !current.displayName) {
      const updated = await db
        .update(users)
        .set({ displayName, updatedAt: new Date() })
        .where(eq(users.uid, uid))
        .returning();
      return updated[0];
    }
    return current;
  }

  // Check if a pre-assigned role exists by email (only link when email is verified)
  if (emailVerified && normalizedEmail) {
    const preassigned = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (preassigned.length > 0) {
      const updated = await db
        .update(users)
        .set({
          uid,
          displayName: displayName || preassigned[0].displayName || '',
          registrationStatus: preassigned[0].role === 'viewer' ? 'pending' : 'active',
          updatedAt: new Date(),
        })
        .where(eq(users.id, preassigned[0].id))
        .returning();
      return updated[0];
    }
  }

  // Check if any admin exists yet; bootstrap first verified user or verified Trust owner email
  const adminCountRows = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.role, 'admin'));
  const hasAdmin = Number(adminCountRows[0]?.value ?? 0) > 0;
  const assignedRole =
    isVerifiedOwner || (emailVerified && !hasAdmin) ? 'admin' : 'viewer';
  const registrationStatus = assignedRole === 'admin' ? 'active' : 'pending';

  const inserted = await db
    .insert(users)
    .values({
      uid,
      email: normalizedEmail,
      displayName,
      designation: '',
      requestedRole: 'editor',
      registrationStatus,
      role: assignedRole,
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email: normalizedEmail,
        displayName: displayName || undefined,
        updatedAt: new Date(),
      },
    })
    .returning();

  return inserted[0];
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    const appUser = await syncFirebaseUser(
      decodedToken.uid,
      decodedToken.email || '',
      decodedToken.name || '',
      Boolean(decodedToken.email_verified)
    );
    req.appUser = appUser;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.appUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!req.user?.email_verified) {
      return res.status(403).json({
        error: 'Please verify your email address before accessing administrative tools.',
      });
    }
    if (!allowedRoles.includes(req.appUser.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions for this administrative action',
      });
    }
    next();
  };
};
