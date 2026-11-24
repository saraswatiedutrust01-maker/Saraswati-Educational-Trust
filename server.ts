import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { asc, desc, eq } from 'drizzle-orm';
import { db } from './src/db/index.ts';
import {
  activities,
  donations,
  enquiries,
  focusAreas,
  galleryItems,
  impactStats,
  newsletterSubscribers,
  partners,
  programmes,
  projects,
  resources,
  siteSettings,
  stories,
  teamMembers,
  users,
} from './src/db/schema.ts';
import { ensureSeeded } from './src/db/seed.ts';
import { AuthRequest, requireAuth, requireRole } from './src/middleware/auth.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.use(express.json({ limit: '4mb' }));

// Secure upload directory outside src/
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext) ? ext : '';
      const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP images and PDF documents are permitted.'));
    }
  },
});

// Serve uploaded files safely with path-traversal confinement
app.get('/uploads/:filename', (req: Request, res: Response) => {
  const requested = String(req.params.filename || '').replace(/[^a-zA-Z0-9._-]/g, '');
  if (!requested) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  const resolved = path.resolve(uploadsDir, requested);
  if (!resolved.startsWith(uploadsDir + path.sep)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  if (!fs.existsSync(resolved)) {
    return res.status(404).json({ error: 'File not found' });
  }
  return res.sendFile(resolved);
});

// SEO: Robots & Sitemap
app.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${baseUrl}/sitemap.xml\n`
  );
});

app.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const [progRows, projRows, storyRows] = await Promise.all([
      db.select({ slug: programmes.slug }).from(programmes).where(eq(programmes.isPublished, true)),
      db.select({ slug: projects.slug }).from(projects).where(eq(projects.isPublished, true)),
      db.select({ slug: stories.slug }).from(stories).where(eq(stories.isPublished, true)),
    ]);

    const staticPaths = [
      '/',
      '/about',
      '/about/profile',
      '/about/vision-mission',
      '/about/objectives',
      '/about/focus-areas',
      '/about/approach',
      '/about/coverage',
      '/about/governing-body',
      '/about/team',
      '/about/secretary-message',
      '/about/challenges',
      '/focus-areas',
      '/programmes',
      '/projects',
      '/impact',
      '/stories',
      '/activities',
      '/gallery',
      '/resources',
      '/get-involved',
      '/donate',
      '/contact',
    ];

    const urls = [
      ...staticPaths,
      ...progRows.map((p) => `/programmes/${p.slug}`),
      ...projRows.map((p) => `/projects/${p.slug}`),
      ...storyRows.map((s) => `/stories/${s.slug}`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${baseUrl}${u}</loc></url>`)
      .join('\n')}\n</urlset>`;

    res.type('application/xml').send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Unable to generate sitemap');
  }
});

// ========================
// PUBLIC API ROUTES
// ========================

app.get('/api/public/bootstrap', async (_req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const [
      settingsRows,
      statsRows,
      focusRows,
      progRows,
      projRows,
      storyRows,
      activityRows,
      galleryRows,
      resourceRows,
      teamRows,
      partnerRows,
    ] = await Promise.all([
      db.select().from(siteSettings),
      db.select().from(impactStats).orderBy(asc(impactStats.sortOrder)),
      db.select().from(focusAreas).where(eq(focusAreas.isPublished, true)).orderBy(asc(focusAreas.sortOrder)),
      db.select().from(programmes).where(eq(programmes.isPublished, true)).orderBy(asc(programmes.id)),
      db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(desc(projects.id)),
      db.select().from(stories).where(eq(stories.isPublished, true)).orderBy(desc(stories.id)),
      db.select().from(activities).where(eq(activities.isPublished, true)).orderBy(desc(activities.id)),
      db.select().from(galleryItems).orderBy(desc(galleryItems.id)),
      db.select().from(resources).orderBy(asc(resources.id)),
      db.select().from(teamMembers).where(eq(teamMembers.isPublished, true)).orderBy(asc(teamMembers.sortOrder)),
      db.select().from(partners).where(eq(partners.isPublished, true)).orderBy(desc(partners.id)),
    ]);

    const settings: Record<string, unknown> = {};
    for (const row of settingsRows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }

    // Mask non-public resource file URLs on public API
    const publicResources = resourceRows
      .filter((r) => r.accessLevel !== 'admin_only')
      .map((r) => ({
        ...r,
        fileUrl: r.isPublic ? r.fileUrl : '',
      }));

    res.json({
      settings,
      impactStats: statsRows,
      focusAreas: focusRows,
      programmes: progRows,
      projects: projRows,
      stories: storyRows,
      activities: activityRows,
      gallery: galleryRows,
      resources: publicResources,
      teamMembers: teamRows,
      partners: partnerRows,
    });
  } catch (error) {
    console.error('Bootstrap fetch error:', error);
    res.status(500).json({ error: 'Unable to load website content at this moment.' });
  }
});

function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function sanitizeMediaOrLinkUrl(val: unknown): string {
  const s = String(val || '').trim();
  if (!s) return '';
  if (s.startsWith('/uploads/') || s.startsWith('/src/assets/') || s.startsWith('/assets/')) {
    return s;
  }
  return isSafeHttpUrl(s) ? s : '';
}

function parsePositiveId(raw: unknown): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Public resource download gate
app.get('/api/public/resources/:id/download', async (req: Request, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    const rows = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
    const doc = rows[0];
    if (!doc || !doc.isPublic || !doc.fileUrl) {
      return res.status(403).json({
        error: 'This document is not enabled for public download. Please request access via our Contact or CSR Collaboration form.',
      });
    }
    if (doc.fileUrl.startsWith('/uploads/')) {
      const filename = path.basename(doc.fileUrl);
      const resolved = path.resolve(uploadsDir, filename);
      if (!resolved.startsWith(uploadsDir + path.sep) || !fs.existsSync(resolved)) {
        return res.status(404).json({ error: 'Document file unavailable' });
      }
      return res.download(resolved, doc.fileName || filename);
    }
    if (!isSafeHttpUrl(doc.fileUrl)) {
      return res.status(400).json({ error: 'Invalid external document URL' });
    }
    return res.redirect(doc.fileUrl);
  } catch (error) {
    console.error('Resource download error:', error);
    res.status(500).json({ error: 'Failed to process document download' });
  }
});

// Submit Enquiry (Contact / Volunteer / Career / Internship / Partnership / CSR / Institutional / Donor)
app.post('/api/public/enquiries', async (req: Request, res: Response) => {
  try {
    const {
      enquiryType = 'contact',
      fullName,
      email,
      phone,
      organization = '',
      subject = '',
      message,
      websiteHoneypot = '',
    } = req.body || {};

    // Silent spam honeypot trap
    if (typeof websiteHoneypot === 'string' && websiteHoneypot.trim().length > 0) {
      return res.status(201).json({ ok: true, id: 0 });
    }

    if (
      typeof fullName !== 'string' ||
      fullName.trim().length < 2 ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof phone !== 'string' ||
      phone.trim().length < 7 ||
      typeof message !== 'string' ||
      message.trim().length < 10
    ) {
      return res.status(400).json({
        error: 'Please provide a valid name, email address, contact number, and message (at least 10 characters).',
      });
    }

    const allowedTypes = new Set([
      'contact',
      'volunteer',
      'career',
      'internship',
      'partnership',
      'csr',
      'institutional',
      'donor_enquiry',
    ]);
    const cleanType = allowedTypes.has(String(enquiryType)) ? String(enquiryType) : 'contact';

    const inserted = await db
      .insert(enquiries)
      .values({
        enquiryType: cleanType,
        fullName: fullName.trim().slice(0, 140),
        email: email.trim().toLowerCase().slice(0, 140),
        phone: phone.trim().slice(0, 30),
        organization: String(organization || '').trim().slice(0, 160),
        subject: String(subject || '').trim().slice(0, 200),
        message: message.trim().slice(0, 4000),
        status: 'new',
      })
      .returning();

    res.status(201).json({ ok: true, id: inserted[0].id });
  } catch (error) {
    console.error('Enquiry creation error:', error);
    res.status(500).json({ error: 'Unable to submit your enquiry. Please try again.' });
  }
});

// Submit Donation & Generate Acknowledgement / Conditional 80G Receipt
app.post('/api/public/donations', async (req: Request, res: Response) => {
  try {
    const {
      donorName,
      email,
      phone,
      panNumber = '',
      address = '',
      amountInr,
      purpose,
      paymentMethod,
      paymentReference = '',
      websiteHoneypot = '',
    } = req.body || {};

    if (typeof websiteHoneypot === 'string' && websiteHoneypot.trim().length > 0) {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    const amount = Number(amountInr);
    if (!Number.isFinite(amount) || amount < 100 || amount > 10000000) {
      return res.status(400).json({ error: 'Please enter a valid donation amount (minimum ₹100).' });
    }

    if (
      typeof donorName !== 'string' ||
      donorName.trim().length < 2 ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof phone !== 'string' ||
      phone.trim().length < 7
    ) {
      return res.status(400).json({ error: 'Please provide valid donor name, email, and contact number.' });
    }

    const cleanPan = String(panNumber || '').trim().toUpperCase();
    const cleanAddress = String(address || '').trim();
    const isValidPan = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanPan);
    const allowedMethods = new Set(['UPI', 'Card', 'Net Banking', 'Bank Transfer (NEFT/RTGS)']);
    const cleanMethod = allowedMethods.has(String(paymentMethod)) ? String(paymentMethod) : 'UPI';

    // 80G eligibility requires valid Indian PAN, complete address, and traceable banking/digital mode
    const meets80gCriteria =
      isValidPan &&
      cleanAddress.length >= 10 &&
      String(paymentReference || '').trim().length >= 4;

    const receiptNumber = `SET-${new Date().getFullYear()}-${crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()}`;

    const hasRef = String(paymentReference || '').trim().length >= 4;

    const inserted = await db
      .insert(donations)
      .values({
        receiptNumber,
        donorName: donorName.trim().slice(0, 140),
        email: email.trim().toLowerCase().slice(0, 140),
        phone: phone.trim().slice(0, 30),
        panNumber: isValidPan ? cleanPan : '',
        address: cleanAddress.slice(0, 400),
        amountInr: Math.round(amount),
        purpose: String(purpose || 'General Charitable Corpus').trim().slice(0, 180),
        paymentMethod: cleanMethod,
        paymentReference: String(paymentReference || '').trim().slice(0, 120),
        eligible80g: meets80gCriteria,
        status: hasRef ? 'acknowledged' : 'pending_verification',
      })
      .returning();

    res.status(201).json({ donation: inserted[0] });
  } catch (error) {
    console.error('Donation submission error:', error);
    res.status(500).json({ error: 'Unable to record donation details. Please try again.' });
  }
});

app.get('/api/public/donations/:receiptNumber', async (req: Request, res: Response) => {
  try {
    const receiptNo = String(req.params.receiptNumber || '').trim().toUpperCase();
    const rows = await db
      .select()
      .from(donations)
      .where(eq(donations.receiptNumber, receiptNo))
      .limit(1);

    if (!rows.length) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    const d = rows[0];
    res.json({
      donation: {
        receiptNumber: d.receiptNumber,
        donorName: d.donorName,
        amountInr: d.amountInr,
        purpose: d.purpose,
        paymentMethod: d.paymentMethod,
        paymentReference: d.paymentReference,
        eligible80g: d.eligible80g,
        status: d.status,
        panProvided: Boolean(d.panNumber),
        createdAt: d.createdAt,
      },
    });
  } catch (error) {
    console.error('Receipt lookup error:', error);
    res.status(500).json({ error: 'Unable to fetch receipt' });
  }
});

app.post('/api/public/newsletter', async (req: Request, res: Response) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    await db
      .insert(newsletterSubscribers)
      .values({ email })
      .onConflictDoNothing({ target: newsletterSubscribers.email });
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Unable to subscribe at this time.' });
  }
});

// ========================
// AUTHENTICATED ADMIN & CMS ROUTES
// ========================

const CMS_STAFF = ['admin', 'editor', 'content_manager'];
const CMS_EDITORS = ['admin', 'editor'];
const CMS_ADMINS = ['admin'];

app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
  res.json({ user: req.appUser });
});

app.post('/api/auth/register-profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.appUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const displayName = String(req.body?.displayName || '').trim().slice(0, 120);
    const designation = String(req.body?.designation || '').trim().slice(0, 120);
    const requestedRaw = String(req.body?.requestedRole || 'editor');
    const requestedRole = requestedRaw === 'content_manager' ? 'content_manager' : 'editor';

    if (displayName.length < 2 || designation.length < 2) {
      return res.status(400).json({
        error: 'Please enter your full name and Trust designation / department.',
      });
    }

    const updated = await db
      .update(users)
      .set({
        displayName,
        designation,
        requestedRole,
        registrationStatus: req.appUser.role === 'viewer' ? 'pending' : 'active',
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.appUser.id))
      .returning();

    res.json({ user: updated[0] });
  } catch (error) {
    console.error('Register profile error:', error);
    res.status(500).json({ error: 'Failed to save staff registration profile' });
  }
});

// Full CMS overview payload
app.get(
  '/api/admin/overview',
  requireAuth,
  requireRole(CMS_STAFF),
  async (req: AuthRequest, res: Response) => {
    try {
      await ensureSeeded();
      const isAdmin = req.appUser?.role === 'admin';
      const isEditor = isAdmin || req.appUser?.role === 'editor';

      const [
        settingsRows,
        statsRows,
        focusRows,
        progRows,
        projRows,
        storyRows,
        activityRows,
        galleryRows,
        resourceRows,
        teamRows,
        partnerRows,
        enquiryRows,
        donationRows,
        userRows,
      ] = await Promise.all([
        db.select().from(siteSettings),
        db.select().from(impactStats).orderBy(asc(impactStats.sortOrder)),
        db.select().from(focusAreas).orderBy(asc(focusAreas.sortOrder)),
        db.select().from(programmes).orderBy(asc(programmes.id)),
        db.select().from(projects).orderBy(desc(projects.id)),
        db.select().from(stories).orderBy(desc(stories.id)),
        db.select().from(activities).orderBy(desc(activities.id)),
        db.select().from(galleryItems).orderBy(desc(galleryItems.id)),
        db.select().from(resources).orderBy(asc(resources.id)),
        db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder)),
        db.select().from(partners).orderBy(desc(partners.id)),
        isEditor ? db.select().from(enquiries).orderBy(desc(enquiries.createdAt)) : Promise.resolve([]),
        isAdmin ? db.select().from(donations).orderBy(desc(donations.createdAt)) : Promise.resolve([]),
        isAdmin ? db.select().from(users).orderBy(asc(users.id)) : Promise.resolve([]),
      ]);

      const settings: Record<string, unknown> = {};
      for (const row of settingsRows) {
        try {
          settings[row.key] = JSON.parse(row.value);
        } catch {
          settings[row.key] = row.value;
        }
      }

      res.json({
        settings,
        impactStats: statsRows,
        focusAreas: focusRows,
        programmes: progRows,
        projects: projRows,
        stories: storyRows,
        activities: activityRows,
        gallery: galleryRows,
        resources: resourceRows,
        teamMembers: teamRows,
        partners: partnerRows,
        enquiries: enquiryRows,
        donations: donationRows,
        users: userRows,
      });
    } catch (error) {
      console.error('Admin overview error:', error);
      res.status(500).json({ error: 'Unable to load CMS data.' });
    }
  }
);

// File upload endpoint
app.post(
  '/api/admin/upload',
  requireAuth,
  requireRole(CMS_STAFF),
  (req: AuthRequest, res: Response) => {
    upload.single('file')(req, res, (err: unknown) => {
      if (err) {
        const message = err instanceof Error ? err.message : 'File upload failed';
        return res.status(400).json({ error: message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file attached' });
      }
      return res.json({
        fileUrl: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
      });
    });
  }
);

// Site Settings (Hero, About, Contact, SEO)
app.put(
  '/api/admin/settings/:key',
  requireAuth,
  requireRole(CMS_EDITORS),
  async (req: AuthRequest, res: Response) => {
    try {
      const key = String(req.params.key);
      const allowed = new Set(['hero_slides', 'about_sections', 'contact_info', 'seo_settings']);
      if (!allowed.has(key)) {
        return res.status(400).json({ error: 'Unknown setting key' });
      }
      const serialized = JSON.stringify(req.body.value);
      const updated = await db
        .insert(siteSettings)
        .values({ key, value: serialized, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: serialized, updatedAt: new Date() },
        })
        .returning();
      res.json({ setting: updated[0] });
    } catch (error) {
      console.error('Update setting error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }
);

// Impact Stats update
app.put(
  '/api/admin/impact-stats/:id',
  requireAuth,
  requireRole(CMS_EDITORS),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parsePositiveId(req.params.id);
      if (!id) return res.status(400).json({ error: 'Invalid stat ID' });
      const value = Math.max(0, Math.round(Number(req.body.value) || 0));
      const unit = String(req.body.unit ?? '');
      const verificationNote = String(req.body.verificationNote ?? 'Organizational Records');

      const updated = await db
        .update(impactStats)
        .set({ value, unit, verificationNote, updatedAt: new Date() })
        .where(eq(impactStats.id, id))
        .returning();
      res.json({ stat: updated[0] });
    } catch (error) {
      console.error('Update impact stat error:', error);
      res.status(500).json({ error: 'Failed to update impact statistic' });
    }
  }
);

// Focus Areas update
app.put(
  '/api/admin/focus-areas/:id',
  requireAuth,
  requireRole(CMS_STAFF),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parsePositiveId(req.params.id);
      if (!id) return res.status(400).json({ error: 'Invalid focus area ID' });
      const { title, shortDescription, fullDescription, imageUrl, isPublished } = req.body;
      const updated = await db
        .update(focusAreas)
        .set({
          title,
          shortDescription,
          fullDescription,
          imageUrl: sanitizeMediaOrLinkUrl(imageUrl),
          isPublished,
        })
        .where(eq(focusAreas.id, id))
        .returning();
      res.json({ focusArea: updated[0] });
    } catch (error) {
      console.error('Update focus area error:', error);
      res.status(500).json({ error: 'Failed to update focus area' });
    }
  }
);

// Programmes CRUD
app.post('/api/admin/programmes', requireAuth, requireRole(CMS_STAFF), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const slug =
      String(b.slug || b.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      crypto.randomBytes(2).toString('hex');
    const created = await db
      .insert(programmes)
      .values({
        slug,
        title: String(b.title),
        focusAreaSlug: String(b.focusAreaSlug || 'education-and-child-development'),
        location: String(b.location || 'Rayagada, Odisha'),
        beneficiaries: String(b.beneficiaries || ''),
        objectives: String(b.objectives || ''),
        activities: String(b.activities || ''),
        outcomes: String(b.outcomes || ''),
        imageUrl: sanitizeMediaOrLinkUrl(b.imageUrl) || '/src/assets/images/hero_tribal_education_odisha_1795521868080.jpg',
        isFeatured: Boolean(b.isFeatured ?? true),
        isPublished: Boolean(b.isPublished ?? true),
      })
      .returning();
    res.status(201).json({ programme: created[0] });
  } catch (error) {
    console.error('Create programme error:', error);
    res.status(500).json({ error: 'Failed to create programme' });
  }
});

app.put('/api/admin/programmes/:id', requireAuth, requireRole(CMS_STAFF), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid programme ID' });
    const b = req.body;
    const updated = await db
      .update(programmes)
      .set({
        title: b.title,
        focusAreaSlug: b.focusAreaSlug,
        location: b.location,
        beneficiaries: b.beneficiaries,
        objectives: b.objectives,
        activities: b.activities,
        outcomes: b.outcomes,
        imageUrl: sanitizeMediaOrLinkUrl(b.imageUrl),
        isFeatured: b.isFeatured,
        isPublished: b.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(programmes.id, id))
      .returning();
    res.json({ programme: updated[0] });
  } catch (error) {
    console.error('Update programme error:', error);
    res.status(500).json({ error: 'Failed to update programme' });
  }
});

app.delete('/api/admin/programmes/:id', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid programme ID' });
    await db.delete(programmes).where(eq(programmes.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete programme error:', error);
    res.status(500).json({ error: 'Failed to delete programme' });
  }
});

// Projects CRUD
app.post('/api/admin/projects', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const slug =
      String(b.title || 'project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      crypto.randomBytes(2).toString('hex');
    const created = await db
      .insert(projects)
      .values({
        slug,
        title: String(b.title),
        category: String(b.category || 'Education'),
        location: String(b.location || 'Rayagada, Odisha'),
        duration: String(b.duration || 'Ongoing'),
        status: String(b.status || 'Active'),
        targetBeneficiaries: String(b.targetBeneficiaries || ''),
        overview: String(b.overview || ''),
        problemStatement: String(b.problemStatement || ''),
        objectives: String(b.objectives || ''),
        activities: String(b.activities || ''),
        outputsOutcomes: String(b.outputsOutcomes || ''),
        budgetDisclosed: String(b.budgetDisclosed || 'Available on CSR / Donor Request'),
        imageUrl: sanitizeMediaOrLinkUrl(b.imageUrl) || '/src/assets/images/hero_tribal_education_odisha_1795521868080.jpg',
        reportFileUrl: sanitizeMediaOrLinkUrl(b.reportFileUrl),
        donorDocumentUrl: sanitizeMediaOrLinkUrl(b.donorDocumentUrl),
        isFeatured: Boolean(b.isFeatured ?? true),
        isPublished: Boolean(b.isPublished ?? true),
      })
      .returning();
    res.status(201).json({ project: created[0] });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/admin/projects/:id', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid project ID' });
    const b = req.body;
    const updated = await db
      .update(projects)
      .set({
        title: b.title,
        category: b.category,
        location: b.location,
        duration: b.duration,
        status: b.status,
        targetBeneficiaries: b.targetBeneficiaries,
        overview: b.overview,
        problemStatement: b.problemStatement,
        objectives: b.objectives,
        activities: b.activities,
        outputsOutcomes: b.outputsOutcomes,
        budgetDisclosed: b.budgetDisclosed,
        imageUrl: sanitizeMediaOrLinkUrl(b.imageUrl),
        reportFileUrl: sanitizeMediaOrLinkUrl(b.reportFileUrl),
        donorDocumentUrl: sanitizeMediaOrLinkUrl(b.donorDocumentUrl),
        isFeatured: b.isFeatured,
        isPublished: b.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    res.json({ project: updated[0] });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/admin/projects/:id', requireAuth, requireRole(CMS_ADMINS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid project ID' });
    await db.delete(projects).where(eq(projects.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Stories CRUD
app.post('/api/admin/stories', requireAuth, requireRole(CMS_STAFF), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const slug =
      String(b.title || 'story')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      crypto.randomBytes(2).toString('hex');
    const created = await db
      .insert(stories)
      .values({
        slug,
        title: String(b.title),
        category: String(b.category || 'Student Success'),
        subjectTitle: String(b.subjectTitle || ''),
        location: String(b.location || 'Rayagada, Odisha'),
        summary: String(b.summary || ''),
        content: String(b.content || ''),
        imageUrl: sanitizeMediaOrLinkUrl(b.imageUrl),
        videoUrl: sanitizeMediaOrLinkUrl(b.videoUrl),
        isPublished: Boolean(b.isPublished ?? true),
      })
      .returning();
    res.status(201).json({ story: created[0] });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Failed to publish story' });
  }
});

app.delete('/api/admin/stories/:id', requireAuth, requireRole(CMS_STAFF), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid story ID' });
    await db.delete(stories).where(eq(stories.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// Activities & Events CRUD
app.post('/api/admin/activities', requireAuth, requireRole(CMS_STAFF), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const created = await db
      .insert(activities)
      .values({
        title: String(b.title),
        eventDate: String(b.eventDate || ''),
        location: String(b.location || 'Rayagada, Odisha'),
        category: String(b.category || 'Community Programme'),
        description: String(b.description || ''),
        imageUrl: sanitizeMediaOrLinkUrl(b.imageUrl),
        isPublished: Boolean(b.isPublished ?? true),
      })
      .returning();
    res.status(201).json({ activity: created[0] });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

app.delete('/api/admin/activities/:id', requireAuth, requireRole(CMS_STAFF), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid activity ID' });
    await db.delete(activities).where(eq(activities.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// Gallery CRUD
app.post('/api/admin/gallery', requireAuth, requireRole(CMS_STAFF), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const safeUrl = sanitizeMediaOrLinkUrl(b.mediaUrl);
    if (!safeUrl) {
      return res.status(400).json({ error: 'Valid media URL or uploaded file path is required' });
    }
    const created = await db
      .insert(galleryItems)
      .values({
        title: String(b.title),
        category: String(b.category || 'Education'),
        mediaType: String(b.mediaType || 'photo'),
        mediaUrl: safeUrl,
        caption: String(b.caption || ''),
      })
      .returning();
    res.status(201).json({ item: created[0] });
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

app.delete('/api/admin/gallery/:id', requireAuth, requireRole(CMS_STAFF), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid gallery item ID' });
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// Resources & Legal Documents CRUD
app.post('/api/admin/resources', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const created = await db
      .insert(resources)
      .values({
        title: String(b.title),
        category: String(b.category || 'Annual Reports'),
        documentNumber: String(b.documentNumber || ''),
        description: String(b.description || ''),
        fileUrl: sanitizeMediaOrLinkUrl(b.fileUrl),
        fileName: String(b.fileName || ''),
        isPublic: Boolean(b.isPublic ?? false),
        accessLevel: String(b.accessLevel || 'public'),
      })
      .returning();
    res.status(201).json({ resource: created[0] });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Failed to create document record' });
  }
});

app.put('/api/admin/resources/:id', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid document ID' });
    const b = req.body;
    const updated = await db
      .update(resources)
      .set({
        title: b.title,
        category: b.category,
        documentNumber: b.documentNumber,
        description: b.description,
        fileUrl: sanitizeMediaOrLinkUrl(b.fileUrl),
        fileName: b.fileName,
        isPublic: b.isPublic,
        accessLevel: b.accessLevel,
      })
      .where(eq(resources.id, id))
      .returning();
    res.json({ resource: updated[0] });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Failed to update document record' });
  }
});

app.delete('/api/admin/resources/:id', requireAuth, requireRole(CMS_ADMINS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid document ID' });
    await db.delete(resources).where(eq(resources.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Failed to delete document record' });
  }
});

// Governing Body & Team CRUD
app.post('/api/admin/team', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const created = await db
      .insert(teamMembers)
      .values({
        name: String(b.name),
        designation: String(b.designation),
        groupType: String(b.groupType || 'governing_body'),
        bio: String(b.bio || ''),
        photoUrl: sanitizeMediaOrLinkUrl(b.photoUrl),
        sortOrder: Number(b.sortOrder) || 0,
        isPublished: Boolean(b.isPublished ?? true),
      })
      .returning();
    res.status(201).json({ member: created[0] });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Failed to add profile' });
  }
});

app.delete('/api/admin/team/:id', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid team member ID' });
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

// Partners CRUD
app.post('/api/admin/partners', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const created = await db
      .insert(partners)
      .values({
        name: String(b.name),
        partnerType: String(b.partnerType || 'CSR'),
        websiteUrl: sanitizeMediaOrLinkUrl(b.websiteUrl),
        logoUrl: sanitizeMediaOrLinkUrl(b.logoUrl),
        description: String(b.description || ''),
        isPublished: Boolean(b.isPublished ?? true),
      })
      .returning();
    res.status(201).json({ partner: created[0] });
  } catch (error) {
    console.error('Create partner error:', error);
    res.status(500).json({ error: 'Failed to add partner' });
  }
});

app.delete('/api/admin/partners/:id', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid partner ID' });
    await db.delete(partners).where(eq(partners.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete partner error:', error);
    res.status(500).json({ error: 'Failed to remove partner' });
  }
});

// Enquiries status update
app.put('/api/admin/enquiries/:id', requireAuth, requireRole(CMS_EDITORS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid enquiry ID' });
    const updated = await db
      .update(enquiries)
      .set({ status: String(req.body.status || 'reviewed') })
      .where(eq(enquiries.id, id))
      .returning();
    res.json({ enquiry: updated[0] });
  } catch (error) {
    console.error('Update enquiry error:', error);
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

// Donations verification (Admin only)
app.put('/api/admin/donations/:id', requireAuth, requireRole(CMS_ADMINS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid donation ID' });
    const existingRows = await db.select().from(donations).where(eq(donations.id, id)).limit(1);
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    const current = existingRows[0];
    const requestedStatus = String(req.body.status || current.status);
    // Strict 80G compliance check before enabling 80G flag
    const panValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(current.panNumber || '');
    const addressValid = (current.address || '').trim().length >= 10;
    const requested80g = Boolean(req.body.eligible80g);
    if (requested80g && (!panValid || !addressValid)) {
      return res.status(400).json({
        error: '80G certificate cannot be issued without valid donor PAN and residential address.',
      });
    }

    const updated = await db
      .update(donations)
      .set({
        status: requestedStatus,
        eligible80g: requested80g && panValid && addressValid,
      })
      .where(eq(donations.id, id))
      .returning();
    res.json({ donation: updated[0] });
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({ error: 'Failed to update donation verification' });
  }
});

// User Roles management (Admin only)
app.post('/api/admin/users', requireAuth, requireRole(CMS_ADMINS), async (req: AuthRequest, res: Response) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const role = String(req.body.role || 'editor');
    const displayName = String(req.body.displayName || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!['admin', 'editor', 'content_manager', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const nextStatus = role === 'viewer' ? 'revoked' : 'active';
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      const updated = await db
        .update(users)
        .set({
          role,
          registrationStatus: nextStatus,
          displayName: displayName || existing[0].displayName,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing[0].id))
        .returning();
      return res.json({ user: updated[0] });
    }

    const inserted = await db
      .insert(users)
      .values({
        uid: `pending-${crypto.randomBytes(6).toString('hex')}`,
        email,
        displayName,
        designation: '',
        requestedRole: role === 'content_manager' ? 'content_manager' : 'editor',
        registrationStatus: nextStatus,
        role,
      })
      .returning();
    res.status(201).json({ user: inserted[0] });
  } catch (error) {
    console.error('Assign user role error:', error);
    res.status(500).json({ error: 'Failed to assign user role' });
  }
});

app.put('/api/admin/users/:id', requireAuth, requireRole(CMS_ADMINS), async (req: AuthRequest, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid user ID' });
    const role = String(req.body.role || 'viewer');
    if (!['admin', 'editor', 'content_manager', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (id === req.appUser?.id && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own Administrator role.' });
    }
    const nextStatus = role === 'viewer' ? 'revoked' : 'active';
    const updated = await db
      .update(users)
      .set({ role, registrationStatus: nextStatus, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    res.json({ user: updated[0] });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// JSON 404 fallback for unmatched API routes
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Saraswati Educational Trust server running on port ${PORT}`);
  });
}

startServer();
