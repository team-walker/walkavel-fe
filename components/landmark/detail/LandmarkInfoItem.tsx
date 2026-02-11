'use client';

import DOMPurify from 'dompurify';
import { ReactNode } from 'react';

interface LandmarkInfoItemProps {
  icon: ReactNode;
  label: string;
  content?: string;
  isHtml?: boolean;
}

export function LandmarkInfoItem({ icon, label, content, isHtml }: LandmarkInfoItemProps) {
  if (!content) return null;

  return (
    <li className="flex items-start rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4F6]">
        {icon}
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <div className="mb-1 text-[13px] text-gray-500">{label}</div>
        {isHtml ? (
          <div
            className="text-[15px] leading-relaxed font-medium break-all whitespace-pre-wrap text-gray-900"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        ) : (
          <div className="text-[15px] font-medium text-gray-900">{content}</div>
        )}
      </div>
    </li>
  );
}
