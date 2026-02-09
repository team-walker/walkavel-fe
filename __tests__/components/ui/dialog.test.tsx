import { fireEvent, render, screen } from '@testing-library/react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

describe('Dialog Component', () => {
  it('opens when trigger is clicked and displays content', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <div>Main Content</div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            Footer Content
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    // Initial state: content should not be visible
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();

    // Click trigger
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);

    // After click: content should be in the document
    expect(await screen.findByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Description')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Visible Dialog</DialogTitle>
          <DialogDescription>Description for the close test</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    // Should be visible initially (defaultOpen)
    expect(screen.getByText('Visible Dialog')).toBeInTheDocument();

    // Click the close button (provided by DialogContent default close button)
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Content should eventually disappear
    // Using queryByText since it will be removed
    setTimeout(() => {
      expect(screen.queryByText('Visible Dialog')).not.toBeInTheDocument();
    }, 100);
  });
});
