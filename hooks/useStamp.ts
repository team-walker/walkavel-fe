'use client';

import { useCallback } from 'react';

import { stampRepository } from '@/lib/repositories/stamp.repository';
import { useStampStore } from '@/store/stampStore';

export const useStamp = () => {
  const collectedIds = useStampStore((s) => s.collectedIds);
  const summary = useStampStore((s) => s.summary);
  const isSyncing = useStampStore((s) => s.isSyncing);
  const requestingIds = useStampStore((s) => s.requestingIds);
  const failedIds = useStampStore((s) => s.failedIds);
  const setSyncing = useStampStore((s) => s.setSyncing);
  const setSummary = useStampStore((s) => s.setSummary);
  const setCollectedIds = useStampStore((s) => s.setCollectedIds);
  const setCollectedLocally = useStampStore((s) => s.setCollectedLocally);
  const isCollected = useStampStore((s) => s.isCollected);
  const resetFailedState = useStampStore((s) => s.resetFailedState);
  const setRequesting = useStampStore((s) => s.setRequesting);
  const setFailed = useStampStore((s) => s.setFailed);

  const fetchStamps = useCallback(async () => {
    if (useStampStore.getState().isSyncing) return;

    setSyncing(true);
    try {
      const response = await stampRepository.getSummary();
      const idMap: Record<number, boolean> = {};
      response.landmarks.forEach((landmark) => {
        idMap[landmark.contentid] = true;
      });
      setCollectedIds(idMap);
      setSummary(response);
    } catch (error) {
      console.error('스탬프 목록 로드 실패:', error);
    } finally {
      setSyncing(false);
    }
  }, [setSyncing, setCollectedIds, setSummary]);

  return {
    collectedIds,
    summary,
    isSyncing,
    requestingIds,
    failedIds,
    fetchStamps,
    setCollectedLocally,
    isCollected,
    resetFailedState,
    setRequesting,
    setFailed,
  };
};
