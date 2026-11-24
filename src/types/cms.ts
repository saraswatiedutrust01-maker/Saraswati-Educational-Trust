export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  locationLabel: string;
}

export interface AboutSections {
  organization: {
    title: string;
    summary: string;
    body: string;
  };
  profile: {
    title: string;
    legalName: string;
    established: string;
    legalStatus: string;
    headOffice: string;
    registrationNumber: string;
    pan: string;
    tan: string;
    csr1: string;
    ngoDarpan: string;
    reg12A: string;
    reg80G: string;
    udyam: string;
    bankName: string;
    bankBranch: string;
    bankAccountNo: string;
    bankIfsc: string;
  };
  visionMission: {
    title: string;
    vision: string;
    mission: string;
    values: string[];
  };
  objectives: {
    title: string;
    items: string[];
  };
  approach: {
    title: string;
    body: string;
  };
  geographicalCoverage: {
    title: string;
    body: string;
    regions: string[];
  };
  secretaryMessage: {
    title: string;
    body: string;
    signatoryTitle: string;
  };
  challengesCommitment: {
    title: string;
    body: string;
  };
}

export interface ContactInfo {
  organizationName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  latitude: number;
  longitude: number;
  officeHours: string;
  facebookUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface SiteSettingsMap {
  hero_slides?: HeroSlide[];
  about_sections?: AboutSections;
  contact_info?: ContactInfo;
  seo_settings?: SeoSettings;
}

export interface ImpactStat {
  id: number;
  slug: string;
  label: string;
  value: number;
  unit: string | null;
  verificationNote: string | null;
  sortOrder: number;
}

export interface FocusArea {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface Programme {
  id: number;
  slug: string;
  title: string;
  focusAreaSlug: string | null;
  location: string;
  beneficiaries: string;
  objectives: string;
  activities: string;
  outcomes: string;
  imageUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  location: string;
  duration: string;
  status: string;
  targetBeneficiaries: string;
  overview: string;
  problemStatement: string;
  objectives: string;
  activities: string;
  outputsOutcomes: string;
  budgetDisclosed: string | null;
  imageUrl: string;
  reportFileUrl: string | null;
  donorDocumentUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface Story {
  id: number;
  slug: string;
  title: string;
  category: string;
  subjectTitle: string;
  location: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface Activity {
  id: number;
  title: string;
  eventDate: string;
  location: string;
  category: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  mediaType: string;
  mediaUrl: string;
  caption: string;
}

export interface ResourceDoc {
  id: number;
  title: string;
  category: string;
  documentNumber: string | null;
  description: string;
  fileUrl: string | null;
  fileName: string | null;
  isPublic: boolean;
  accessLevel: string;
}

export interface TeamMember {
  id: number;
  name: string;
  designation: string;
  groupType: string;
  bio: string | null;
  photoUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface Partner {
  id: number;
  name: string;
  partnerType: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  description: string | null;
  isPublished: boolean;
}

export interface Enquiry {
  id: number;
  enquiryType: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export interface DonationRecord {
  id: number;
  receiptNumber: string;
  donorName: string;
  email: string;
  phone: string;
  panNumber: string | null;
  address: string | null;
  amountInr: number;
  purpose: string;
  paymentMethod: string;
  paymentReference: string | null;
  eligible80g: boolean;
  status: string;
  createdAt: string;
}

export interface AppUser {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  designation?: string | null;
  requestedRole?: string | null;
  registrationStatus?: 'active' | 'pending' | 'revoked';
  role: 'admin' | 'editor' | 'content_manager' | 'viewer';
}

export interface BootstrapData {
  settings: SiteSettingsMap;
  impactStats: ImpactStat[];
  focusAreas: FocusArea[];
  programmes: Programme[];
  projects: Project[];
  stories: Story[];
  activities: Activity[];
  gallery: GalleryItem[];
  resources: ResourceDoc[];
  teamMembers: TeamMember[];
  partners: Partner[];
}
