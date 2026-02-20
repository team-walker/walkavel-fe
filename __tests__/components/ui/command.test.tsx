import { render, screen } from '@testing-library/react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

describe('Command 컴포넌트', () => {
  it('input 및 list와 함께 올바르게 렌더링되어야 한다', () => {
    render(
      <Command>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              Calendar
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>Search Emoji</CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>,
    );

    expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('⌘C')).toBeInTheDocument();
  });

  it('CommandDialog를 렌더링해야 한다', async () => {
    render(
      <CommandDialog open={true}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Settings</CommandItem>
        </CommandList>
      </CommandDialog>,
    );
    expect(await screen.findByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('일치하는 항목이 없을 때 빈 메시지를 표시해야 한다', () => {
    // Note: Behavior depends on cmdk implementation, but we can test rendering
    render(
      <Command>
        <CommandList>
          <CommandEmpty>Empty state visible</CommandEmpty>
        </CommandList>
      </Command>,
    );
    expect(screen.getByText('Empty state visible')).toBeInTheDocument();
  });
});
