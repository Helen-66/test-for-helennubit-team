import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function LazyImage({ src, alt, className }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error || !src) {
    return <div className={`${className ?? ''} lazy-image--placeholder`} aria-label={alt} />;
  }

  return (
    <div className={`lazy-image-wrapper ${loaded ? 'lazy-image--loaded' : ''}`}>
      {!loaded && <div className={`${className ?? ''} skeleton skeleton--poster`} />}
      <img
        className={className}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={loaded ? undefined : { opacity: 0, position: 'absolute' }}
      />
    </div>
  );
}
