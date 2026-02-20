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

describe('Popover 컴포넌트', () => {
  it('트리거를 클릭하면 팝오버 콘텐츠를 표시해야 한다', async () => {
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

  it('PopoverAnchor와 함께 렌더링되어야 한다', async () => {
    render(
      <Popover open={true}>
        <PopoverAnchor>Anchor</PopoverAnchor>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(await screen.findByText('Content')).toBeInTheDocument();
  });

  it('open prop으로 제어할 수 있어야 한다', () => {
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
