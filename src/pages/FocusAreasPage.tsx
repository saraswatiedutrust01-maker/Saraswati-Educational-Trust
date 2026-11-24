import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { SafeImage } from '../components/SafeImage';

export function FocusAreasPage() {
  const { data } = useSite();
  const [searchParams] = useSearchParams();
  const highlightedSlug = searchParams.get('area');

  const focusAreas = data?.focusAreas || [];
  const programmes = data?.programmes || [];

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Integrated Community Development
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Our Core Focus Areas
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Addressing poverty, inequality, and social exclusion across ten interconnected thematic pillars in rural and tribal Rayagada, Odisha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {focusAreas.map((area, index) => {
            const linkedProgs = programmes.filter((p) => p.focusAreaSlug === area.slug);
            const isHighlighted = highlightedSlug === area.slug;
            return (
              <article
                key={area.id}
                className={`rounded-xl border bg-white overflow-hidden flex flex-col ${
                  isHighlighted ? 'border-[#14452F] ring-2 ring-[#14452F]/20' : 'border-stone-200'
                }`}
              >
                <div className="aspect-[16/9] bg-stone-200 overflow-hidden">
                  <SafeImage src={area.imageUrl} alt={area.title} />
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="font-mono text-xs text-stone-400 tabular-nums">
                      Focus Area {String(index + 1).padStart(2, '0')}
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                      {area.title}
                    </h2>
                    <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                      {area.fullDescription}
                    </p>
                  </div>

                  {linkedProgs.length > 0 && (
                    <div className="pt-4 border-t border-stone-100">
                      <p className="text-xs font-semibold text-stone-700 mb-2">
                        Related Programmes:
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {linkedProgs.map((lp) => (
                          <Link
                            key={lp.id}
                            to={`/programmes/${lp.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#14452F] hover:text-[#D97706]"
                          >
                            {lp.title} <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
