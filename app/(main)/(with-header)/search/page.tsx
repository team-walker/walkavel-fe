'use client';

import { useRouter } from 'next/navigation';

import AddressSearch from '@/components/home/AddressSearch';
import { useLandmarkExplore } from '@/hooks/useLandmarkExplore';
import { AddressResult } from '@/types/address';

export default function SearchPage() {
  const router = useRouter();
  const { handleAddressSelect } = useLandmarkExplore();

  const onSelect = async (address: AddressResult) => {
    try {
      await handleAddressSelect(address);
      router.push('/');
    } catch (error) {
      console.error('Failed to select address:', error);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <AddressSearch onSelectAddress={onSelect} />
    </div>
  );
}
