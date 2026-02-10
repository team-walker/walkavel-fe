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

describe('Command Component', () => {
  it('renders correctly with input and list', () => {
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

  it('renders CommandDialog', async () => {
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

  it('displays empty message when no items match', () => {
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
