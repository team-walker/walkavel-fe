'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';

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

  return (
    <div className="mx-auto w-full max-w-md px-6 pt-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-walkavel-gray-900 text-[32px] font-bold tracking-tight">
          어디로 갈까요?
        </h1>
        <p className="text-walkavel-gray-600 text-[17px]">걷고 싶은 동네를 검색해보세요</p>
      </div>
      <Popover open={isOpen && query.trim().length >= 2} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="group relative flex w-full items-center">
            <Search
              className={`absolute left-5 h-5.5 w-5.5 transition-colors ${
                isFocused ? 'text-brand-blue' : 'text-walkavel-gray-400'
              }`}
            />
            <Input
              type="text"
              className={`placeholder:text-walkavel-gray-400 h-14.5 w-full rounded-2xl border-none px-5 pl-13 text-[17px] font-medium transition-all duration-300 outline-none focus:ring-0 focus-visible:ring-0 ${
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
        </PopoverTrigger>

        <PopoverContent
          className="border-walkavel-gray-100 mt-3 w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) overflow-hidden rounded-4xl bg-white p-0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]"
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
                        className="group text-walkavel-gray-900 hover:bg-walkavel-gray-100 aria-selected:bg-walkavel-gray-100 flex h-17 cursor-pointer items-center space-x-3 bg-transparent px-5 transition-colors"
                      >
                        <div className="bg-walkavel-gray-100 group-aria-selected:bg-brand-blue/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors">
                          <MapPin className="text-walkavel-gray-400 group-aria-selected:text-brand-blue h-4.5 w-4.5 transition-colors" />
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
