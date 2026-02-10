import { fireEvent, render, screen } from '@testing-library/react';

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

describe('Popover Component', () => {
  it('displays popover content when trigger is clicked', async () => {
    render(
      <Popover>
        <PopoverTrigger>Toggle Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Description</PopoverDescription>
          </PopoverHeader>
          Popover Information
        </PopoverContent>
      </Popover>,
    );

    // Initial state: content not visible
    expect(screen.queryByText('Popover Information')).not.toBeInTheDocument();

    // Click trigger
    const trigger = screen.getByText('Toggle Popover');
    fireEvent.click(trigger);

    // Content should appear
    expect(await screen.findByText('Popover Information')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders with PopoverAnchor', async () => {
    render(
      <Popover open={true}>
        <PopoverAnchor>Anchor</PopoverAnchor>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(await screen.findByText('Content')).toBeInTheDocument();
  });

  it('can be controlled with open prop', () => {
    const { rerender } = render(
      <Popover open={false}>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Controlled Content</PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText('Controlled Content')).not.toBeInTheDocument();

    rerender(
      <Popover open={true}>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Controlled Content</PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('Controlled Content')).toBeInTheDocument();
  });
});
