import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  X,
  Youtube,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

const ABOUT_SUBLINKS = [
  { label: 'About the Organization', to: '/about' },
  { label: 'Organization Profile', to: '/about/profile' },
  { label: 'Vision, Mission and Goals', to: '/about/vision-mission' },
  { label: 'Our Objectives', to: '/about/objectives' },
  { label: 'Our Focus Areas', to: '/about/focus-areas' },
  { label: 'Our Approach', to: '/about/approach' },
  { label: 'Geographical Coverage', to: '/about/coverage' },
  { label: 'Governing Body', to: '/about/governing-body' },
  { label: 'Our Team', to: '/about/team' },
  { label: "Secretary's Message", to: '/about/secretary-message' },
  { label: 'Challenges and Our Commitment', to: '/about/challenges' },
];

const GET_INVOLVED_SUBLINKS = [
  { label: 'Volunteer With Us', to: '/get-involved?tab=volunteer' },
  { label: 'Career Opportunities', to: '/get-involved?tab=career' },
  { label: 'Internship Opportunities', to: '/get-involved?tab=internship' },
  { label: 'Partnership Opportunities', to: '/get-involved?tab=partnership' },
  { label: 'CSR Collaboration', to: '/get-involved?tab=csr' },
  { label: 'Institutional Collaboration', to: '/get-involved?tab=institutional' },
  { label: 'Donate to Our Mission', to: '/donate' },
];

export function Layout({
  children,
  quotaExceeded = false,
}: {
  children: React.ReactNode;
  quotaExceeded?: boolean;
}) {
  const { data } = useSite();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const contact = data?.settings?.contact_info;
  const focusAreas = data?.focusAreas || [];

  const phone = contact?.phone || '+91 9777110362';
  const email = contact?.email || 'secratary@saraswatiedutrust.online';
  const address = contact?.address || 'Main Road Hatapada, Kenduguda, Rayagada, Odisha – 765025, India';

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    setNewsletterMsg('');
    try {
      const res = await fetch('/api/public/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Subscription failed');
      }
      setNewsletterStatus('success');
      setNewsletterMsg('Subscribed to Trust updates.');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterMsg(err instanceof Error ? err.message : 'Unable to subscribe');
    }
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF8] text-[#1C241E]">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm no-print">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* A. Top Information Bar */}
      <div className="bg-[#0D3121] text-stone-200 text-xs border-b border-white/10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span className="tabular-nums">{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>{email}</span>
            </a>
            <span className="hidden md:inline-flex items-center gap-1.5 text-stone-300 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Rayagada, Odisha</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5">
              <a
                href={contact?.facebookUrl || '/contact'}
                aria-label="Facebook"
                className="text-stone-300 hover:text-amber-300 transition-colors p-1"
              >
                <Facebook className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href={contact?.linkedinUrl || '/contact'}
                aria-label="LinkedIn"
                className="text-stone-300 hover:text-amber-300 transition-colors p-1"
              >
                <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href={contact?.youtubeUrl || '/gallery'}
                aria-label="YouTube"
                className="text-stone-300 hover:text-amber-300 transition-colors p-1"
              >
                <Youtube className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href={contact?.instagramUrl || '/gallery'}
                aria-label="Instagram"
                className="text-stone-300 hover:text-amber-300 transition-colors p-1"
              >
                <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-stone-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>CMS</span>
            </Link>
            <Link
              to="/donate"
              className="hidden sm:inline-flex items-center font-semibold text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>

      {/* B. Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Zone */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-2 focus-visible:outline-[#14452F] rounded"
          >
            <img
              src="/assets/aistudio/Saraswati_Logo_New_20a426b0.jpeg"
              alt="Saraswati Educational Trust Logo"
              className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
            />
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[#14452F] whitespace-nowrap">
              Saraswati Educational Trust
            </span>
          </Link>

          {/* Desktop Navigation (10 Sections) */}
          <nav className="hidden xl:flex items-center gap-4 text-[13px] font-medium text-stone-700" aria-label="Main Navigation">
            <Link
              to="/"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/') ? 'border-[#14452F] text-[#14452F] font-semibold' : 'border-transparent hover:text-[#14452F]'
              }`}
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('about')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
                className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  isActive('/about')
                    ? 'border-[#14452F] text-[#14452F] font-semibold'
                    : 'border-transparent hover:text-[#14452F]'
                }`}
              >
                <span>About Us</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              {openDropdown === 'about' && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="bg-white rounded-xl border border-stone-200 shadow-lg py-2">
                    {ABOUT_SUBLINKS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#F3F5F0] hover:text-[#14452F] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/focus-areas"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/focus-areas')
                  ? 'border-[#14452F] text-[#14452F] font-semibold'
                  : 'border-transparent hover:text-[#14452F]'
              }`}
            >
              Focus Areas
            </Link>

            <Link
              to="/programmes"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/programmes')
                  ? 'border-[#14452F] text-[#14452F] font-semibold'
                  : 'border-transparent hover:text-[#14452F]'
              }`}
            >
              Programmes
            </Link>

            <Link
              to="/projects"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/projects')
                  ? 'border-[#14452F] text-[#14452F] font-semibold'
                  : 'border-transparent hover:text-[#14452F]'
              }`}
            >
              Projects
            </Link>

            <Link
              to="/impact"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/impact')
                  ? 'border-[#14452F] text-[#14452F] font-semibold'
                  : 'border-transparent hover:text-[#14452F]'
              }`}
            >
              Impact
            </Link>

            <Link
              to="/gallery"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/gallery')
                  ? 'border-[#14452F] text-[#14452F] font-semibold'
                  : 'border-transparent hover:text-[#14452F]'
              }`}
            >
              Gallery
            </Link>

            <Link
              to="/resources"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/resources')
                  ? 'border-[#14452F] text-[#14452F] font-semibold'
                  : 'border-transparent hover:text-[#14452F]'
              }`}
            >
              Resources
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('involved')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'involved' ? null : 'involved')}
                className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  isActive('/get-involved')
                    ? 'border-[#14452F] text-[#14452F] font-semibold'
                    : 'border-transparent hover:text-[#14452F]'
                }`}
              >
                <span>Get Involved</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              {openDropdown === 'involved' && (
                <div className="absolute left-0 top-full pt-2 w-60 z-50">
                  <div className="bg-white rounded-xl border border-stone-200 shadow-lg py-2">
                    {GET_INVOLVED_SUBLINKS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#F3F5F0] hover:text-[#14452F] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/contact')
                  ? 'border-[#14452F] text-[#14452F] font-semibold'
                  : 'border-transparent hover:text-[#14452F]'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Primary Action + Mobile Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/donate"
              className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              Donate Now
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="xl:hidden p-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-stone-200 max-h-[80vh] overflow-y-auto px-4 py-4 space-y-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'About Us', to: '/about' },
              { label: 'Our Focus Areas', to: '/focus-areas' },
              { label: 'Our Programmes', to: '/programmes' },
              { label: 'Our Projects', to: '/projects' },
              { label: 'Our Impact', to: '/impact' },
              { label: 'Success Stories', to: '/stories' },
              { label: 'Activities & Events', to: '/activities' },
              { label: 'Gallery', to: '/gallery' },
              { label: 'Resources & Legal Documents', to: '/resources' },
              { label: 'Get Involved', to: '/get-involved' },
              { label: 'Contact Us', to: '/contact' },
              { label: 'Admin CMS Portal', to: '/admin' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-stone-800 hover:bg-[#F3F5F0] hover:text-[#14452F]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page Body */}
      <main className="flex-1">{children}</main>

      {/* Multi-Column Footer */}
      <footer className="bg-[#0D3121] text-stone-200 border-t border-[#14452F] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Organization Logo, Tagline, Short Description */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Saraswati_Logo_New_20a426b0.jpeg"
                alt="Saraswati Educational Trust"
                className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0"
              />
              <div>
                <p className="font-display font-bold text-white text-base leading-snug">
                  Saraswati Educational Trust
                </p>
                <p className="text-xs text-amber-300 mt-0.5">Est. December 2020</p>
              </div>
            </div>
            <p className="text-xs font-medium text-amber-200 italic">
              &ldquo;Together for Inclusive and Sustainable Growth&rdquo;
            </p>
            <p className="text-xs text-stone-300 leading-relaxed">
              Registered Non-Profit Trust under the Indian Trust Act, 1882 (Reg. No. 1602001948), serving marginalized communities across Rayagada, Odisha.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li><Link to="/about" className="hover:text-amber-300 transition-colors">About Us</Link></li>
              <li><Link to="/about/profile" className="hover:text-amber-300 transition-colors">Legal &amp; Compliance</Link></li>
              <li><Link to="/programmes" className="hover:text-amber-300 transition-colors">Our Programmes</Link></li>
              <li><Link to="/projects" className="hover:text-amber-300 transition-colors">Our Projects</Link></li>
              <li><Link to="/impact" className="hover:text-amber-300 transition-colors">Our Impact</Link></li>
              <li><Link to="/stories" className="hover:text-amber-300 transition-colors">Success Stories</Link></li>
              <li><Link to="/resources" className="hover:text-amber-300 transition-colors">Resources &amp; Publications</Link></li>
              <li><Link to="/donate" className="hover:text-amber-300 transition-colors">Donate Now</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Focus Areas */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Our Focus Areas</h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              {(focusAreas.length > 0 ? focusAreas.slice(0, 7) : []).map((fa) => (
                <li key={fa.slug}>
                  <Link to="/focus-areas" className="hover:text-amber-300 transition-colors line-clamp-1">
                    {fa.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/focus-areas" className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium">
                  View All 10 Areas <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
              <p className="font-medium text-white">Saraswati Educational Trust</p>
              <p>{address}</p>
              <p className="tabular-nums">
                Phone:{' '}
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-amber-300">
                  {phone}
                </a>
              </p>
              <p>
                Email:{' '}
                <a href={`mailto:${email}`} className="hover:text-amber-300 break-all">
                  {email}
                </a>
              </p>
              <p>Website: www.saraswatiedutrust.online</p>
            </div>
          </div>

          {/* Column 5: Newsletter & Social */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Stay Connected</h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-3">
              Receive quarterly updates on our rural education, SHG, and natural farming initiatives.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address for newsletter
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="w-full px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold transition-colors disabled:opacity-60"
              >
                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {newsletterMsg && (
                <p
                  className={`text-xs flex items-center gap-1.5 ${
                    newsletterStatus === 'success' ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  {newsletterStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  <span>{newsletterMsg}</span>
                </p>
              )}
            </form>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
              <a href={contact?.facebookUrl || '/contact'} aria-label="Facebook" className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-stone-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={contact?.linkedinUrl || '/contact'} aria-label="LinkedIn" className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-stone-200">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={contact?.youtubeUrl || '/gallery'} aria-label="YouTube" className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-stone-200">
                <Youtube className="w-4 h-4" />
              </a>
              <a href={contact?.instagramUrl || '/gallery'} aria-label="Instagram" className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-stone-200">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Policies & Copyright */}
        <div className="border-t border-white/10 bg-[#082116]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-stone-300">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link to="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span aria-hidden="true">·</span>
              <Link to="/policies/terms" className="hover:text-white transition-colors">Terms and Conditions</Link>
              <span aria-hidden="true">·</span>
              <Link to="/policies/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
              <span aria-hidden="true">·</span>
              <Link to="/policies/donation" className="hover:text-white transition-colors">Donation Policy</Link>
              <span aria-hidden="true">·</span>
              <Link to="/policies/child-protection" className="hover:text-white transition-colors">Child Protection Policy</Link>
              <span aria-hidden="true">·</span>
              <Link to="/policies/safeguarding" className="hover:text-white transition-colors">Safeguarding Policy</Link>
            </div>
            <p className="text-stone-400 text-center">
              Copyright © Saraswati Educational Trust. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
