import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Lock, ShieldCheck } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const RESOURCE_CATEGORIES = [
  'All',
  'Annual Reports',
  'Project Reports',
  'Case Studies',
  'Research and Publications',
  'Newsletters',
  'Policy Documents',
  'Organizational Brochure',
  'Registration Certificates',
  'PAN and TAN Documents',
  '12A and 80G Certificates',
  'CSR-1 Certificate',
  'NGO Darpan Registration',
];

export function ResourcesPage() {
  const { data } = useSite();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const resources = data?.resources || [];
  const filtered =
    selectedCategory === 'All'
      ? resources
      : resources.filter((r) => r.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Transparency, Governance &amp; Publications
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Resources and Legal Documents
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Annual reports, project evaluations, policy frameworks, and statutory Trust registrations. Document downloads are governed by administrator publishing permissions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {RESOURCE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#14452F] text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-[#F3F5F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((doc) => {
            const canDownload = doc.isPublic && Boolean(doc.fileUrl);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <FileText className="w-4 h-4 text-[#14452F] shrink-0" />
                      <span className="font-semibold text-[#14452F]">{doc.category}</span>
                      {doc.documentNumber && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-stone-700">{doc.documentNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <h2 className="font-display text-lg font-bold text-stone-900">{doc.title}</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{doc.description}</p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                  {canDownload ? (
                    <a
                      href={`/api/public/resources/${doc.id}/download`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </a>
                  ) : (
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                        <Lock className="w-3.5 h-3.5" />
                        {doc.accessLevel === 'csr_request'
                          ? 'Authorized for CSR / Donor Verification'
                          : 'Pending CMS Publication'}
                      </span>
                      <Link
                        to="/get-involved?tab=csr"
                        className="text-xs font-semibold text-[#14452F] hover:underline whitespace-nowrap"
                      >
                        Request Copy
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Due Diligence Summary */}
        <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <ShieldCheck className="w-7 h-7 text-[#14452F] shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-xl font-bold text-stone-900">
                Institutional &amp; CSR Due Diligence Desk
              </h2>
              <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                CSR foundations, grantmakers, and government agencies may request authenticated copies of Trust Deed, 12A, 80G, CSR-1, PAN, and audited accounts directly from the Secretary&apos;s office.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold whitespace-nowrap"
          >
            Contact Compliance Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
