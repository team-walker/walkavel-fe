import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LandmarkDetailResponseDto } from '@/types/model';

import LandmarkDetailClient from './LandmarkDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getLandmarkDetail(id: string): Promise<LandmarkDetailResponseDto | null> {
  const baseURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${baseURL}/tour/landmarks/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch landmark detail on server:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getLandmarkDetail(id);

  if (!data) {
    return {
      title: '장소를 찾을 수 없습니다 - Walkavel',
    };
  }

  return {
    title: `${data.detail.title} - Walkavel`,
    description: data.detail.overview?.slice(0, 160) || `${data.detail.title} 상세 정보`,
    openGraph: {
      title: data.detail.title,
      description: data.detail.overview?.slice(0, 160),
      images: [data.detail.firstimage || ''],
    },
  };
}

export default async function LandmarkDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getLandmarkDetail(id);

  if (!data) {
    notFound();
  }

  return <LandmarkDetailClient id={Number(id)} initialData={data} />;
}
