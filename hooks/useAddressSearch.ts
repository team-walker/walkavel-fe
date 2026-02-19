'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { searchAddressAction } from '@/app/actions/geocode';
import { AddressResult } from '@/types/address';

interface UseAddressSearchProps {
  onSelectAddress: (address: AddressResult) => void;
  defaultRegion?: string;
  debounceMs?: number;
}

export const useAddressSearch = ({
  onSelectAddress,
  defaultRegion = '서울특별시',
  debounceMs = 500,
}: UseAddressSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isSelecting = useRef(false);
  const currentQueryRef = useRef(query);

  const searchAddress = useCallback(
    async (searchQuery: string) => {
      setIsLoading(true);
      try {
        const addresses = await searchAddressAction(searchQuery, defaultRegion);

        // 유효한 결과만 업데이트 (최신 쿼리와 일치하는지 확인)
        if (currentQueryRef.current === searchQuery) {
          setResults(addresses);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Address search error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [defaultRegion],
  );

  useEffect(() => {
    currentQueryRef.current = query;
    if (isSelecting.current) {
      isSelecting.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchAddress(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [query, debounceMs, searchAddress]);

  const handleSelectAddress = useCallback(
    (address: AddressResult) => {
      isSelecting.current = true;
      setQuery(address.roadAddress);
      setResults([]);
      setIsOpen(false);
      onSelectAddress(address);
    },
    [onSelectAddress],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (query.length >= 2 && results.length > 0) {
      setIsOpen(true);
    }
  }, [query.length, results.length]);

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    isLoading,
    isFocused,
    setIsFocused,
    handleSelectAddress,
    handleFocus,
  };
};
