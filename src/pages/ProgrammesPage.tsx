import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { SafeImage } from '../components/SafeImage';

export function ProgrammesPage() {
  const { data } = useSite();
  const { slug } = useParams();

  const programmes = data?.programmes || [];

  if (slug) {
    const prog = programmes.find((p) => p.slug === slug);
    if (!prog) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-stone-900">Programme Not Found</h1>
          <Link to="/programmes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to All Programmes
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-[#FBFBF8] py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <Link
            to="/programmes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#14452F] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> All Programmes
          </Link>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="aspect-[16/8] bg-stone-200">
              <SafeImage src={prog.imageUrl} alt={prog.title} />
            </div>

            <div className="p-7 sm:p-10 space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#14452F]" /> {prog.location}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#14452F]" /> {prog.beneficiaries}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
                  {prog.title}
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
                <div className="space-y-2">
                  <h2 className="font-display text-lg font-bold text-stone-900">Objectives</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{prog.objectives}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-lg font-bold text-stone-900">Key Activities</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{prog.activities}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-lg font-bold text-stone-900">Outcomes</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{prog.outcomes}</p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#F3F5F0] border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14452F] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      Support or Partner for {prog.title}
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Volunteer, collaborate via CSR, or contribute directly to this grassroots initiative.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to="/donate"
                    className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold"
                  >
                    Support Programme
                  </Link>
                  <Link
                    to="/get-involved?tab=volunteer"
                    className="px-4 py-2 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-xs font-semibold"
                  >
                    Volunteer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Grassroots Field Initiatives
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Our Programmes and Activities
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Explore our community-led programmes across school education, natural farming, Women Self Help Groups, youth vocational training, health, and environmental stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {programmes.map((prog) => (
            <article
              key={prog.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-stone-200">
                  <SafeImage src={prog.imageUrl} alt={prog.title} />
                </div>
                <div className="p-6">
                  <p className="text-xs text-stone-500">{prog.location}</p>
                  <h2 className="font-display text-xl font-bold text-stone-900 mt-1">
                    {prog.title}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {prog.objectives}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 truncate max-w-[200px]">
                  {prog.beneficiaries}
                </span>
                <Link
                  to={`/programmes/${prog.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#14452F] hover:text-[#D97706] whitespace-nowrap"
                >
                  View Programme <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
