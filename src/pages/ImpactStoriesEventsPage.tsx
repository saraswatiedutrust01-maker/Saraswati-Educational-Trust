import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Video } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { SafeImage } from '../components/SafeImage';

export function ImpactPage() {
  const { data } = useSite();
  const stats = data?.impactStats || [];

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Transparency &amp; Measurable Outcomes
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Our Impact
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Verified outreach figures recorded directly by Saraswati Educational Trust administrators from organizational and field registers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl border border-stone-200 p-7">
              <p className="font-display text-4xl font-bold text-[#14452F] tabular-nums">
                {stat.value.toLocaleString('en-IN')}
                {stat.value > 0 ? stat.unit || '' : ''}
              </p>
              <h2 className="text-base font-semibold text-stone-900 mt-3">{stat.label}</h2>
              <p className="text-xs text-stone-500 mt-1">
                {stat.value > 0 ? stat.verificationNote : 'Pending verified CMS update'}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-stone-900">
              Audit &amp; Institutional Evaluation
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              CSR partners and institutional donors can inspect our registration records, annual reports, and project documentation in the Resources vault.
            </p>
          </div>
          <Link
            to="/resources"
            className="px-5 py-2.5 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-sm font-semibold whitespace-nowrap"
          >
            View Resources &amp; Reports
          </Link>
        </div>
      </div>
    </div>
  );
}

const STORY_CATEGORIES = [
  'All',
  'Student Success',
  'Women Entrepreneurs',
  'SHG Achievements',
  'Farmer Success',
  'Youth Employment',
  'Community Transformation',
];

export function StoriesPage() {
  const { data } = useSite();
  const { slug } = useParams();
  const [catFilter, setCatFilter] = useState('All');
  const stories = data?.stories || [];

  if (slug) {
    const story = stories.find((s) => s.slug === slug);
    if (!story) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-stone-900">Story Not Found</h1>
          <Link to="/stories" className="text-sm font-semibold text-[#14452F] hover:underline">
            Back to Success Stories
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-[#FBFBF8] py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <Link to="/stories" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#14452F] hover:underline">
            <ArrowLeft className="w-4 h-4" /> All Success Stories
          </Link>
          <article className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            {story.imageUrl && (
              <div className="aspect-[16/9] bg-stone-200">
                <SafeImage src={story.imageUrl} alt={story.title} />
              </div>
            )}
            <div className="p-7 sm:p-10 space-y-6">
              <p className="text-xs text-stone-500">
                {story.category} · {story.location} · {story.subjectTitle}
              </p>
              <h1 className="font-display text-3xl font-bold text-stone-900">{story.title}</h1>
              <p className="text-base font-medium text-stone-700 leading-relaxed">{story.summary}</p>
              <div className="pt-4 border-t border-stone-200 space-y-4 text-stone-700 leading-relaxed">
                {story.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              {story.videoUrl && /^https?:\/\//i.test(story.videoUrl.trim()) && (
                <div className="pt-4 border-t border-stone-200">
                  <a
                    href={story.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#14452F] hover:underline"
                  >
                    <Video className="w-4 h-4" /> Watch Field Video Story
                  </a>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  const filtered =
    catFilter === 'All'
      ? stories
      : stories.filter((s) => s.category.toLowerCase() === catFilter.toLowerCase());

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Community Transformation
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Success Stories
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Consent-verified journeys of students, women entrepreneurs, SHGs, farmers, and youth from Rayagada, Odisha.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STORY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                catFilter === cat
                  ? 'bg-[#14452F] text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-[#F3F5F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-10 text-center space-y-3">
            <h2 className="font-display text-xl font-bold text-stone-900">
              Verified Stories Published via CMS
            </h2>
            <p className="text-sm text-stone-600 max-w-xl mx-auto">
              To uphold integrity and consent, Saraswati Educational Trust publishes only authenticated stories submitted and approved in the Administration CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((st) => (
              <article key={st.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between">
                <div>
                  {st.imageUrl && (
                    <div className="aspect-[4/3] bg-stone-200">
                      <SafeImage src={st.imageUrl} alt={st.title} />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-stone-500">
                      {st.category} · {st.location}
                    </p>
                    <h2 className="font-display text-xl font-bold text-stone-900 mt-1">{st.title}</h2>
                    <p className="mt-2 text-sm text-stone-600 line-clamp-3">{st.summary}</p>
                  </div>
                </div>
                <div className="px-6 pb-5 pt-3 border-t border-stone-100">
                  <Link
                    to={`/stories/${st.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#14452F] hover:text-[#D97706]"
                  >
                    Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ActivitiesPage() {
  const { data } = useSite();
  const activities = data?.activities || [];

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Events &amp; Grassroots Updates
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Latest Activities and Events
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Chronological updates on village camps, school drives, farmer workshops, and community celebrations organized by Saraswati Educational Trust.
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-10 text-center space-y-3">
            <Calendar className="w-8 h-8 text-[#14452F] mx-auto" />
            <h2 className="font-display text-xl font-bold text-stone-900">
              Field Activity Log Ready in CMS
            </h2>
            <p className="text-sm text-stone-600 max-w-xl mx-auto">
              Authorized staff can publish dated community events, photographs, and location notes directly from the Admin CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {activities.map((act) => (
              <article key={act.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                {act.imageUrl && (
                  <div className="aspect-[16/10] bg-stone-200">
                    <SafeImage src={act.imageUrl} alt={act.title} />
                  </div>
                )}
                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>{act.eventDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {act.location}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-stone-900">{act.title}</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{act.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
