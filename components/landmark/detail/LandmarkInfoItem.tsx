'use client';

import { ReactNode, useEffect, useState } from 'react';

interface LandmarkInfoItemProps {
  icon: ReactNode;
  label: string;
  content?: string;
  isHtml?: boolean;
}

export function LandmarkInfoItem({ icon, label, content, isHtml }: LandmarkInfoItemProps) {
  const [sanitized, setSanitized] = useState<string>('');

  useEffect(() => {
    if (isHtml && content) {
      import('dompurify').then((mod) => {
        const DOMPurify = mod.default || mod;
        if (DOMPurify && typeof DOMPurify.sanitize === 'function') {
          DOMPurify.addHook('afterSanitizeAttributes', function (node) {
            if ('target' in node) {
              node.setAttribute('target', '_blank');
              node.setAttribute('rel', 'noopener noreferrer');
            }
          });
          setSanitized(DOMPurify.sanitize(content));
        }
      });
    }
  }, [content, isHtml]);

  if (!content) return null;

  const isPlainUrl = content.startsWith('http') && !content.includes('<a');

  return (
    <li className="border-walkavel-gray-100 flex items-start rounded-2xl border bg-white p-4">
      <div className="bg-walkavel-gray-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <div className="text-walkavel-gray-500 mb-1 text-sm">{label}</div>
        {isHtml && !isPlainUrl ? (
          <div
            className="text-walkavel-gray-900 text-[0.9375rem] leading-relaxed font-medium break-all whitespace-pre-wrap [&_a]:cursor-pointer"
            dangerouslySetInnerHTML={{ __html: sanitized || content }}
          />
        ) : (
          <div className="text-walkavel-gray-900 text-[0.9375rem] font-medium break-all">
            {(label === '홈페이지' || isPlainUrl) && content.startsWith('http') ? (
              <a
                href={content}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                {content}
              </a>
            ) : (
              content
            )}
          </div>
        )}
      </div>
    </li>
  );
}
