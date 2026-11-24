import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity as ActivityIcon,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  Inbox,
  IndianRupee,
  KeyRound,
  LogOut,
  MailCheck,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { syncAdminRoleToFirestore } from '../lib/firebase';
import {
  AboutSections,
  Activity,
  AppUser,
  ContactInfo,
  DonationRecord,
  Enquiry,
  FocusArea,
  GalleryItem,
  HeroSlide,
  ImpactStat,
  Partner,
  Programme,
  Project,
  ResourceDoc,
  SeoSettings,
  Story,
  TeamMember,
} from '../types/cms';

type AdminTab =
  | 'impact'
  | 'banners_about'
  | 'programmes'
  | 'projects'
  | 'stories_events'
  | 'gallery'
  | 'resources'
  | 'drive'
  | 'team_partners'
  | 'enquiries'
  | 'donations'
  | 'settings_users';

interface AdminPayload {
  settings: {
    hero_slides?: HeroSlide[];
    about_sections?: AboutSections;
    contact_info?: ContactInfo;
    seo_settings?: SeoSettings;
  };
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
  enquiries: Enquiry[];
  donations: DonationRecord[];
  users: AppUser[];
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export function AdminDashboardPage() {
  const {
    appUser,
    firebaseUser,
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
    refreshData,
  } = useSite();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDesignation, setRegDesignation] = useState('');
  const [regRequestedRole, setRegRequestedRole] = useState<'editor' | 'content_manager'>('editor');

  const [pendingName, setPendingName] = useState('');
  const [pendingDesignation, setPendingDesignation] = useState('');
  const [pendingRequestedRole, setPendingRequestedRole] = useState<'editor' | 'content_manager'>('editor');
  const [pendingSubmittedMsg, setPendingSubmittedMsg] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('impact');
  const [cms, setCms] = useState<AdminPayload | null>(null);
  const [loadingCms, setLoadingCms] = useState(false);
  const [notice, setNotice] = useState<string>('');
  const [errNotice, setErrNotice] = useState<string>('');

  // Form states
  const [statsDraft, setStatsDraft] = useState<Record<number, { value: number; unit: string; note: string }>>({});
  const [heroDraft, setHeroDraft] = useState<HeroSlide[]>([]);
  const [aboutSummary, setAboutSummary] = useState('');
  const [aboutBody, setAboutBody] = useState('');
  const [secretaryBody, setSecretaryBody] = useState('');

  // New Programme
  const [progTitle, setProgTitle] = useState('');
  const [progLocation, setProgLocation] = useState('Rayagada, Odisha');
  const [progBeneficiaries, setProgBeneficiaries] = useState('');
  const [progObjectives, setProgObjectives] = useState('');
  const [progActivities, setProgActivities] = useState('');
  const [progOutcomes, setProgOutcomes] = useState('');

  // New Project
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Education');
  const [projLocation, setProjLocation] = useState('Rayagada, Odisha');
  const [projDuration, setProjDuration] = useState('2026–2027');
  const [projStatus, setProjStatus] = useState('Active');
  const [projBeneficiaries, setProjBeneficiaries] = useState('');
  const [projOverview, setProjOverview] = useState('');
  const [projProblem, setProjProblem] = useState('');
  const [projObjectives, setProjObjectives] = useState('');
  const [projActivities, setProjActivities] = useState('');
  const [projOutcomes, setProjOutcomes] = useState('');
  const [projBudget, setProjBudget] = useState('Available on CSR / Donor Request');
  const [projReportUrl, setProjReportUrl] = useState('');

  // New Story & Activity
  const [storyTitle, setStoryTitle] = useState('');
  const [storyCat, setStoryCat] = useState('Student Success');
  const [storySubject, setStorySubject] = useState('');
  const [storyLoc, setStoryLoc] = useState('Rayagada, Odisha');
  const [storySummary, setStorySummary] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyVideo, setStoryVideo] = useState('');

  const [actTitle, setActTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [actLoc, setActLoc] = useState('Kenduguda, Rayagada');
  const [actCat, setActCat] = useState('Community Programme');
  const [actDesc, setActDesc] = useState('');

  // New Gallery
  const [galTitle, setGalTitle] = useState('');
  const [galCat, setGalCat] = useState('Education');
  const [galType, setGalType] = useState<'photo' | 'video'>('photo');
  const [galUrl, setGalUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');

  // Team & Partner
  const [memName, setMemName] = useState('');
  const [memDesig, setMemDesig] = useState('');
  const [memGroup, setMemGroup] = useState<'governing_body' | 'team'>('governing_body');
  const [memBio, setMemBio] = useState('');
  const [memPhoto, setMemPhoto] = useState('');

  const [partName, setPartName] = useState('');
  const [partType, setPartType] = useState('CSR');
  const [partWebsite, setPartWebsite] = useState('');
  const [partLogo, setPartLogo] = useState('');
  const [partDesc, setPartDesc] = useState('');

  // Contact, SEO & Users
  const [contactDraft, setContactDraft] = useState<ContactInfo | null>(null);
  const [seoDraft, setSeoDraft] = useState<SeoSettings | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'content_manager'>('editor');

  // Google Drive State
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveConfirmDelete, setDriveConfirmDelete] = useState<DriveFile | null>(null);

  const loadCmsData = useCallback(async () => {
    setLoadingCms(true);
    try {
      const res = await authFetch('/api/admin/overview');
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Failed to load CMS');
      }
      const payload = (await res.json()) as AdminPayload;
      setCms(payload);

      const sMap: Record<number, { value: number; unit: string; note: string }> = {};
      for (const st of payload.impactStats) {
        sMap[st.id] = {
          value: st.value,
          unit: st.unit || '',
          note: st.verificationNote || 'Organizational Records',
        };
      }
      setStatsDraft(sMap);
      setHeroDraft(payload.settings.hero_slides || []);
      setAboutSummary(payload.settings.about_sections?.organization?.summary || '');
      setAboutBody(payload.settings.about_sections?.organization?.body || '');
      setSecretaryBody(payload.settings.about_sections?.secretaryMessage?.body || '');
      if (payload.settings.contact_info) setContactDraft(payload.settings.contact_info);
      if (payload.settings.seo_settings) setSeoDraft(payload.settings.seo_settings);
    } catch (err) {
      setErrNotice(err instanceof Error ? err.message : 'Unable to load CMS data');
    } finally {
      setLoadingCms(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (appUser && ['admin', 'editor', 'content_manager'].includes(appUser.role)) {
      loadCmsData();
    }
  }, [appUser, loadCmsData]);

  const showSuccess = async (msg: string) => {
    setErrNotice('');
    setNotice(msg);
    await Promise.all([loadCmsData(), refreshData()]);
  };

  const uploadFile = async (file: File): Promise<{ fileUrl: string; fileName: string } | null> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await authFetch('/api/admin/upload', { method: 'POST', body: fd });
    const json = await res.json();
    if (!res.ok) {
      setErrNotice(json.error || 'Upload failed');
      return null;
    }
    return json;
  };

  const loadGoogleDriveFiles = async () => {
    if (!driveAccessToken) return;
    setDriveLoading(true);
    setErrNotice('');
    try {
      const res = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=20&fields=files(id,name,mimeType,webViewLink,modifiedTime)',
        { headers: { Authorization: `Bearer ${driveAccessToken}` } }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Unable to list Google Drive files');
      setDriveFiles(json.files || []);
    } catch (err) {
      setErrNotice(err instanceof Error ? err.message : 'Google Drive error');
    } finally {
      setDriveLoading(false);
    }
  };

  const uploadToGoogleDrive = async (file: File) => {
    if (!driveAccessToken) {
      setErrNotice('Please reconnect Google Sign-In to authorize Google Drive upload.');
      return;
    }
    setDriveLoading(true);
    try {
      const metadata = { name: file.name, mimeType: file.type || 'application/octet-stream' };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${driveAccessToken}` },
          body: form,
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Drive upload failed');
      setNotice(`Uploaded "${json.name}" to Google Drive.`);
      await loadGoogleDriveFiles();
    } catch (err) {
      setErrNotice(err instanceof Error ? err.message : 'Drive upload failed');
    } finally {
      setDriveLoading(false);
    }
  };

  const confirmDeleteDriveFile = async () => {
    if (!driveConfirmDelete || !driveAccessToken) return;
    setDriveLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${driveConfirmDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${driveAccessToken}` },
      });
      if (!res.ok) throw new Error('Failed to delete file from Google Drive');
      setNotice(`Removed "${driveConfirmDelete.name}" from Google Drive.`);
      setDriveConfirmDelete(null);
      await loadGoogleDriveFiles();
    } catch (err) {
      setErrNotice(err instanceof Error ? err.message : 'Could not delete Drive file');
    } finally {
      setDriveLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-sm text-stone-600">
        Verifying administration session...
      </div>
    );
  }

  if (!firebaseUser || !appUser) {
    return (
      <div className="bg-[#FBFBF8] py-14 sm:py-20">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-9 space-y-6">
            <div className="text-center space-y-2">
              <img
                src="/assets/aistudio/Saraswati_Logo_New_20a426b0.jpeg"
                alt="Saraswati Educational Trust"
                className="w-16 h-16 rounded-full mx-auto border border-stone-200"
              />
              <h1 className="font-display text-2xl font-bold text-stone-900">
                Trust Administration CMS
              </h1>
              <p className="text-xs sm:text-sm text-stone-600">
                Role-based access portal for Administrators, Editors, and Content Managers.
              </p>
            </div>

            {/* Auth Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#F3F5F0] border border-stone-200">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-colors ${
                  authMode === 'login'
                    ? 'bg-[#14452F] text-white'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" /> Staff Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-colors ${
                  authMode === 'register'
                    ? 'bg-[#14452F] text-white'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Staff Registration
              </button>
            </div>

            {authNotice && (
              <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3 leading-relaxed">
                {authNotice}
              </p>
            )}
            {authError && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 leading-relaxed">
                {authError}
              </p>
            )}

            {authMode === 'login' ? (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-sm font-semibold shadow-xs transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-stone-200" />
                  <span className="shrink mx-3 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                    Or Email &amp; Password
                  </span>
                  <div className="flex-grow border-t border-stone-200" />
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await signInWithEmail(loginEmail, loginPassword);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label htmlFor="admin-login-email" className="block text-xs font-semibold text-stone-700 mb-1">
                      Staff Email
                    </label>
                    <input
                      id="admin-login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@saraswatiedutrust.online"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-login-pw" className="block text-xs font-semibold text-stone-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="admin-login-pw"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (loginEmail.trim()) sendPasswordReset(loginEmail);
                      }}
                      className="text-xs font-medium text-[#14452F] hover:underline disabled:opacity-50"
                      disabled={!loginEmail.trim()}
                    >
                      Forgot password?
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-xs font-semibold transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await registerWithEmail({
                      fullName: regFullName,
                      email: regEmail,
                      password: regPassword,
                      designation: regDesignation,
                      requestedRole: regRequestedRole,
                    });
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-name" className="block text-xs font-semibold text-stone-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        minLength={2}
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Staff full name"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-desig" className="block text-xs font-semibold text-stone-700 mb-1">
                        Designation / Team *
                      </label>
                      <input
                        id="reg-desig"
                        type="text"
                        required
                        minLength={2}
                        value={regDesignation}
                        onChange={(e) => setRegDesignation(e.target.value)}
                        placeholder="e.g., Project Coordinator"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-role" className="block text-xs font-semibold text-stone-700 mb-1">
                      Requested Access Level
                    </label>
                    <select
                      id="reg-role"
                      value={regRequestedRole}
                      onChange={(e) => setRegRequestedRole(e.target.value as 'editor' | 'content_manager')}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#14452F]"
                    >
                      <option value="editor">Editor (Programmes, Projects, Reports, Enquiries)</option>
                      <option value="content_manager">Content Manager (Stories, Events, Gallery)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="staff@saraswatiedutrust.online"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-pw" className="block text-xs font-semibold text-stone-700 mb-1">
                      Create Password (min. 8 characters) *
                    </label>
                    <input
                      id="reg-pw"
                      type="password"
                      required
                      minLength={8}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-xs font-semibold transition-colors"
                  >
                    Register Staff Account with Email
                  </button>
                </form>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-stone-200" />
                  <span className="shrink mx-3 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                    Or Quick Google Registration
                  </span>
                  <div className="flex-grow border-t border-stone-200" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    registerWithGoogle({
                      designation: regDesignation || 'Trust Staff Member',
                      requestedRole: regRequestedRole,
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-[#14452F]" />
                  <span>Register &amp; Request Access with Google</span>
                </button>

                <p className="text-[11px] text-stone-500 leading-relaxed bg-[#F3F5F0] rounded-lg p-3 border border-stone-200">
                  Security Policy: New registrations start with restricted Viewer status and require email verification plus Trust Administrator approval before CMS write access is granted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!firebaseUser.emailVerified) {
    return (
      <div className="bg-[#FBFBF8] py-20">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
              <MailCheck className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Verify Your Email Address
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              Signed in as <strong>{firebaseUser.email}</strong>. Please open the verification link sent to your inbox before accessing the Administration CMS.
            </p>
            {authNotice && (
              <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                {authNotice}
              </p>
            )}
            {authError && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {authError}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={refreshAuthSession}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> I Verified My Email
              </button>
              <button
                type="button"
                onClick={resendVerificationEmail}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Resend Verification Link
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!['admin', 'editor', 'content_manager'].includes(appUser.role)) {
    return (
      <div className="bg-[#FBFBF8] py-16">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-xl border border-stone-200 p-8 space-y-5">
            <div className="text-center space-y-2">
              <h1 className="font-display text-2xl font-bold text-stone-900">
                {appUser.registrationStatus === 'revoked'
                  ? 'Access Restricted'
                  : 'Pending Administrator Approval'}
              </h1>
              <p className="text-sm text-stone-600">
                Signed in as <span className="font-semibold">{appUser.email}</span> · Current Role:{' '}
                <strong className="uppercase text-stone-800">{appUser.role}</strong>
              </p>
              {appUser.designation && (
                <p className="text-xs text-stone-500">
                  Recorded Profile: {appUser.displayName || appUser.email} ({appUser.designation}) · Requested:{' '}
                  {appUser.requestedRole || 'editor'}
                </p>
              )}
            </div>

            {pendingSubmittedMsg && (
              <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                {pendingSubmittedMsg}
              </p>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPendingSubmittedMsg('');
                try {
                  await submitAccessRequest({
                    fullName: pendingName || appUser.displayName || appUser.email.split('@')[0],
                    designation: pendingDesignation || appUser.designation || 'Trust Staff',
                    requestedRole: pendingRequestedRole,
                  });
                  setPendingSubmittedMsg('Access request updated and queued for Trust Administrator approval.');
                } catch (err) {
                  setErrNotice(err instanceof Error ? err.message : 'Unable to submit request');
                }
              }}
              className="p-4 rounded-xl bg-[#FBFBF8] border border-stone-200 space-y-3"
            >
              <p className="text-xs font-semibold text-stone-800">
                Submit or Update Staff Access Request
              </p>
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={pendingName || appUser.displayName || ''}
                onChange={(e) => setPendingName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
              />
              <input
                type="text"
                required
                placeholder="Designation / Programme Team"
                value={pendingDesignation || appUser.designation || ''}
                onChange={(e) => setPendingDesignation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
              />
              <select
                value={pendingRequestedRole}
                onChange={(e) => setPendingRequestedRole(e.target.value as 'editor' | 'content_manager')}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
              >
                <option value="editor">Request Editor Role</option>
                <option value="content_manager">Request Content Manager Role</option>
              </select>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                >
                  Save Request Details
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = appUser.role === 'admin';
  const isEditor = isAdmin || appUser.role === 'editor';

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; visible: boolean }[] = [
    { id: 'impact', label: 'Impact Stats', icon: BarChart3, visible: isEditor },
    { id: 'banners_about', label: 'Banners & About', icon: BookOpen, visible: isEditor },
    { id: 'programmes', label: 'Programmes', icon: Award, visible: true },
    { id: 'projects', label: 'Projects', icon: FolderOpen, visible: isEditor },
    { id: 'stories_events', label: 'Stories & Events', icon: ActivityIcon, visible: true },
    { id: 'gallery', label: 'Photo & Video Gallery', icon: ImageIcon, visible: true },
    { id: 'resources', label: 'Legal & Reports', icon: FileText, visible: isEditor },
    { id: 'drive', label: 'Google Drive Vault', icon: HardDrive, visible: isEditor },
    { id: 'team_partners', label: 'Team & Partners', icon: Users, visible: isEditor },
    { id: 'enquiries', label: 'Enquiries & Volunteers', icon: Inbox, visible: isEditor },
    { id: 'donations', label: 'Donations & 80G', icon: IndianRupee, visible: isAdmin },
    { id: 'settings_users', label: 'Contact, SEO & Roles', icon: Settings, visible: isAdmin },
  ];

  return (
    <div className="bg-[#FBFBF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Bar */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-[#14452F]" />
            <div>
              <h1 className="font-display text-xl font-bold text-stone-900">
                Saraswati Educational Trust — CMS Dashboard
              </h1>
              <p className="text-xs text-stone-500">
                {appUser.email} · Role: <strong className="uppercase text-[#14452F]">{appUser.role.replace('_', ' ')}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!driveAccessToken && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-3.5 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Authorize Google Drive
              </button>
            )}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {notice}
            </span>
            <button type="button" onClick={() => setNotice('')} aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {errNotice && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between">
            <span>{errNotice}</span>
            <button type="button" onClick={() => setErrNotice('')} aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Tabs */}
          <aside className="lg:col-span-3 bg-white rounded-xl border border-stone-200 p-3 space-y-1">
            {tabs
              .filter((t) => t.visible)
              .map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                      active
                        ? 'bg-[#14452F] text-white'
                        : 'text-stone-700 hover:bg-[#F3F5F0]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
          </aside>

          {/* Main Workspace */}
          <div className="lg:col-span-9 bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-6">
            {loadingCms || !cms ? (
              <p className="text-sm text-stone-500">Loading CMS records...</p>
            ) : (
              <>
                {/* 1. Impact Stats */}
                {activeTab === 'impact' && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-stone-900">
                        Verified Impact Statistics
                      </h2>
                      <p className="text-xs text-stone-500 mt-1">
                        Enter verified figures directly from Trust registers. Values update the homepage counters immediately.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cms.impactStats.map((stat) => {
                        const draft = statsDraft[stat.id] || {
                          value: stat.value,
                          unit: stat.unit || '',
                          note: stat.verificationNote || '',
                        };
                        return (
                          <div key={stat.id} className="p-4 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-3">
                            <p className="font-semibold text-sm text-stone-900">{stat.label}</p>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="number"
                                min={0}
                                value={draft.value}
                                onChange={(e) =>
                                  setStatsDraft({
                                    ...statsDraft,
                                    [stat.id]: { ...draft, value: Number(e.target.value) },
                                  })
                                }
                                className="col-span-2 px-3 py-2 rounded-lg border border-stone-300 text-sm tabular-nums bg-white"
                              />
                              <input
                                type="text"
                                placeholder="+ / %"
                                value={draft.unit}
                                onChange={(e) =>
                                  setStatsDraft({
                                    ...statsDraft,
                                    [stat.id]: { ...draft, unit: e.target.value },
                                  })
                                }
                                className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                              />
                            </div>
                            <input
                              type="text"
                              value={draft.note}
                              onChange={(e) =>
                                setStatsDraft({
                                  ...statsDraft,
                                  [stat.id]: { ...draft, note: e.target.value },
                                })
                              }
                              placeholder="Source / Verification Record"
                              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await authFetch(`/api/admin/impact-stats/${stat.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    value: draft.value,
                                    unit: draft.unit,
                                    verificationNote: draft.note,
                                  }),
                                });
                                if (res.ok) await showSuccess(`Updated ${stat.label}.`);
                              }}
                              className="px-4 py-1.5 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                            >
                              Save Counter
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Banners & About */}
                {activeTab === 'banners_about' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h2 className="font-display text-2xl font-bold text-stone-900">
                        Homepage Hero Banners
                      </h2>
                      {heroDraft.map((slide, idx) => (
                        <div key={slide.id} className="p-4 rounded-xl border border-stone-200 space-y-3">
                          <p className="text-xs font-semibold text-[#14452F]">Slide {idx + 1}</p>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const next = [...heroDraft];
                              next[idx] = { ...slide, title: e.target.value };
                              setHeroDraft(next);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                          />
                          <textarea
                            rows={2}
                            value={slide.subtitle}
                            onChange={(e) => {
                              const next = [...heroDraft];
                              next[idx] = { ...slide, subtitle: e.target.value };
                              setHeroDraft(next);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                          />
                          <div className="flex flex-wrap items-center gap-3">
                            <input
                              type="text"
                              value={slide.imageUrl}
                              onChange={(e) => {
                                const next = [...heroDraft];
                                next[idx] = { ...slide, imageUrl: e.target.value };
                                setHeroDraft(next);
                              }}
                              className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs"
                            />
                            <label className="cursor-pointer px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold hover:bg-stone-50">
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  const up = await uploadFile(f);
                                  if (up) {
                                    const next = [...heroDraft];
                                    next[idx] = { ...slide, imageUrl: up.fileUrl };
                                    setHeroDraft(next);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await authFetch('/api/admin/settings/hero_slides', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ value: heroDraft }),
                          });
                          if (res.ok) await showSuccess('Hero banners updated.');
                        }}
                        className="px-5 py-2.5 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                      >
                        Save Hero Banners
                      </button>
                    </div>

                    <div className="pt-6 border-t border-stone-200 space-y-4">
                      <h2 className="font-display text-2xl font-bold text-stone-900">
                        About Us &amp; Secretary&apos;s Message
                      </h2>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Who We Are Summary
                        </label>
                        <textarea
                          rows={2}
                          value={aboutSummary}
                          onChange={(e) => setAboutSummary(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Organization Full Narrative
                        </label>
                        <textarea
                          rows={5}
                          value={aboutBody}
                          onChange={(e) => setAboutBody(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Secretary&apos;s Message
                        </label>
                        <textarea
                          rows={4}
                          value={secretaryBody}
                          onChange={(e) => setSecretaryBody(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const currentAbout = cms.settings.about_sections;
                          if (!currentAbout) return;
                          const nextAbout = {
                            ...currentAbout,
                            organization: {
                              ...currentAbout.organization,
                              summary: aboutSummary,
                              body: aboutBody,
                            },
                            secretaryMessage: {
                              ...currentAbout.secretaryMessage,
                              body: secretaryBody,
                            },
                          };
                          const res = await authFetch('/api/admin/settings/about_sections', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ value: nextAbout }),
                          });
                          if (res.ok) await showSuccess('About Us content updated.');
                        }}
                        className="px-5 py-2.5 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                      >
                        Save About Content
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Programmes */}
                {activeTab === 'programmes' && (
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-bold text-stone-900">
                      Manage Programmes ({cms.programmes.length})
                    </h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await authFetch('/api/admin/programmes', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: progTitle,
                            location: progLocation,
                            beneficiaries: progBeneficiaries,
                            objectives: progObjectives,
                            activities: progActivities,
                            outcomes: progOutcomes,
                          }),
                        });
                        if (res.ok) {
                          setProgTitle('');
                          setProgBeneficiaries('');
                          setProgObjectives('');
                          setProgActivities('');
                          setProgOutcomes('');
                          await showSuccess('Programme added.');
                        }
                      }}
                      className="p-5 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-3"
                    >
                      <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add New Programme
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          required
                          placeholder="Programme Title"
                          value={progTitle}
                          onChange={(e) => setProgTitle(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                        <input
                          required
                          placeholder="Location"
                          value={progLocation}
                          onChange={(e) => setProgLocation(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <input
                        required
                        placeholder="Target Beneficiaries"
                        value={progBeneficiaries}
                        onChange={(e) => setProgBeneficiaries(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                      />
                      <textarea
                        required
                        rows={2}
                        placeholder="Objectives"
                        value={progObjectives}
                        onChange={(e) => setProgObjectives(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <textarea
                          required
                          rows={2}
                          placeholder="Key Activities"
                          value={progActivities}
                          onChange={(e) => setProgActivities(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                        />
                        <textarea
                          required
                          rows={2}
                          placeholder="Expected / Verified Outcomes"
                          value={progOutcomes}
                          onChange={(e) => setProgOutcomes(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                        />
                      </div>
                      <button type="submit" className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold">
                        Create Programme
                      </button>
                    </form>

                    <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl">
                      {cms.programmes.map((p) => (
                        <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-sm text-stone-900">{p.title}</p>
                            <p className="text-xs text-stone-500">{p.location}</p>
                          </div>
                          {isEditor && (
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await authFetch(`/api/admin/programmes/${p.id}`, {
                                  method: 'DELETE',
                                });
                                if (res.ok) await showSuccess(`Deleted ${p.title}.`);
                              }}
                              className="p-2 text-red-700 hover:bg-red-50 rounded-lg"
                              aria-label={`Delete ${p.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Projects */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-bold text-stone-900">
                      Manage Projects &amp; Reports
                    </h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await authFetch('/api/admin/projects', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: projTitle,
                            category: projCategory,
                            location: projLocation,
                            duration: projDuration,
                            status: projStatus,
                            targetBeneficiaries: projBeneficiaries,
                            overview: projOverview,
                            problemStatement: projProblem,
                            objectives: projObjectives,
                            activities: projActivities,
                            outputsOutcomes: projOutcomes,
                            budgetDisclosed: projBudget,
                            reportFileUrl: projReportUrl,
                          }),
                        });
                        if (res.ok) {
                          setProjTitle('');
                          setProjBeneficiaries('');
                          setProjOverview('');
                          setProjProblem('');
                          setProjObjectives('');
                          setProjActivities('');
                          setProjOutcomes('');
                          setProjReportUrl('');
                          await showSuccess('Project published.');
                        }
                      }}
                      className="p-5 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-3"
                    >
                      <p className="text-sm font-semibold text-stone-900">Add Project</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          required
                          placeholder="Project Title"
                          value={projTitle}
                          onChange={(e) => setProjTitle(e.target.value)}
                          className="sm:col-span-2 px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                        <select
                          value={projCategory}
                          onChange={(e) => setProjCategory(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        >
                          {['Education', 'Livelihood', 'Agriculture', 'Women Empowerment', 'Health', 'WASH', 'Environment', 'Tribal Development'].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input placeholder="Location" value={projLocation} onChange={(e) => setProjLocation(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <input placeholder="Duration" value={projDuration} onChange={(e) => setProjDuration(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <input placeholder="Status (Active / Completed)" value={projStatus} onChange={(e) => setProjStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                      </div>
                      <input required placeholder="Target Beneficiaries" value={projBeneficiaries} onChange={(e) => setProjBeneficiaries(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                      <textarea required rows={2} placeholder="Project Overview" value={projOverview} onChange={(e) => setProjOverview(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                      <textarea required rows={2} placeholder="Problem Statement" value={projProblem} onChange={(e) => setProjProblem(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <textarea required rows={2} placeholder="Objectives" value={projObjectives} onChange={(e) => setProjObjectives(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <textarea required rows={2} placeholder="Activities" value={projActivities} onChange={(e) => setProjActivities(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                      </div>
                      <textarea required rows={2} placeholder="Outputs & Outcomes" value={projOutcomes} onChange={(e) => setProjOutcomes(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                      <div className="flex flex-wrap items-center gap-3">
                        <input placeholder="Approved Budget Disclosure" value={projBudget} onChange={(e) => setProjBudget(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <label className="cursor-pointer px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold bg-white hover:bg-stone-50">
                          {projReportUrl ? 'Report PDF Attached' : 'Upload Project Report PDF'}
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const up = await uploadFile(f);
                              if (up) setProjReportUrl(up.fileUrl);
                            }}
                          />
                        </label>
                      </div>
                      <button type="submit" className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold">
                        Publish Project
                      </button>
                    </form>

                    <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl">
                      {cms.projects.map((pr) => (
                        <div key={pr.id} className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-sm text-stone-900">{pr.title}</p>
                            <p className="text-xs text-stone-500">{pr.category} · {pr.location} · {pr.status}</p>
                          </div>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await authFetch(`/api/admin/projects/${pr.id}`, { method: 'DELETE' });
                                if (res.ok) await showSuccess(`Deleted ${pr.title}.`);
                              }}
                              className="p-2 text-red-700 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Stories & Events */}
                {activeTab === 'stories_events' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h2 className="font-display text-2xl font-bold text-stone-900">Publish Success Story</h2>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const res = await authFetch('/api/admin/stories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: storyTitle,
                              category: storyCat,
                              subjectTitle: storySubject,
                              location: storyLoc,
                              summary: storySummary,
                              content: storyContent,
                              videoUrl: storyVideo,
                            }),
                          });
                          if (res.ok) {
                            setStoryTitle('');
                            setStorySubject('');
                            setStorySummary('');
                            setStoryContent('');
                            setStoryVideo('');
                            await showSuccess('Success story published.');
                          }
                        }}
                        className="p-5 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input required placeholder="Story Headline" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white" />
                          <select value={storyCat} onChange={(e) => setStoryCat(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white">
                            {['Student Success', 'Women Entrepreneurs', 'SHG Achievements', 'Farmer Success', 'Youth Employment', 'Community Transformation'].map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input required placeholder="Beneficiary / Group Name (Verified)" value={storySubject} onChange={(e) => setStorySubject(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                          <input required placeholder="Village / Block Location" value={storyLoc} onChange={(e) => setStoryLoc(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        </div>
                        <input required placeholder="Short Summary" value={storySummary} onChange={(e) => setStorySummary(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <textarea required rows={3} placeholder="Full Story Narrative" value={storyContent} onChange={(e) => setStoryContent(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <input placeholder="Optional YouTube / Video URL" value={storyVideo} onChange={(e) => setStoryVideo(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold">Publish Story</button>
                      </form>
                    </div>

                    <div className="pt-6 border-t border-stone-200 space-y-4">
                      <h2 className="font-display text-2xl font-bold text-stone-900">Publish Activity / Event</h2>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const res = await authFetch('/api/admin/activities', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: actTitle,
                              eventDate: actDate,
                              location: actLoc,
                              category: actCat,
                              description: actDesc,
                            }),
                          });
                          if (res.ok) {
                            setActTitle('');
                            setActDate('');
                            setActDesc('');
                            await showSuccess('Activity / Event published.');
                          }
                        }}
                        className="p-5 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input required placeholder="Event Title" value={actTitle} onChange={(e) => setActTitle(e.target.value)} className="sm:col-span-2 px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white" />
                          <input required type="date" value={actDate} onChange={(e) => setActDate(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input required placeholder="Location" value={actLoc} onChange={(e) => setActLoc(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                          <input required placeholder="Category" value={actCat} onChange={(e) => setActCat(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        </div>
                        <textarea required rows={2} placeholder="Event Description" value={actDesc} onChange={(e) => setActDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold">Publish Event</button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 6. Gallery */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-bold text-stone-900">
                      Photo &amp; Video Gallery ({cms.gallery.length})
                    </h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await authFetch('/api/admin/gallery', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: galTitle,
                            category: galCat,
                            mediaType: galType,
                            mediaUrl: galUrl,
                            caption: galCaption,
                          }),
                        });
                        if (res.ok) {
                          setGalTitle('');
                          setGalUrl('');
                          setGalCaption('');
                          await showSuccess('Media added to gallery.');
                        }
                      }}
                      className="p-5 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input required placeholder="Title" value={galTitle} onChange={(e) => setGalTitle(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white" />
                        <select value={galCat} onChange={(e) => setGalCat(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white">
                          {['Education', 'Women Empowerment', 'Agriculture', 'Environment', 'Health and Sanitation', 'Skill Development', 'Community Development', 'Events and Celebrations'].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <select value={galType} onChange={(e) => setGalType(e.target.value as 'photo' | 'video')} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white">
                          <option value="photo">Photo</option>
                          <option value="video">Video (YouTube / Link)</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <input required placeholder="Image path or Video URL" value={galUrl} onChange={(e) => setGalUrl(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        {galType === 'photo' && (
                          <label className="cursor-pointer px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold bg-white hover:bg-stone-50">
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const up = await uploadFile(f);
                                if (up) setGalUrl(up.fileUrl);
                              }}
                            />
                          </label>
                        )}
                      </div>
                      <input required placeholder="Caption" value={galCaption} onChange={(e) => setGalCaption(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                      <button type="submit" className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold">Add to Gallery</button>
                    </form>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cms.gallery.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-stone-900 truncate">{item.title}</p>
                            <p className="text-[11px] text-stone-500">{item.category} · {item.mediaType}</p>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await authFetch(`/api/admin/gallery/${item.id}`, { method: 'DELETE' });
                              if (res.ok) await showSuccess('Removed gallery item.');
                            }}
                            className="p-1.5 text-red-700 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Legal Documents & Resources */}
                {activeTab === 'resources' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-stone-900">
                        Annual Reports &amp; Legal Documents
                      </h2>
                      <p className="text-xs text-stone-500 mt-1">
                        Upload PDF files and control whether each document is publicly downloadable or restricted for CSR request.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {cms.resources.map((doc) => (
                        <div key={doc.id} className="p-4 rounded-xl border border-stone-200 bg-[#FBFBF8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-sm text-stone-900">{doc.title}</p>
                            <p className="text-xs text-stone-500">
                              {doc.category} {doc.documentNumber ? `· ${doc.documentNumber}` : ''} ·{' '}
                              {doc.fileUrl ? `Attached: ${doc.fileName || 'PDF'}` : 'No PDF uploaded yet'}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold hover:bg-stone-50">
                              Upload PDF
                              <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  const up = await uploadFile(f);
                                  if (up) {
                                    const res = await authFetch(`/api/admin/resources/${doc.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        ...doc,
                                        fileUrl: up.fileUrl,
                                        fileName: up.fileName,
                                      }),
                                    });
                                    if (res.ok) await showSuccess(`Uploaded PDF for ${doc.title}.`);
                                  }
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await authFetch(`/api/admin/resources/${doc.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ ...doc, isPublic: !doc.isPublic }),
                                });
                                if (res.ok) await showSuccess(`Updated download permission for ${doc.title}.`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                doc.isPublic
                                  ? 'bg-[#14452F] text-white'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {doc.isPublic ? 'Public Download ON' : 'Public Download OFF'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. Google Drive Vault */}
                {activeTab === 'drive' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-stone-900">
                          Google Drive Document Vault
                        </h2>
                        <p className="text-xs text-stone-500 mt-1">
                          Browse, upload, and archive Trust compliance records and reports directly with Google Drive.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {driveAccessToken ? (
                          <>
                            <button
                              type="button"
                              onClick={loadGoogleDriveFiles}
                              disabled={driveLoading}
                              className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                            >
                              {driveLoading ? 'Loading...' : 'Refresh Drive Files'}
                            </button>
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D97706] text-white text-xs font-semibold">
                              <Upload className="w-3.5 h-3.5" />
                              Upload to Drive
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) uploadToGoogleDrive(f);
                                }}
                              />
                            </label>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={signInWithGoogle}
                            className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                          >
                            Connect Google Drive Session
                          </button>
                        )}
                      </div>
                    </div>

                    {driveFiles.length > 0 && (
                      <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl">
                        {driveFiles.map((df) => (
                          <div key={df.id} className="p-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-stone-900 truncate">{df.name}</p>
                              <p className="text-xs text-stone-500">{df.mimeType}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {df.webViewLink && (
                                <a
                                  href={df.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-semibold text-[#14452F] hover:underline"
                                >
                                  Open in Drive
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => setDriveConfirmDelete(df)}
                                className="p-1.5 text-red-700 hover:bg-red-50 rounded"
                                aria-label={`Delete ${df.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 9. Team & Partners */}
                {activeTab === 'team_partners' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h2 className="font-display text-2xl font-bold text-stone-900">
                        Governing Body &amp; Team Profiles
                      </h2>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const res = await authFetch('/api/admin/team', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              name: memName,
                              designation: memDesig,
                              groupType: memGroup,
                              bio: memBio,
                              photoUrl: memPhoto,
                            }),
                          });
                          if (res.ok) {
                            setMemName('');
                            setMemDesig('');
                            setMemBio('');
                            setMemPhoto('');
                            await showSuccess('Profile added.');
                          }
                        }}
                        className="p-5 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input required placeholder="Full Name" value={memName} onChange={(e) => setMemName(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white" />
                          <input required placeholder="Designation" value={memDesig} onChange={(e) => setMemDesig(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white" />
                          <select value={memGroup} onChange={(e) => setMemGroup(e.target.value as 'governing_body' | 'team')} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white">
                            <option value="governing_body">Governing Body</option>
                            <option value="team">Our Team</option>
                          </select>
                        </div>
                        <textarea rows={2} placeholder="Short Bio" value={memBio} onChange={(e) => setMemBio(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold bg-white">
                            {memPhoto ? 'Photo Uploaded' : 'Upload Profile Photo'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const up = await uploadFile(f);
                                if (up) setMemPhoto(up.fileUrl);
                              }}
                            />
                          </label>
                          <button type="submit" className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold">Add Member</button>
                        </div>
                      </form>

                      <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl">
                        {cms.teamMembers.map((m) => (
                          <div key={m.id} className="p-3.5 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm text-stone-900">{m.name}</p>
                              <p className="text-xs text-stone-500">{m.designation} · {m.groupType}</p>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await authFetch(`/api/admin/team/${m.id}`, { method: 'DELETE' });
                                if (res.ok) await showSuccess('Removed profile.');
                              }}
                              className="p-1.5 text-red-700 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-stone-200 space-y-4">
                      <h2 className="font-display text-2xl font-bold text-stone-900">
                        Approved Donor, CSR &amp; Institutional Partners
                      </h2>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const res = await authFetch('/api/admin/partners', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              name: partName,
                              partnerType: partType,
                              websiteUrl: partWebsite,
                              logoUrl: partLogo,
                              description: partDesc,
                            }),
                          });
                          if (res.ok) {
                            setPartName('');
                            setPartWebsite('');
                            setPartLogo('');
                            setPartDesc('');
                            await showSuccess('Partner added.');
                          }
                        }}
                        className="p-5 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input required placeholder="Partner Name" value={partName} onChange={(e) => setPartName(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white" />
                          <select value={partType} onChange={(e) => setPartType(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white">
                            {['CSR', 'Donor', 'Institutional', 'Government'].map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <input placeholder="Website URL (Optional)" value={partWebsite} onChange={(e) => setPartWebsite(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white" />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold bg-white">
                            {partLogo ? 'Logo Uploaded' : 'Upload Partner Logo'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const up = await uploadFile(f);
                                if (up) setPartLogo(up.fileUrl);
                              }}
                            />
                          </label>
                          <button type="submit" className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold">Add Partner</button>
                        </div>
                      </form>

                      <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl">
                        {cms.partners.map((pt) => (
                          <div key={pt.id} className="p-3.5 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm text-stone-900">{pt.name}</p>
                              <p className="text-xs text-stone-500">{pt.partnerType}</p>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await authFetch(`/api/admin/partners/${pt.id}`, { method: 'DELETE' });
                                if (res.ok) await showSuccess('Removed partner.');
                              }}
                              className="p-1.5 text-red-700 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. Enquiries & Volunteers */}
                {activeTab === 'enquiries' && (
                  <div className="space-y-5">
                    <h2 className="font-display text-2xl font-bold text-stone-900">
                      Contact, Volunteer &amp; CSR Enquiries ({cms.enquiries.length})
                    </h2>
                    {cms.enquiries.length === 0 ? (
                      <p className="text-sm text-stone-500">No submissions recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {cms.enquiries.map((enq) => (
                          <div key={enq.id} className="p-4 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-semibold text-sm text-stone-900">
                                {enq.fullName} · <span className="uppercase text-[#14452F] text-xs">{enq.enquiryType}</span>
                              </p>
                              <select
                                value={enq.status}
                                onChange={async (e) => {
                                  const res = await authFetch(`/api/admin/enquiries/${enq.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: e.target.value }),
                                  });
                                  if (res.ok) await showSuccess('Enquiry status updated.');
                                }}
                                className="px-2.5 py-1 rounded border border-stone-300 text-xs bg-white"
                              >
                                <option value="new">New</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="responded">Responded</option>
                              </select>
                            </div>
                            <p className="text-xs text-stone-600">
                              {enq.email} · {enq.phone} {enq.organization ? `· ${enq.organization}` : ''}
                            </p>
                            {enq.subject && <p className="text-xs font-semibold text-stone-800">{enq.subject}</p>}
                            <p className="text-xs text-stone-700 leading-relaxed">{enq.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 11. Donations & 80G */}
                {activeTab === 'donations' && (
                  <div className="space-y-5">
                    <h2 className="font-display text-2xl font-bold text-stone-900">
                      Donation Records &amp; 80G Verification ({cms.donations.length})
                    </h2>
                    {cms.donations.length === 0 ? (
                      <p className="text-sm text-stone-500">No donations recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {cms.donations.map((don) => (
                          <div key={don.id} className="p-4 rounded-xl border border-stone-200 bg-[#FBFBF8] space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-semibold text-sm text-stone-900 tabular-nums">
                                {don.receiptNumber} · ₹{don.amountInr.toLocaleString('en-IN')} · {don.donorName}
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = await authFetch(`/api/admin/donations/${don.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        status: 'verified',
                                        eligible80g: !don.eligible80g,
                                      }),
                                    });
                                    const j = await res.json();
                                    if (!res.ok) {
                                      setErrNotice(j.error || 'Cannot update 80G flag');
                                    } else {
                                      await showSuccess(`Updated ${don.receiptNumber}.`);
                                    }
                                  }}
                                  className={`px-3 py-1 rounded text-xs font-semibold ${
                                    don.eligible80g ? 'bg-[#14452F] text-white' : 'bg-stone-200 text-stone-800'
                                  }`}
                                >
                                  {don.eligible80g ? '80G Verified' : 'Mark 80G Verified'}
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-stone-600">
                              {don.email} · {don.phone} · PAN: {don.panNumber || 'Not Provided'} · Mode: {don.paymentMethod} ({don.paymentReference || 'No Ref'})
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 12. Contact, SEO & Users */}
                {activeTab === 'settings_users' && (
                  <div className="space-y-8">
                    {contactDraft && (
                      <div className="space-y-4">
                        <h2 className="font-display text-2xl font-bold text-stone-900">Contact Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input value={contactDraft.phone} onChange={(e) => setContactDraft({ ...contactDraft, phone: e.target.value })} placeholder="Phone" className="px-3 py-2 rounded-lg border border-stone-300 text-sm" />
                          <input value={contactDraft.email} onChange={(e) => setContactDraft({ ...contactDraft, email: e.target.value })} placeholder="Email" className="px-3 py-2 rounded-lg border border-stone-300 text-sm" />
                        </div>
                        <input value={contactDraft.address} onChange={(e) => setContactDraft({ ...contactDraft, address: e.target.value })} placeholder="Address" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm" />
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await authFetch('/api/admin/settings/contact_info', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ value: contactDraft }),
                            });
                            if (res.ok) await showSuccess('Contact details updated.');
                          }}
                          className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                        >
                          Save Contact Info
                        </button>
                      </div>
                    )}

                    {seoDraft && (
                      <div className="pt-6 border-t border-stone-200 space-y-4">
                        <h2 className="font-display text-2xl font-bold text-stone-900">SEO Metadata</h2>
                        <input value={seoDraft.siteTitle} onChange={(e) => setSeoDraft({ ...seoDraft, siteTitle: e.target.value })} placeholder="Site Title" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm" />
                        <textarea rows={2} value={seoDraft.metaDescription} onChange={(e) => setSeoDraft({ ...seoDraft, metaDescription: e.target.value })} placeholder="Meta Description" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs" />
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await authFetch('/api/admin/settings/seo_settings', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ value: seoDraft }),
                            });
                            if (res.ok) await showSuccess('SEO settings updated.');
                          }}
                          className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                        >
                          Save SEO Metadata
                        </button>
                      </div>
                    )}

                    <div className="pt-6 border-t border-stone-200 space-y-5">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-stone-900">
                          Role-Based Access Control (Admin / Editor / Content Manager)
                        </h2>
                        <p className="text-xs text-stone-500 mt-1">
                          Pre-authorize Trust email accounts or review pending staff registration requests below.
                        </p>
                      </div>

                      {cms.users.some((u) => u.role === 'viewer' && u.registrationStatus !== 'revoked') && (
                        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-3">
                          <p className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4" /> Pending Staff Registration Requests
                          </p>
                          <div className="space-y-2">
                            {cms.users
                              .filter((u) => u.role === 'viewer' && u.registrationStatus !== 'revoked')
                              .map((u) => (
                                <div
                                  key={u.id}
                                  className="p-3 rounded-lg bg-white border border-amber-200 flex flex-wrap items-center justify-between gap-3"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-stone-900">
                                      {u.displayName || u.email}
                                    </p>
                                    <p className="text-xs text-stone-600">
                                      {u.email}
                                      {u.designation ? ` · ${u.designation}` : ''} · Requested:{' '}
                                      <strong className="uppercase">{(u.requestedRole || 'editor').replace('_', ' ')}</strong>
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const targetRole =
                                          u.requestedRole === 'content_manager' ? 'content_manager' : 'editor';
                                        const res = await authFetch(`/api/admin/users/${u.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ role: targetRole }),
                                        });
                                        if (res.ok) {
                                          await syncAdminRoleToFirestore({
                                            targetUid: u.uid,
                                            email: u.email,
                                            role: targetRole,
                                            status: 'active',
                                          }).catch(() => {});
                                          await showSuccess(`Approved ${u.email} as ${targetRole.replace('_', ' ')}.`);
                                        }
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-[#14452F] text-white text-xs font-semibold"
                                    >
                                      Approve Requested Role
                                    </button>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const res = await authFetch(`/api/admin/users/${u.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ role: 'viewer' }),
                                        });
                                        if (res.ok) {
                                          await syncAdminRoleToFirestore({
                                            targetUid: u.uid,
                                            email: u.email,
                                            role: 'viewer',
                                            status: 'revoked',
                                          }).catch(() => {});
                                          await showSuccess(`Declined access request for ${u.email}.`);
                                        }
                                      }}
                                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const res = await authFetch('/api/admin/users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
                          });
                          if (res.ok) {
                            setInviteEmail('');
                            await showSuccess('User role assigned.');
                          }
                        }}
                        className="flex flex-wrap gap-3"
                      >
                        <input required type="email" placeholder="Staff Google or Trust Email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm" />
                        <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as 'admin' | 'editor' | 'content_manager')} className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white">
                          <option value="admin">Administrator</option>
                          <option value="editor">Editor</option>
                          <option value="content_manager">Content Manager</option>
                        </select>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold">Assign Role</button>
                      </form>

                      <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl">
                        {cms.users.map((u) => (
                          <div key={u.id} className="p-3.5 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-stone-900">{u.email}</p>
                              <p className="text-xs text-stone-500">
                                {u.displayName || 'Staff Account'}
                                {u.designation ? ` · ${u.designation}` : ''} · Status: {u.registrationStatus || 'active'}
                              </p>
                            </div>
                            <select
                              value={u.role}
                              onChange={async (e) => {
                                const nextRole = e.target.value as 'admin' | 'editor' | 'content_manager' | 'viewer';
                                const res = await authFetch(`/api/admin/users/${u.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ role: nextRole }),
                                });
                                const j = await res.json().catch(() => ({}));
                                if (!res.ok) {
                                  setErrNotice(j.error || 'Could not update role');
                                  return;
                                }
                                await syncAdminRoleToFirestore({
                                  targetUid: u.uid,
                                  email: u.email,
                                  role: nextRole,
                                  status: nextRole === 'viewer' ? 'revoked' : 'active',
                                }).catch(() => {});
                                await showSuccess(`Updated role for ${u.email}.`);
                              }}
                              className="px-3 py-1.5 rounded border border-stone-300 text-xs bg-white"
                            >
                              <option value="admin">Administrator</option>
                              <option value="editor">Editor</option>
                              <option value="content_manager">Content Manager</option>
                              <option value="viewer">Viewer (Restricted)</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Explicit Confirmation Dialog for Google Drive Deletion */}
      {driveConfirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-xl">
            <div className="flex items-center gap-2 text-red-700 font-semibold">
              <Building2 className="w-5 h-5" />
              <span>Confirm Google Drive File Deletion</span>
            </div>
            <p className="text-sm text-stone-700">
              Are you sure you want to permanently delete <strong>{driveConfirmDelete.name}</strong> from Google Drive? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDriveConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteDriveFile}
                className="px-4 py-2 rounded-lg bg-red-700 text-white text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
