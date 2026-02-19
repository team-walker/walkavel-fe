'use client';

import { STORAGE_KEYS } from '@/constants/types';
import { AddressResult } from '@/types/address';

import { useExploreActions } from './useExploreActions';
import { useExploreData } from './useExploreData';

export const useLandmarkExplore = () => {
  const data = useExploreData();
  const actions = useExploreActions();

  // 인터렉션과 데이터가 만나는 지점만 가공
  const onAddressSelect = async (address: AddressResult) => {
    const success = await data.handleAddressSelect(address);
    if (success && !localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN)) {
      actions.setShowGuide(true);
    }
  };

  return {
    ...data,
    ...actions,
    handleAddressSelect: onAddressSelect,
  };
};
