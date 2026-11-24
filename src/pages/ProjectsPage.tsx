import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Download, MapPin, Calendar, Users } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { SafeImage } from '../components/SafeImage';

const PROJECT_CATEGORIES = [
  'All',
  'Education',
  'Livelihood',
  'Agriculture',
  'Women Empowerment',
  'Health',
  'WASH',
  'Environment',
  'Tribal Development',
];

export function ProjectsPage() {
  const { data } = useSite();
  const { slug } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const projects = data?.projects || [];

  if (slug) {
    const project = projects.find((p) => p.slug === slug);
    if (!project) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-stone-900">Project Not Found</h1>
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to All Projects
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-[#FBFBF8] py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#14452F] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> All Projects
          </Link>

          <article className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="aspect-[16/8] bg-stone-200">
              <SafeImage src={project.imageUrl} alt={project.title} />
            </div>

            <div className="p-7 sm:p-10 space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-[#14452F]">{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {project.location}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {project.duration}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Status: {project.status}</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
                  {project.title}
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-[#F3F5F0] border border-stone-200 text-sm">
                <div>
                  <span className="text-xs text-stone-500 block">Target Beneficiaries</span>
                  <span className="font-medium text-stone-900 flex items-center gap-1.5 mt-1">
                    <Users className="w-4 h-4 text-[#14452F] shrink-0" />
                    {project.targetBeneficiaries}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-500 block">Budget Disclosure</span>
                  <span className="font-medium text-stone-900 mt-1 block">
                    {project.budgetDisclosed || 'Available on CSR / Donor Request'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900">Project Overview</h2>
                  <p className="mt-2 text-stone-700 leading-relaxed">{project.overview}</p>
                </div>

                <div className="pt-5 border-t border-stone-200">
                  <h2 className="font-display text-xl font-bold text-stone-900">Problem Statement</h2>
                  <p className="mt-2 text-stone-700 leading-relaxed">{project.problemStatement}</p>
                </div>

                <div className="pt-5 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-stone-900">Objectives</h2>
                    <p className="mt-2 text-sm text-stone-700 leading-relaxed">{project.objectives}</p>
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-stone-900">Key Activities</h2>
                    <p className="mt-2 text-sm text-stone-700 leading-relaxed">{project.activities}</p>
                  </div>
                </div>

                <div className="pt-5 border-t border-stone-200">
                  <h2 className="font-display text-xl font-bold text-stone-900">Outputs and Outcomes</h2>
                  <p className="mt-2 text-stone-700 leading-relaxed">{project.outputsOutcomes}</p>
                </div>
              </div>

              {(() => {
                const isSafeHref = (u?: string | null): u is string =>
                  Boolean(u && /^(\/|https?:\/\/)/i.test(u.trim()));
                const reportUrl = isSafeHref(project.reportFileUrl) ? project.reportFileUrl : null;
                const donorUrl = isSafeHref(project.donorDocumentUrl) ? project.donorDocumentUrl : null;
                if (!reportUrl && !donorUrl) return null;
                return (
                  <div className="pt-5 border-t border-stone-200 flex flex-wrap gap-4">
                    {reportUrl && (
                      <a
                        href={reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#14452F] text-white text-xs font-semibold hover:bg-[#1E5B3F]"
                      >
                        <Download className="w-4 h-4" /> Download Project Report
                      </a>
                    )}
                    {donorUrl && (
                      <a
                        href={donorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100"
                      >
                        <Download className="w-4 h-4" /> Donor-Approved Document
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>
          </article>
        </div>
      </div>
    );
  }

  const filtered =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Project Presentation System
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Our Projects
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Structured community interventions across Education, Livelihood, Agriculture, Women Empowerment, Health, WASH, Environment, and Tribal Development.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
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
            <p className="font-display text-lg font-semibold text-stone-900">
              No projects listed under {selectedCategory} yet
            </p>
            <p className="text-sm text-stone-600">
              Trust administrators can publish new project profiles and donor reports from the CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((proj) => (
              <article
                key={proj.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] bg-stone-200">
                    <SafeImage src={proj.imageUrl} alt={proj.title} />
                  </div>
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-[#14452F]">{proj.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span>Status: {proj.status}</span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-stone-900">{proj.title}</h2>
                    <p className="mt-2.5 text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {proj.overview}
                    </p>
                  </div>
                </div>
                <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14452F] hover:text-[#D97706]"
                  >
                    Read Full Project Brief <ArrowRight className="w-4 h-4" />
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
