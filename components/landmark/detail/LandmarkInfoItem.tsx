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
      // 서버 사이드 렌더링 시 dompurify가 window를 참조하여 발생하는 에러를 방지하기 위해
      // 클라이언트 사이드에서만 다이내믹하게 임포트합니다.
      import('dompurify').then((mod) => {
        const DOMPurify = mod.default || mod;
        if (DOMPurify && typeof DOMPurify.sanitize === 'function') {
          setSanitized(DOMPurify.sanitize(content));
        }
      });
    }
  }, [content, isHtml]);

  if (!content) return null;

  return (
    <li className="border-walkavel-gray-100 flex items-start rounded-2xl border bg-white p-4">
      <div className="bg-walkavel-gray-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <div className="text-walkavel-gray-500 mb-1 text-[13px]">{label}</div>
        {isHtml ? (
          <div
            className="text-walkavel-gray-900 text-[15px] leading-relaxed font-medium break-all whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: sanitized || content }}
          />
        ) : (
          <div className="text-walkavel-gray-900 text-[15px] font-medium">{content}</div>
        )}
      </div>
    </li>
  );
}
