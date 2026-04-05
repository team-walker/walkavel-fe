'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COMMON_LITERALS } from '@/constants/types';
import { useAddressSearch } from '@/hooks/useAddressSearch';
import { AddressResult } from '@/types/address';

interface AddressSearchProps {
  onSelectAddress: (address: AddressResult) => void;
}

const POPULAR_REGIONS = [
  { label: '종로·북촌', value: '서울특별시 종로구', sigugun: '종로구' },
  { label: '명동·남산', value: '서울특별시 중구', sigugun: '중구' },
  { label: '성수·서울숲', value: '서울특별시 성동구', sigugun: '성동구' },
  { label: '연남·숲길', value: '서울특별시 마포구', sigugun: '마포구' },
  { label: '한남·용산', value: '서울특별시 용산구', sigugun: '용산구' },
  { label: '강남·압구정', value: '서울특별시 강남구', sigugun: '강남구' },
];

export default function AddressSearch({ onSelectAddress }: AddressSearchProps) {
  const {
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
  } = useAddressSearch({ onSelectAddress });

  const handleRegionClick = (region: (typeof POPULAR_REGIONS)[0]) => {
    try {
      handleSelectAddress({
        roadAddress: region.value,
        jibunAddress: region.value,
        englishAddress: '',
        sido: '서울특별시',
        sigugun: region.sigugun,
      });
    } catch (error) {
      console.error('Failed to select popular region:', error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-5 pt-8 sm:px-6 sm:pt-10">
      <div className="mb-6 space-y-1.5 sm:mb-6 sm:space-y-2">
        <h1 className="text-walkavel-gray-900 text-3xl font-bold tracking-tight break-keep sm:text-4xl">
          어디로 갈까요?
        </h1>
        <p className="text-walkavel-gray-600 text-base break-keep sm:text-lg">
          나만의 워커블을 찾아 떠나 보세요
        </p>
      </div>
      <Popover open={isOpen && query.trim().length >= 2} onOpenChange={setIsOpen}>
        <div className="group relative flex w-full flex-col space-y-6">
          <PopoverTrigger asChild>
            <div className="relative flex w-full flex-col space-y-2">
              <span className="text-walkavel-gray-400 px-1 text-sm font-medium tracking-tight">
                현재는 서울 지역을 중심으로 탐색하실 수 있어요
              </span>
              <div className="relative flex w-full items-center">
                <Search
                  className={`absolute left-5 h-5 w-5 transition-colors sm:h-5.5 sm:w-5.5 ${
                    isFocused ? 'text-brand-blue' : 'text-walkavel-gray-400'
                  }`}
                />
                <Input
                  type="text"
                  className={`placeholder:text-walkavel-gray-400 flex h-14 w-full items-center rounded-2xl border-none px-5 pl-13 text-base transition-all duration-300 outline-none focus:ring-0 focus-visible:ring-0 sm:h-15 sm:text-lg md:text-base ${
                    isFocused || query.length > 0
                      ? 'bg-white shadow-[0_0_0_1px_var(--brand-blue),0_10px_15px_-3px_rgba(0,0,0,0.1)]'
                      : 'bg-walkavel-gray-100'
                  }`}
                  placeholder={COMMON_LITERALS.SEARCH_PLACEHOLDER}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  onFocus={handleFocus}
                  onBlur={() => setIsFocused(false)}
                  data-testid="address-search-input"
                />
              </div>
            </div>
          </PopoverTrigger>

          <div className="flex flex-col space-y-3 px-1">
            <span className="text-walkavel-gray-500 text-sm font-semibold">인기 지역</span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_REGIONS.map((region) => (
                <Badge
                  key={region.value}
                  variant="secondary"
                  className="bg-walkavel-gray-100 text-walkavel-gray-700 hover:bg-brand-blue/10 hover:text-brand-blue flex h-9 cursor-pointer items-center rounded-xl border-none px-4 text-sm font-medium transition-colors"
                  onClick={() => handleRegionClick(region)}
                >
                  {region.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <PopoverContent
          className="border-walkavel-gray-100 mt-2 w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) overflow-hidden rounded-3xl bg-white p-0 shadow-xl"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {isLoading && (
            <motion.div
              data-testid="search-loading"
              className="bg-brand-blue absolute top-0 left-0 z-50 h-1"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <Command className="bg-transparent">
            <CommandList className="no-scrollbar max-h-64 overflow-x-hidden overflow-y-auto">
              {!isLoading && results.length === 0 && query.length >= 2 && (
                <CommandEmpty className="text-walkavel-gray-400 h-14.5 py-4 text-center text-sm font-medium">
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
                        className="group aria-selected:bg-walkavel-gray-100 hover:bg-walkavel-gray-100 flex min-h-14 cursor-pointer items-center space-x-3 bg-transparent px-4 transition-colors sm:px-5"
                      >
                        <div className="bg-walkavel-gray-100 group-aria-selected:bg-brand-blue/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors">
                          <MapPin className="text-walkavel-gray-400 group-aria-selected:text-brand-blue h-4.5 w-4.5 transition-colors" />
                        </div>
                        <span className="line-clamp-2 truncate text-[0.9375rem] font-medium tracking-tight sm:text-base">
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
