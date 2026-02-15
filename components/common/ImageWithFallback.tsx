'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

import Logo from '@/public/images/foot-logo.svg';

export const ImageWithFallback = ({ src, alt, className, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setError(false);
  }

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-[#3182F6]/10 ${className}`}>
        <Logo width={32} height={32} className="text-[#3182F6]" />
      </div>
    );
  }

  return (
    <Image {...props} src={src} alt={alt} className={className} onError={() => setError(true)} />
  );
};
