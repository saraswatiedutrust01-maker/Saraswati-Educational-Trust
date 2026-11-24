import { useState } from 'react';
import { Leaf } from 'lucide-react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function SafeImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#14452F] to-[#1E5B3F] text-white/90 p-6 text-center"
        role="img"
        aria-label={alt}
      >
        <Leaf className="w-8 h-8 mb-2 text-amber-300" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-white/85 max-w-xs line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
