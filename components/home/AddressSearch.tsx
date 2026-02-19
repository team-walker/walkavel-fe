'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { searchAddressGeocode } from '@/lib/api/geocode';
import { AddressResult } from '@/types/address';

interface AddressSearchProps {
  onSelectAddress: (address: AddressResult) => void;
}

export default function AddressSearch({ onSelectAddress }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSelecting = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const searchAddress = async (searchQuery: string, signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const addresses = await searchAddressGeocode(searchQuery, '서울특별시', signal);
      setResults(addresses);
      setIsOpen(true);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSelecting.current) {
      isSelecting.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchAddress(query, controller.signal);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelectAddress = (address: AddressResult) => {
    isSelecting.current = true;

    setQuery(address.roadAddress);
    setResults([]);
    setIsOpen(false);

    onSelectAddress(address);
  };

  if (!isMounted) {
    return (
      <div className="mx-auto w-full max-w-md px-6 pt-8">
        <div className="mb-6 space-y-2">
          <h1 className="text-[32px] font-bold tracking-tight text-[#101828]">어디로 갈까요?</h1>
          <p className="text-[17px] text-[#6A7282]">걷고 싶은 동네를 검색해보세요</p>
        </div>
        <div className="group relative flex items-center">
          <Search className="absolute left-5 h-5.5 w-5.5 text-[#99A1AF]" />
          <Input
            type="text"
            className="h-14.5 w-full rounded-3xl border-none bg-[#F2F4F7] px-5 pl-13 text-[17px] font-medium transition-all outline-none placeholder:text-[#99A1AF]"
            placeholder="동 이름으로 검색 (예: 인사동, 명동)"
            readOnly
            data-testid="address-search-input"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 pt-8" ref={containerRef}>
      <div className="mb-6 space-y-2">
        <h1 className="text-[32px] font-bold tracking-tight text-[#101828]">어디로 갈까요?</h1>
        <p className="text-[17px] text-[#6A7282]">걷고 싶은 동네를 검색해보세요</p>
      </div>
      <Popover open={isOpen && query.trim().length >= 2} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="group relative flex w-full items-center">
            <Search
              className={`absolute left-5 h-5.5 w-5.5 transition-colors ${
                isFocused ? 'text-[#3182F6]' : 'text-[#99A1AF]'
              }`}
            />
            <Input
              type="text"
              className={`h-14.5 w-full border-none px-5 pl-13 text-[17px] font-medium transition-all duration-300 outline-none placeholder:text-[#99A1AF] focus:ring-0 focus-visible:ring-0 ${
                isFocused || query.length > 0
                  ? 'bg-white shadow-[0_0_0_1px_#3182F6,0_10px_15px_-3px_rgba(0,0,0,0.1)]'
                  : 'bg-[#F2F4F7]'
              }`}
              style={{ borderRadius: '16px' }}
              placeholder="동 이름으로 검색 (예: 인사동, 명동)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onFocus={() => {
                setIsFocused(true);
                if (query.length >= 2 && results.length > 0) {
                  setIsOpen(true);
                }
              }}
              onBlur={() => setIsFocused(false)}
              data-testid="address-search-input"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="mt-3 w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) overflow-hidden border-[#F3F4F6] bg-white p-0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]"
          style={{ borderRadius: '20px' }}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {isLoading && (
            <motion.div
              data-testid="search-loading"
              className="absolute top-0 left-0 z-50 h-1 bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <Command className="bg-transparent">
            <CommandList className="no-scrollbar max-h-64 overflow-x-hidden overflow-y-auto">
              {!isLoading && results.length === 0 && query.length >= 2 && (
                <CommandEmpty className="h-14.5 py-4 text-center text-sm font-medium text-zinc-500">
                  검색 결과가 없습니다.
                </CommandEmpty>
              )}
              <CommandGroup
                className={`${!isLoading && results.length === 0 && query.length >= 2 ? 'p-0' : 'p-2.5'}`}
              >
                <AnimatePresence mode="popLayout">
                  {results.map((item, index) => (
                    <motion.div
                      key={item.roadAddress}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <CommandItem
                        data-testid="search-result-item"
                        onSelect={() => handleSelectAddress(item)}
                        className="group flex h-17 cursor-pointer items-center space-x-3 bg-transparent px-5 text-[#101828] transition-colors hover:bg-[#F2F4F7] aria-selected:bg-[#F2F4F7]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] transition-colors group-aria-selected:bg-[#3182F6]/10">
                          <MapPin className="h-4.5 w-4.5 text-[#99A1AF] transition-colors group-aria-selected:text-[#3182F6]" />
                        </div>
                        <span className="truncate text-[16px] font-medium tracking-[-0.31px]">
                          {item.roadAddress}
                        </span>
                      </CommandItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
