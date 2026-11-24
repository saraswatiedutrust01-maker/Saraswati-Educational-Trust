import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sprout,
  Users,
  BookOpen,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { SafeImage } from '../components/SafeImage';

function AnimatedCounter({ target, unit }: { target: number; unit: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setDisplay(0);
      return;
    }
    const duration = 900;
    const steps = 24;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      current = step >= steps ? target : Math.round(increment * step);
      setDisplay(current);
      if (step >= steps) {
        window.clearInterval(timer);
      }
    }, duration / steps);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <span className="tabular-nums font-display text-3xl sm:text-4xl font-bold text-[#14452F]">
      {display.toLocaleString('en-IN')}
      {target > 0 ? unit : ''}
    </span>
  );
}

export function HomePage() {
  const { data, loading } = useSite();
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = data?.settings?.hero_slides || [];
  const about = data?.settings?.about_sections;
  const stats = data?.impactStats || [];
  const focusAreas = data?.focusAreas || [];
  const programmes = data?.programmes || [];
  const projects = data?.projects || [];
  const stories = data?.stories || [];
  const activities = data?.activities || [];
  const gallery = data?.gallery || [];
  const partners = data?.partners || [];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[slideIndex] || {
    id: 'default',
    title: 'Together for Inclusive and Sustainable Growth',
    subtitle:
      'Empowering marginalized communities through education, livelihood opportunities, skill development, health, environmental sustainability and community participation.',
    imageUrl: '/src/assets/images/hero_tribal_education_odisha_1795521868080.jpg',
    locationLabel: 'Rayagada District, Odisha',
  };

  return (
    <div>
      {/* C. Hero Banner Slider */}
      <section className="relative h-[540px] sm:h-[600px] lg:h-[640px] bg-[#0D3121] overflow-hidden">
        <SafeImage
          src={activeSlide.imageUrl}
          alt={activeSlide.title}
          loading="eager"
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-14 sm:pb-16">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-medium tracking-wider uppercase text-amber-300 mb-3">
              Saraswati Educational Trust · {activeSlide.locationLabel || 'Rayagada, Odisha'}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold text-white leading-[1.12] tracking-tight">
              {activeSlide.title}
            </h1>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-stone-100 leading-relaxed max-w-2xl">
              {activeSlide.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/programmes"
                className="px-6 py-3 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Explore Our Work
              </Link>
              <Link
                to="/donate"
                className="px-6 py-3 rounded-lg bg-white text-[#14452F] hover:bg-stone-100 text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Support Our Mission
              </Link>
              <Link
                to="/get-involved?tab=partnership"
                className="px-6 py-3 rounded-lg border border-white/60 text-white hover:bg-white/10 text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Partner With Us
              </Link>
            </div>
          </div>

          {slides.length > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    aria-label={`View slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      idx === slideIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                  aria-label="Previous slide"
                  className="p-2 rounded-lg bg-black/40 border border-white/25 text-white hover:bg-black/60"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
                  aria-label="Next slide"
                  className="p-2 rounded-lg bg-black/40 border border-white/25 text-white hover:bg-black/60"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* D. Who We Are */}
      <section className="py-16 lg:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
              Registered Non-Profit Trust · Est. December 2020
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
              Who We Are
            </h2>
            <p className="text-base text-stone-700 leading-relaxed">
              {about?.organization?.summary ||
                'Saraswati Educational Trust is a registered non-profit organization established in December 2020 with a commitment to promoting inclusive and sustainable development among marginalized and underserved communities.'}
            </p>
            <p className="text-base text-stone-600 leading-relaxed">
              The organization primarily works with Scheduled Tribes, Scheduled Castes, women, children, youth, persons with disabilities and economically weaker families in rural and tribal regions of Rayagada, Odisha. Our interventions focus on addressing poverty, inequality and social exclusion through education, skill development, livelihood promotion, community empowerment, healthcare awareness, environmental protection and social inclusion.
            </p>
            <p className="text-base text-stone-600 leading-relaxed">
              We believe that sustainable development can only be achieved when communities actively participate in identifying their needs, developing solutions and building their own future. Our tagline is &ldquo;Together for Inclusive and Sustainable Growth.&rdquo;
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-sm font-semibold transition-colors"
              >
                Read More
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/about/profile"
                className="text-sm font-semibold text-[#14452F] hover:underline"
              >
                View Legal &amp; Compliance Profile
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-stone-200 bg-[#F3F5F0] p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/Saraswati_Logo_New_20a426b0.jpeg"
                  alt="Saraswati Educational Trust Official Seal"
                  className="w-16 h-16 rounded-full object-cover border border-stone-300 shrink-0"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    Statutory Credentials
                  </h3>
                  <p className="text-xs text-stone-600">
                    Indian Trust Act, 1882 · Rayagada, Odisha
                  </p>
                </div>
              </div>
              <dl className="divide-y divide-stone-200 text-xs sm:text-sm">
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600">Trust Reg. No.</dt>
                  <dd className="font-mono font-medium text-stone-900 tabular-nums">1602001948</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600">MCA CSR-1</dt>
                  <dd className="font-mono font-medium text-stone-900">CSR00073592</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600">NGO Darpan</dt>
                  <dd className="font-mono font-medium text-stone-900">OR/2021/0295488</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600">12A Registration</dt>
                  <dd className="font-mono font-medium text-stone-900">ABBTS6380FE20241</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600">80G Registration</dt>
                  <dd className="font-mono font-medium text-stone-900">ABBTS6380FF20241</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600">PAN / TAN</dt>
                  <dd className="font-mono font-medium text-stone-900">ABBTS6380F / BBNS14859F</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* E. Vision, Mission and Core Values */}
      <section className="py-16 bg-[#F3F5F0] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-8">
              <Compass className="w-7 h-7 text-[#14452F] mb-3" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">Our Vision</h2>
              <p className="text-stone-700 leading-relaxed">
                {about?.visionMission?.vision ||
                  'To build an inclusive, educated, empowered and sustainable society where every individual has equal opportunities, dignity and access to essential resources.'}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-8">
              <Sprout className="w-7 h-7 text-[#D97706] mb-3" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">Our Mission</h2>
              <p className="text-stone-700 leading-relaxed">
                {about?.visionMission?.mission ||
                  'To empower marginalized and underserved communities through quality education, skill development, sustainable livelihoods, environmental conservation, healthcare awareness and community-led development.'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-8">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-4">Core Values</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
              {(
                about?.visionMission?.values || [
                  'Equality and Inclusion',
                  'Transparency and Accountability',
                  'Community Participation',
                  'Sustainability',
                  'Empowerment',
                  'Integrity',
                  'Human Dignity',
                ]
              ).map((val, idx) => (
                <div
                  key={val}
                  className="p-3.5 rounded-lg bg-[#FBFBF8] border border-stone-200 flex flex-col justify-between"
                >
                  <span className="font-mono text-xs text-stone-400 tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className="font-semibold text-stone-800 mt-2 leading-snug">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* F. Our Core Focus Areas (10 Image Cards) */}
      <section className="py-16 lg:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
                Holistic Grassroots Interventions
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Our Core Focus Areas
              </h2>
            </div>
            <Link
              to="/focus-areas"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline whitespace-nowrap"
            >
              Explore All 10 Focus Areas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {focusAreas.map((area) => (
              <article
                key={area.id}
                className="group rounded-xl border border-stone-200 bg-[#FBFBF8] overflow-hidden flex flex-col transition-shadow hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <SafeImage
                    src={area.imageUrl}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-stone-900 leading-snug">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {area.shortDescription}
                    </p>
                  </div>
                  <Link
                    to={`/focus-areas?area=${area.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#14452F] hover:text-[#D97706] transition-colors"
                  >
                    Explore More <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* G. Our Programmes and Activities (12 Dynamic Programmes) */}
      <section className="py-16 lg:py-20 bg-[#F3F5F0] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
                Community Action on the Ground
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Our Programmes and Activities
              </h2>
            </div>
            <Link
              to="/programmes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline whitespace-nowrap"
            >
              View All Programmes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((prog) => (
              <article
                key={prog.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="aspect-[16/10] bg-stone-200 overflow-hidden">
                    <SafeImage src={prog.imageUrl} alt={prog.title} />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-stone-500 mb-1.5">{prog.location}</p>
                    <h3 className="font-display text-lg font-bold text-stone-900">
                      {prog.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600 leading-relaxed line-clamp-2">
                      {prog.objectives}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-5 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 truncate max-w-[190px]">
                    {prog.beneficiaries}
                  </span>
                  <Link
                    to={`/programmes/${prog.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#14452F] hover:text-[#D97706] whitespace-nowrap"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* H. Our Impact (Editable Animated Counters - Zero Invented Figures) */}
      <section className="py-16 lg:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
              Verified Organizational Records
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Our Impact Across Rayagada
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              All impact metrics reflect verified figures maintained by Trust administrators directly from organizational records.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="p-6 rounded-xl border border-stone-200 bg-[#FBFBF8] flex flex-col justify-between"
              >
                <AnimatedCounter target={stat.value} unit={stat.unit || ''} />
                <div className="mt-3">
                  <p className="text-sm font-semibold text-stone-900">{stat.label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {stat.value > 0
                      ? stat.verificationNote || 'Verified Records'
                      : 'Pending CMS verification'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I. Featured Projects */}
      <section className="py-16 lg:py-20 bg-[#F3F5F0] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
                Structured Project Portfolio
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Featured Projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline whitespace-nowrap"
            >
              Explore All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.slice(0, 4).map((proj) => (
              <article
                key={proj.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/9] bg-stone-200 overflow-hidden">
                  <SafeImage src={proj.imageUrl} alt={proj.title} />
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-[#14452F]">{proj.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span>Status: {proj.status}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-stone-900">
                      {proj.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
                      {proj.objectives}
                    </p>
                    <p className="mt-3 text-xs text-stone-500">
                      <strong className="text-stone-700">Target Beneficiaries:</strong>{' '}
                      {proj.targetBeneficiaries}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:text-[#D97706]"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                    {proj.reportFileUrl && /^(\/|https?:\/\/)/i.test(proj.reportFileUrl.trim()) && (
                      <a
                        href={proj.reportFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-stone-600 hover:text-[#14452F] underline"
                      >
                        Project Report
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* J. Success Stories & K. Latest Activities */}
      <section className="py-16 lg:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* J. Success Stories */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
                  Voices of Resilience
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Success Stories
                </h2>
              </div>
              <Link to="/stories" className="text-sm font-semibold text-[#14452F] hover:underline">
                All Stories
              </Link>
            </div>

            {stories.length === 0 ? (
              <div className="rounded-xl border border-stone-200 bg-[#FBFBF8] p-7 space-y-3">
                <BookOpen className="w-6 h-6 text-[#14452F]" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-stone-900">
                  Verified Beneficiary Stories
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  We publish only consent-verified stories from students, women entrepreneurs, SHG collectives, farmers, and trained youth through our editorial CMS.
                </p>
                <Link
                  to="/stories"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline"
                >
                  Explore Story Categories <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stories.slice(0, 3).map((st) => (
                  <article
                    key={st.id}
                    className="rounded-xl border border-stone-200 bg-[#FBFBF8] p-5 flex gap-4 items-start"
                  >
                    {st.imageUrl && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                        <SafeImage src={st.imageUrl} alt={st.title} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-stone-500">
                        {st.category} · {st.location}
                      </p>
                      <h3 className="font-display text-base font-bold text-stone-900 mt-1">
                        {st.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">{st.summary}</p>
                      <Link
                        to={`/stories/${st.slug}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#14452F] hover:underline"
                      >
                        Read Story <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* K. Latest Activities and Events */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
                  Field Diary
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Latest Activities and Events
                </h2>
              </div>
              <Link to="/activities" className="text-sm font-semibold text-[#14452F] hover:underline">
                View All
              </Link>
            </div>

            {activities.length === 0 ? (
              <div className="rounded-xl border border-stone-200 bg-[#FBFBF8] p-7 space-y-3">
                <Calendar className="w-6 h-6 text-[#D97706]" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-stone-900">
                  Field Programmes &amp; Community Events
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Ongoing grassroots drives across Kenduguda and Rayagada—including School Kit distributions, Farmer Field Schools, SHG meetings, and Plantation camps—are published directly by our field team.
                </p>
                <Link
                  to="/activities"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline"
                >
                  Open Activities Calendar <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 3).map((act) => (
                  <article
                    key={act.id}
                    className="rounded-xl border border-stone-200 bg-[#FBFBF8] p-5 flex gap-4 items-start"
                  >
                    {act.imageUrl && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                        <SafeImage src={act.imageUrl} alt={act.title} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-stone-500">
                        {act.eventDate} · {act.location}
                      </p>
                      <h3 className="font-display text-base font-bold text-stone-900 mt-1">
                        {act.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">{act.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* L. Photo and Video Gallery */}
      <section className="py-16 lg:py-20 bg-[#F3F5F0] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
                Visual Documentation
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Photo and Video Gallery
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline"
            >
              Browse Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                to="/gallery"
                className="group rounded-xl overflow-hidden bg-white border border-stone-200"
              >
                <div className="aspect-[4/3] bg-stone-200 overflow-hidden">
                  <SafeImage
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-stone-500">{item.category}</p>
                  <h3 className="font-display text-base font-semibold text-stone-900 mt-1">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* M. Our Partners */}
      <section className="py-14 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
                Institutional &amp; CSR Alliances
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Our Partners
              </h2>
            </div>
            <Link
              to="/get-involved?tab=csr"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline"
            >
              CSR &amp; Institutional Collaboration <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {partners.length === 0 ? (
            <div className="rounded-xl border border-stone-200 bg-[#FBFBF8] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <h3 className="font-display text-lg font-bold text-stone-900">
                  CSR-1 &amp; 80G Compliant Implementation Partner in Rayagada, Odisha
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Saraswati Educational Trust is registered under MCA CSR-1 (CSR00073592), 12A, 80G, and NITI Aayog NGO Darpan. Approved donor, CSR, institutional, and government partner logos managed via our CMS appear here.
                </p>
              </div>
              <Link
                to="/get-involved?tab=csr"
                className="px-5 py-2.5 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-sm font-semibold whitespace-nowrap"
              >
                Partner With Us
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl border border-stone-200 bg-[#FBFBF8] flex flex-col items-center justify-center text-center"
                >
                  {p.logoUrl ? (
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="h-14 object-contain mb-3"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ShieldCheck className="w-8 h-8 text-[#14452F] mb-2" />
                  )}
                  <p className="text-sm font-semibold text-stone-900">{p.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{p.partnerType}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* N. Get Involved */}
      <section className="py-16 lg:py-20 bg-[#F3F5F0] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
              Participate in Change
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Get Involved
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Become a Volunteer',
                desc: 'Contribute your time and mentoring skills in village classrooms, youth trainings, and awareness drives.',
                to: '/get-involved?tab=volunteer',
                icon: Users,
              },
              {
                title: 'Partner With Us',
                desc: 'Collaborate through CSR grants, institutional alliances, and technical resource sharing in Rayagada.',
                to: '/get-involved?tab=partnership',
                icon: HeartHandshake,
              },
              {
                title: 'Support Our Programmes',
                desc: 'Sponsor school kits, natural farming demos, or women SHG capacity-building workshops.',
                to: '/get-involved?tab=csr',
                icon: Sprout,
              },
              {
                title: 'Become a Donor',
                desc: 'Make a transparent contribution via UPI, cards, or bank transfer with instant receipt acknowledgement.',
                to: '/donate',
                icon: ShieldCheck,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    <Icon className="w-7 h-7 text-[#14452F] mb-4" aria-hidden="true" />
                    <h3 className="font-display text-lg font-bold text-stone-900">{card.title}</h3>
                    <p className="mt-2 text-sm text-stone-600 leading-relaxed">{card.desc}</p>
                  </div>
                  <Link
                    to={card.to}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:text-[#D97706]"
                  >
                    Enquire Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* O. Donate Banner & P. Contact Summary */}
      <section className="py-16 bg-[#14452F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              12A &amp; 80G Registered Charitable Trust
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Support Inclusive Growth in Rural Odisha
            </h2>
            <p className="text-stone-200 text-base leading-relaxed max-w-2xl">
              Your contribution directly supports rural children&apos;s schooling, Women Self Help Groups, natural farming demonstrations, and preventive health awareness across Rayagada.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/donate"
                className="px-6 py-3 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors"
              >
                Donate Now
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-lg border border-white/40 hover:bg-white/10 text-white text-sm font-semibold transition-colors"
              >
                Contact Head Office
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0D3121] rounded-xl border border-white/15 p-6 space-y-3 text-sm">
            <h3 className="font-display text-lg font-semibold text-white">Head Office</h3>
            <p className="text-stone-300">
              Main Road Hatapada, Kenduguda, Rayagada, Odisha – 765025, India
            </p>
            <p className="text-stone-300 tabular-nums">Phone: +91 9777110362</p>
            <p className="text-stone-300">Email: secratary@saraswatiedutrust.online</p>
            <div className="pt-2 flex items-center gap-4 text-xs">
              <Link to="/contact" className="text-amber-300 hover:underline font-semibold">
                View Map &amp; Send Message
              </Link>
              <a
                href="https://wa.me/919777110362"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:underline font-semibold"
              >
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div className="sr-only" role="status">
          Loading organization content
        </div>
      )}
    </div>
  );
}
