'use client';

import { STORAGE_KEYS } from '@/constants/types';
import { AddressResult } from '@/types/address';

import { useExploreActions } from './useExploreActions';
import { useExploreData } from './useExploreData';

export const useLandmarkExplore = () => {
  const data = useExploreData();
  const actions = useExploreActions();

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
