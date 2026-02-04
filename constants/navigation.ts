import { FC, SVGProps } from 'react';

import BookmarkIcon from '@/public/icons/bookmark.svg';
import HomeIcon from '@/public/icons/home.svg';
import ProfileIcon from '@/public/icons/profile.svg';

export interface NavItems {
  href: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}

export const NAV_ITEMS: NavItems[] = [
  {
    href: '/',
    label: '홈',
    icon: HomeIcon,
  },
  {
    href: '/bookmark',
    label: '북마크',
    icon: BookmarkIcon,
  },
  {
    href: '/profile',
    label: '마이페이지',
    icon: ProfileIcon,
  },
];
