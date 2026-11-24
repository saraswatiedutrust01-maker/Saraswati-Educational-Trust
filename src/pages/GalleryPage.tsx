import { useState } from 'react';
import { Video, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { SafeImage } from '../components/SafeImage';
import { GalleryItem } from '../types/cms';

const GALLERY_CATEGORIES = [
  'All',
  'Education',
  'Women Empowerment',
  'Agriculture',
  'Environment',
  'Health and Sanitation',
  'Skill Development',
  'Community Development',
  'Events and Celebrations',
];

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.replace('/', '')}`;
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function GalleryPage() {
  const { data } = useSite();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const items = data?.gallery || [];
  const filtered =
    selectedCategory === 'All'
      ? items
      : items.filter((i) => i.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Field Photography &amp; Videos
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Photo and Video Gallery
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Visual records across Education, Women Empowerment, Agriculture, Environment, Health and Sanitation, Skill Development, Community Development, and Events.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {GALLERY_CATEGORIES.map((cat) => (
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
          <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
            <p className="text-sm text-stone-600">
              No gallery media uploaded under {selectedCategory} yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((item) => {
              const ytEmbed = item.mediaType === 'video' ? getYoutubeEmbedUrl(item.mediaUrl) : null;
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col"
                >
                  {item.mediaType === 'video' ? (
                    <div className="aspect-[4/3] bg-stone-900 flex items-center justify-center">
                      {ytEmbed ? (
                        <iframe
                          src={ytEmbed}
                          title={item.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : /^(\/|https?:\/\/)/i.test(item.mediaUrl.trim()) ? (
                        <a
                          href={item.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 text-white text-xs font-semibold hover:text-amber-300"
                        >
                          <Video className="w-8 h-8" />
                          <span>Open Video</span>
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="aspect-[4/3] bg-stone-200 overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-[#14452F]"
                    >
                      <SafeImage
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-stone-500">{item.category}</p>
                    <h2 className="font-display text-lg font-bold text-stone-900 mt-1">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">{item.caption}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={previewItem.title}
        >
          <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200">
              <div>
                <p className="text-xs text-stone-500">{previewItem.category}</p>
                <h3 className="font-display text-lg font-bold text-stone-900">{previewItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                aria-label="Close preview"
                className="p-2 rounded-lg hover:bg-stone-100 text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] bg-stone-950 flex items-center justify-center overflow-hidden">
              <SafeImage
                src={previewItem.mediaUrl}
                alt={previewItem.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="px-5 py-3 text-sm text-stone-600 bg-stone-50">
              {previewItem.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
