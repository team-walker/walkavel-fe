import { FC, SVGProps } from 'react';

import BookmarkIcon from '@/public/images/bookmark.svg';
import HomeIcon from '@/public/images/home.svg';
import ProfileIcon from '@/public/images/profile.svg';
import SearchIcon from '@/public/images/search.svg';

export interface NavItems {
  href: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  BOOKMARK: '/bookmark',
  MYPAGE: '/mypage',
  LANDMARK_DETAIL: (id: number | string) => `/landmark/${id}`,
} as const;

export const NAV_ITEMS: NavItems[] = [
  {
    href: '/',
    label: '홈',
    icon: HomeIcon,
  },
  {
    href: '/search',
    label: '검색',
    icon: SearchIcon,
  },
  {
    href: '/bookmark',
    label: '북마크',
    icon: BookmarkIcon,
  },
  {
    href: '/mypage',
    label: '마이페이지',
    icon: ProfileIcon,
  },
];
