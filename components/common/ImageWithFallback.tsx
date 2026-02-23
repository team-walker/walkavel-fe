'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import Logo from '@/public/images/foot-logo.svg';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export const ImageWithFallback = (props: ImageWithFallbackProps) => {
  return <ImageContent key={props.src?.toString()} {...props} />;
};

const ImageContent = ({ src, alt, className, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setError(false);
  }

  if (!src || error) {
    return (
      <div className={cn('bg-brand-blue/10 flex items-center justify-center', className)}>
        <Logo width={32} height={32} className="text-brand-blue" />
      </div>
    );
  }

  return (
    <Image {...props} src={src} alt={alt} className={className} onError={() => setError(true)} />
  );
};
