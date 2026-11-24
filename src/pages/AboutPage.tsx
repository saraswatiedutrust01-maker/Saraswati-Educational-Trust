import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Compass,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { SafeImage } from '../components/SafeImage';

const ABOUT_NAV = [
  { key: 'organization', label: 'About the Organization', path: '/about' },
  { key: 'profile', label: 'Organization Profile', path: '/about/profile' },
  { key: 'vision', label: 'Vision, Mission and Goals', path: '/about/vision-mission' },
  { key: 'objectives', label: 'Our Objectives', path: '/about/objectives' },
  { key: 'focus', label: 'Our Focus Areas', path: '/about/focus-areas' },
  { key: 'approach', label: 'Our Approach', path: '/about/approach' },
  { key: 'coverage', label: 'Geographical Coverage', path: '/about/coverage' },
  { key: 'governing', label: 'Governing Body', path: '/about/governing-body' },
  { key: 'team', label: 'Our Team', path: '/about/team' },
  { key: 'secretary', label: "Secretary's Message", path: '/about/secretary-message' },
  { key: 'challenges', label: 'Challenges and Our Commitment', path: '/about/challenges' },
];

export function AboutPage() {
  const { data } = useSite();
  const location = useLocation();

  const about = data?.settings?.about_sections;
  const focusAreas = data?.focusAreas || [];
  const teamMembers = data?.teamMembers || [];
  const governingBody = teamMembers.filter((m) => m.groupType === 'governing_body');
  const staffTeam = teamMembers.filter((m) => m.groupType === 'team');

  const activeItem =
    ABOUT_NAV.find((item) => item.path === location.pathname) || ABOUT_NAV[0];

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="border-b border-stone-200 pb-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Saraswati Educational Trust · Est. December 2020
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            {activeItem.label}
          </h1>
          <p className="mt-2 text-sm text-stone-600 max-w-2xl">
            Together for Inclusive and Sustainable Growth — Rayagada, Odisha, India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Navigation for all 11 About Pages */}
          <aside className="lg:col-span-3">
            <nav
              aria-label="About Us Sections"
              className="bg-white rounded-xl border border-stone-200 p-3 space-y-1 sticky top-24"
            >
              {ABOUT_NAV.map((item) => {
                const selected = item.path === activeItem.path;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`block px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-[#14452F] text-white'
                        : 'text-stone-700 hover:bg-[#F3F5F0] hover:text-[#14452F]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {activeItem.key === 'organization' && (
              <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-6">
                <div className="aspect-[16/8] rounded-xl overflow-hidden bg-stone-200">
                  <SafeImage
                    src="/src/assets/images/hero_tribal_education_odisha_1795521868080.jpg"
                    alt="Saraswati Educational Trust Community Education in Rayagada"
                  />
                </div>
                <div className="max-w-3xl space-y-4">
                  <h2 className="font-display text-2xl font-bold text-stone-900">
                    {about?.organization?.title || 'About the Organization'}
                  </h2>
                  <p className="text-base text-stone-800 font-medium leading-relaxed">
                    {about?.organization?.summary}
                  </p>
                  {(about?.organization?.body || '').split('\n\n').map((para, i) => (
                    <p key={i} className="text-base text-stone-600 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {activeItem.key === 'profile' && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <FileCheck2 className="w-6 h-6 text-[#14452F]" aria-hidden="true" />
                    <h2 className="font-display text-2xl font-bold text-stone-900">
                      Legal &amp; Compliance Registration Profile
                    </h2>
                  </div>

                  <dl className="divide-y divide-stone-200 text-sm">
                    {[
                      ['Organization Name', about?.profile?.legalName || 'Saraswati Educational Trust'],
                      ['Established', about?.profile?.established || 'December 2020'],
                      ['Legal Status', about?.profile?.legalStatus || 'Registered Non-Profit Trust under the Indian Trust Act, 1882'],
                      ['Head Office', about?.profile?.headOffice || 'Main Road Hatapada, Kenduguda, Rayagada, Odisha – 765025, India'],
                      ['Registration Number', about?.profile?.registrationNumber || '1602001948'],
                      ['PAN', about?.profile?.pan || 'ABBTS6380F'],
                      ['TAN', about?.profile?.tan || 'BBNS14859F'],
                      ['MCA CSR-1 Registration', about?.profile?.csr1 || 'CSR00073592'],
                      ['NGO Darpan Unique ID', about?.profile?.ngoDarpan || 'OR/2021/0295488'],
                      ['Section 12A Registration', about?.profile?.reg12A || 'ABBTS6380FE20241'],
                      ['Section 80G Registration', about?.profile?.reg80G || 'ABBTS6380FF20241'],
                      ['Udyam Registration', about?.profile?.udyam || 'UDYAM-OD-27-0005000'],
                    ].map(([label, val]) => (
                      <div key={label} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="font-medium text-stone-600">{label}</dt>
                        <dd className="sm:col-span-2 font-mono text-stone-900 font-medium">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-4">
                  <h3 className="font-display text-xl font-bold text-stone-900">
                    Official Bank Account Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <dl className="divide-y divide-stone-200 text-sm">
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-stone-600">Account Name</dt>
                        <dd className="font-semibold text-stone-900">SARASWATI EDUCATIONAL TRUST</dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-stone-600">Bank</dt>
                        <dd className="font-medium text-stone-900">DCB Bank Limited</dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-stone-600">Branch</dt>
                        <dd className="font-medium text-stone-900">Khaliguda (247), Khaliguda – 765001</dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-stone-600">Account Number</dt>
                        <dd className="font-mono font-semibold text-stone-900 tabular-nums">24713600000198</dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-stone-600">RTGS / NEFT / IFSC</dt>
                        <dd className="font-mono font-semibold text-stone-900">DCBL0000247</dd>
                      </div>
                    </dl>
                    <div className="rounded-lg border border-stone-200 overflow-hidden bg-stone-50 p-2">
                      <img
                        src="/assets/aistudio/DCB_Cencel_Cheque_b5b0e69f.jpeg"
                        alt="Cancelled Cheque of Saraswati Educational Trust DCB Bank Account"
                        className="w-full h-44 object-contain"
                      />
                      <p className="text-[11px] text-stone-500 text-center mt-1">
                        Verified Trust Bank Cheque (Cancelled Specimen)
                      </p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <Link
                      to="/resources"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline"
                    >
                      View &amp; Download Authorized Compliance Documents <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeItem.key === 'vision' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-6">
                  <div>
                    <Compass className="w-7 h-7 text-[#14452F] mb-2" aria-hidden="true" />
                    <h2 className="font-display text-2xl font-bold text-stone-900">Vision</h2>
                    <p className="mt-2 text-base text-stone-700 leading-relaxed max-w-3xl">
                      {about?.visionMission?.vision}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-stone-200">
                    <h2 className="font-display text-2xl font-bold text-stone-900">Mission</h2>
                    <p className="mt-2 text-base text-stone-700 leading-relaxed max-w-3xl">
                      {about?.visionMission?.mission}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-stone-200">
                    <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">Core Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(about?.visionMission?.values || []).map((val) => (
                        <div key={val} className="flex items-center gap-2.5 p-3.5 rounded-lg bg-[#F3F5F0]">
                          <CheckCircle2 className="w-4 h-4 text-[#14452F] shrink-0" />
                          <span className="text-sm font-semibold text-stone-800">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeItem.key === 'objectives' && (
              <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-6">
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  {about?.objectives?.title || 'Our Objectives'}
                </h2>
                <ol className="space-y-4">
                  {(about?.objectives?.items || []).map((obj, idx) => (
                    <li key={idx} className="flex gap-4 items-start pb-4 border-b border-stone-100 last:border-b-0">
                      <span className="font-mono text-sm font-semibold text-[#14452F] tabular-nums shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <p className="text-sm sm:text-base text-stone-700 leading-relaxed">{obj}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeItem.key === 'focus' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {focusAreas.map((area) => (
                  <div key={area.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    <div className="aspect-[16/9] bg-stone-200">
                      <SafeImage src={area.imageUrl} alt={area.title} />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-lg font-bold text-stone-900">{area.title}</h3>
                      <p className="mt-2 text-sm text-stone-600 leading-relaxed">{area.fullDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeItem.key === 'approach' && (
              <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-5">
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  {about?.approach?.title || 'Our Approach'}
                </h2>
                {(about?.approach?.body || '').split('\n\n').map((p, idx) => (
                  <p key={idx} className="text-base text-stone-700 leading-relaxed max-w-3xl">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {activeItem.key === 'coverage' && (
              <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#14452F]" />
                  <h2 className="font-display text-2xl font-bold text-stone-900">
                    {about?.geographicalCoverage?.title || 'Geographical Coverage'}
                  </h2>
                </div>
                {(about?.geographicalCoverage?.body || '').split('\n\n').map((p, idx) => (
                  <p key={idx} className="text-base text-stone-700 leading-relaxed max-w-3xl">
                    {p}
                  </p>
                ))}
                <div className="pt-4 border-t border-stone-200">
                  <h3 className="text-sm font-semibold text-stone-900 mb-3">Operational Regions</h3>
                  <ul className="space-y-2">
                    {(about?.geographicalCoverage?.regions || []).map((reg) => (
                      <li key={reg} className="flex items-center gap-2 text-sm text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-[#14452F] shrink-0" />
                        <span>{reg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeItem.key === 'governing' && (
              <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-stone-900">Governing Body</h2>
                    <p className="text-sm text-stone-600 mt-1">
                      Board of Trustees overseeing statutory compliance, strategic direction, and accountability.
                    </p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-[#14452F]" />
                </div>

                {governingBody.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#F3F5F0] border border-stone-200 space-y-3">
                    <p className="text-sm text-stone-700 leading-relaxed">
                      Verified Trustee profiles and designations are maintained directly in the Administration CMS from official Trust Deed records.
                    </p>
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline"
                    >
                      Manage Governing Body in CMS <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {governingBody.map((m) => (
                      <div key={m.id} className="rounded-xl border border-stone-200 bg-[#FBFBF8] overflow-hidden">
                        {m.photoUrl && (
                          <div className="aspect-square bg-stone-200">
                            <SafeImage src={m.photoUrl} alt={m.name} />
                          </div>
                        )}
                        <div className="p-5">
                          <h3 className="font-display text-lg font-bold text-stone-900">{m.name}</h3>
                          <p className="text-xs font-semibold text-[#14452F] mt-0.5">{m.designation}</p>
                          {m.bio && <p className="text-xs text-stone-600 mt-2 leading-relaxed">{m.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeItem.key === 'team' && (
              <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-stone-900">Our Team</h2>
                    <p className="text-sm text-stone-600 mt-1">
                      Educators, community mobilizers, and programme coordinators serving across Rayagada.
                    </p>
                  </div>
                  <Users className="w-6 h-6 text-[#14452F]" />
                </div>

                {staffTeam.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#F3F5F0] border border-stone-200 space-y-3">
                    <p className="text-sm text-stone-700 leading-relaxed">
                      Staff and field coordinator profiles are published directly by Trust administrators via the CMS to ensure accuracy and consent.
                    </p>
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline"
                    >
                      Manage Team Directory in CMS <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffTeam.map((m) => (
                      <div key={m.id} className="rounded-xl border border-stone-200 bg-[#FBFBF8] overflow-hidden">
                        {m.photoUrl && (
                          <div className="aspect-square bg-stone-200">
                            <SafeImage src={m.photoUrl} alt={m.name} />
                          </div>
                        )}
                        <div className="p-5">
                          <h3 className="font-display text-lg font-bold text-stone-900">{m.name}</h3>
                          <p className="text-xs font-semibold text-[#14452F] mt-0.5">{m.designation}</p>
                          {m.bio && <p className="text-xs text-stone-600 mt-2 leading-relaxed">{m.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeItem.key === 'secretary' && (
              <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-6">
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  {about?.secretaryMessage?.title || "Secretary's Message"}
                </h2>
                <div className="max-w-3xl space-y-4">
                  {(about?.secretaryMessage?.body || '').split('\n\n').map((p, idx) => (
                    <p key={idx} className="text-base text-stone-700 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="pt-4 border-t border-stone-200">
                  <p className="font-display font-semibold text-stone-900">
                    {about?.secretaryMessage?.signatoryTitle || 'Office of the Secretary, Saraswati Educational Trust'}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">Kenduguda, Rayagada, Odisha</p>
                </div>
              </div>
            )}

            {activeItem.key === 'challenges' && (
              <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-5">
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  {about?.challengesCommitment?.title || 'Challenges and Our Commitment'}
                </h2>
                {(about?.challengesCommitment?.body || '').split('\n\n').map((p, idx) => (
                  <p key={idx} className="text-base text-stone-700 leading-relaxed max-w-3xl">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
