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
      const addresses = await searchAddressGeocode(searchQuery, signal);
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
    console.log('address', address);

    setQuery(address.roadAddress);
    setResults([]);
    setIsOpen(false);

    onSelectAddress(address);
  };

  if (!isMounted) {
    return (
      <div className="mx-auto w-full max-w-md pt-8">
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            어디로 <br />
            <span className="text-blue-600">워커블</span>할까요?
          </h1>
        </div>
        <div className="group relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-zinc-400" />
          <Input
            type="text"
            className="h-[60px] w-full rounded-2xl border border-transparent bg-[#F2F4F7] px-4 pl-12 text-lg font-medium transition-all outline-none placeholder:text-zinc-400"
            placeholder="동 이름으로 검색 (예: 인사동, 명동)"
            readOnly
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md pt-8" ref={containerRef}>
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          어디로 <br />
          <span className="text-blue-600">워커블</span>할까요?
        </h1>
      </div>
      <Popover open={isOpen && query.trim().length >= 2} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="group relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-blue-500" />
            <Input
              type="text"
              className={`h-[60px] w-full rounded-2xl border-none px-4 pl-12 text-lg font-medium transition-all duration-300 outline-none placeholder:text-zinc-400 focus:ring-0 focus-visible:ring-0 ${
                isFocused || query.length > 0 ? 'bg-white shadow-md' : 'bg-[#F2F4F7]'
              }`}
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
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="mt-2 w-(--radix-popover-trigger-width) overflow-hidden rounded-3xl border-zinc-100 bg-white/80 p-2 shadow-2xl backdrop-blur-xl"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {isLoading && (
            <motion.div
              className="absolute top-0 left-0 h-1 bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <Command className="bg-transparent">
            <CommandList className="max-h-64 overflow-x-hidden overflow-y-auto">
              {!isLoading && (
                <CommandEmpty className="py-4 text-center text-sm text-zinc-500">
                  검색 결과가 없습니다.
                </CommandEmpty>
              )}
              <CommandGroup>
                <AnimatePresence mode="popLayout">
                  {results.map((item, index) => (
                    <motion.div
                      key={item.roadAddress}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }} // 스태거링 효과
                    >
                      <CommandItem
                        onSelect={() => handleSelectAddress(item)}
                        className="flex cursor-pointer items-center space-x-4 rounded-2xl bg-transparent p-3 text-zinc-900 transition-colors hover:bg-zinc-100 data-[selected=true]:bg-zinc-100 data-[selected=true]:text-zinc-900"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50 group-hover:bg-white">
                          <MapPin className="h-5 w-5 text-zinc-400" />
                        </div>
                        <span className="truncate text-base font-semibold">{item.roadAddress}</span>
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
