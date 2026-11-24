import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name').default(''),
  designation: text('designation').default(''),
  requestedRole: text('requested_role').default('editor'),
  registrationStatus: text('registration_status').notNull().default('pending'), // 'active' | 'pending' | 'revoked'
  role: text('role').notNull().default('viewer'), // 'admin' | 'editor' | 'content_manager' | 'viewer'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(), // JSON serialized payload
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const impactStats = pgTable('impact_stats', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  label: text('label').notNull(),
  value: integer('value').notNull().default(0),
  unit: text('unit').default(''),
  verificationNote: text('verification_note').default('Organizational Records'),
  sortOrder: integer('sort_order').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const focusAreas = pgTable('focus_areas', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  imageUrl: text('image_url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
});

export const programmes = pgTable('programmes', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  focusAreaSlug: text('focus_area_slug').default('education-and-child-development'),
  location: text('location').notNull(),
  beneficiaries: text('beneficiaries').notNull(),
  objectives: text('objectives').notNull(),
  activities: text('activities').notNull(),
  outcomes: text('outcomes').notNull(),
  imageUrl: text('image_url').notNull(),
  isFeatured: boolean('is_featured').notNull().default(true),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  duration: text('duration').notNull(),
  status: text('status').notNull().default('Active'),
  targetBeneficiaries: text('target_beneficiaries').notNull(),
  overview: text('overview').notNull(),
  problemStatement: text('problem_statement').notNull(),
  objectives: text('objectives').notNull(),
  activities: text('activities').notNull(),
  outputsOutcomes: text('outputs_outcomes').notNull(),
  budgetDisclosed: text('budget_disclosed').default('Available on CSR / Donor Request'),
  imageUrl: text('image_url').notNull(),
  reportFileUrl: text('report_file_url').default(''),
  donorDocumentUrl: text('donor_document_url').default(''),
  isFeatured: boolean('is_featured').notNull().default(true),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const stories = pgTable('stories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  subjectTitle: text('subject_title').notNull(),
  location: text('location').notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url').default(''),
  videoUrl: text('video_url').default(''),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  eventDate: text('event_date').notNull(),
  location: text('location').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').default(''),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  mediaType: text('media_type').notNull().default('photo'), // 'photo' | 'video'
  mediaUrl: text('media_url').notNull(),
  caption: text('caption').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  documentNumber: text('document_number').default(''),
  description: text('description').notNull(),
  fileUrl: text('file_url').default(''),
  fileName: text('file_name').default(''),
  isPublic: boolean('is_public').notNull().default(false),
  accessLevel: text('access_level').notNull().default('public'), // 'public' | 'csr_request' | 'admin_only'
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  designation: text('designation').notNull(),
  groupType: text('group_type').notNull().default('governing_body'), // 'governing_body' | 'team'
  bio: text('bio').default(''),
  photoUrl: text('photo_url').default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
});

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  partnerType: text('partner_type').notNull().default('CSR'), // 'Donor' | 'CSR' | 'Institutional' | 'Government'
  websiteUrl: text('website_url').default(''),
  logoUrl: text('logo_url').default(''),
  description: text('description').default(''),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  enquiryType: text('enquiry_type').notNull().default('contact'),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  organization: text('organization').default(''),
  subject: text('subject').default(''),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'), // 'new' | 'reviewed' | 'responded'
  createdAt: timestamp('created_at').defaultNow(),
});

export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  receiptNumber: text('receipt_number').notNull().unique(),
  donorName: text('donor_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  panNumber: text('pan_number').default(''),
  address: text('address').default(''),
  amountInr: integer('amount_inr').notNull(),
  purpose: text('purpose').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentReference: text('payment_reference').default(''),
  eligible80g: boolean('eligible_80g').notNull().default(false),
  status: text('status').notNull().default('pending_verification'), // 'pending_verification' | 'acknowledged' | 'verified'
  createdAt: timestamp('created_at').defaultNow(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
