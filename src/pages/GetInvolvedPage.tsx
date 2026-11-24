import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Users,
  ArrowRight,
} from 'lucide-react';

const INVOLVED_TRACKS = [
  {
    key: 'volunteer',
    title: 'Volunteer With Us',
    desc: 'Support rural classrooms, remedial teaching, community health awareness, or agricultural demonstrations in Rayagada.',
    icon: Users,
  },
  {
    key: 'career',
    title: 'Career Opportunities',
    desc: 'Join our grassroots team as an educator, community mobilizer, project coordinator, or livelihood trainer.',
    icon: Briefcase,
  },
  {
    key: 'internship',
    title: 'Internship Opportunities',
    desc: 'Field research and rural development internships for MSW, MBA Rural Management, Agriculture, and Education students.',
    icon: GraduationCap,
  },
  {
    key: 'partnership',
    title: 'Partnership Opportunities',
    desc: 'Co-design community interventions with grassroots NGOs, networks, and technical agencies.',
    icon: HeartHandshake,
  },
  {
    key: 'csr',
    title: 'CSR Collaboration',
    desc: 'Partner with an MCA CSR-1 (CSR00073592), 12A & 80G compliant Trust under Schedule VII of the Companies Act, 2013.',
    icon: Building2,
  },
  {
    key: 'institutional',
    title: 'Institutional Collaboration',
    desc: 'Collaborate with universities, research bodies, Krishi Vigyan Kendras, and public welfare institutions.',
    icon: ShieldCheck,
  },
];

export function GetInvolvedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'volunteer';
  const [activeTrack, setActiveTrack] = useState(
    INVOLVED_TRACKS.some((t) => t.key === initialTab) ? initialTab : 'volunteer'
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const paramTab = searchParams.get('tab');
    if (paramTab && INVOLVED_TRACKS.some((t) => t.key === paramTab)) {
      setActiveTrack(paramTab);
    }
  }, [searchParams]);

  const currentTrack =
    INVOLVED_TRACKS.find((t) => t.key === activeTrack) || INVOLVED_TRACKS[0];

  const handleSelectTrack = (key: string) => {
    setActiveTrack(key);
    setSearchParams({ tab: key });
    setSubmittedId(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/public/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType: activeTrack,
          fullName,
          email,
          phone,
          organization,
          subject: subject || currentTrack.title,
          message,
          websiteHoneypot: honeypot,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Submission failed');
      }
      setSubmittedId(json.id);
      setFullName('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
              Join Our Mission in Rayagada, Odisha
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
              Get Involved
            </h1>
            <p className="mt-3 text-base text-stone-600 leading-relaxed">
              Collaborate with Saraswati Educational Trust as a volunteer, intern, development professional, CSR partner, or institutional ally.
            </p>
          </div>
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold whitespace-nowrap"
          >
            Donate to Our Mission <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Track Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INVOLVED_TRACKS.map((track) => {
            const Icon = track.icon;
            const selected = track.key === activeTrack;
            return (
              <button
                key={track.key}
                type="button"
                onClick={() => handleSelectTrack(track.key)}
                className={`text-left p-5 rounded-xl border transition-colors ${
                  selected
                    ? 'bg-[#14452F] text-white border-[#14452F]'
                    : 'bg-white text-stone-900 border-stone-200 hover:bg-[#F3F5F0]'
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-3 ${selected ? 'text-amber-300' : 'text-[#14452F]'}`}
                />
                <h2 className="font-display text-lg font-bold">{track.title}</h2>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    selected ? 'text-stone-200' : 'text-stone-600'
                  }`}
                >
                  {track.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Application / Enquiry Form */}
        <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-stone-900">
            {currentTrack.title} — Application &amp; Enquiry
          </h2>
          <p className="text-sm text-stone-600 mt-1 mb-6">
            Submissions are recorded directly in our Trust administration system for prompt review.
          </p>

          {submittedId ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Thank you! Your {currentTrack.title} enquiry has been submitted.</span>
              </div>
              <p className="text-xs text-emerald-800">
                Reference ID: #{submittedId}. Our team at Kenduguda, Rayagada will review your submission and respond via email or phone.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedId(null)}
                className="mt-2 text-xs font-semibold text-[#14452F] underline"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot field */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gi-name" className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="gi-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                  />
                </div>
                <div>
                  <label htmlFor="gi-email" className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="gi-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gi-phone" className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    id="gi-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                  />
                </div>
                <div>
                  <label htmlFor="gi-org" className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Organization / Institution (Optional)
                  </label>
                  <input
                    id="gi-org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gi-subject" className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Area of Interest / Role / Proposal Title
                </label>
                <input
                  id="gi-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={`e.g., ${currentTrack.title} in Rayagada`}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                />
              </div>

              <div>
                <label htmlFor="gi-message" className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Message / Background / Collaboration Details *
                </label>
                <textarea
                  id="gi-message"
                  rows={4}
                  required
                  minLength={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : `Submit ${currentTrack.title} Form`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
