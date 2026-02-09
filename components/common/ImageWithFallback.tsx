'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export const ImageWithFallback = ({
  src,
  fallbackSrc = '/images/placeholder.png',
  alt,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      key={src?.toString()}
      src={error ? fallbackSrc : src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
};
