import { render, screen } from '@testing-library/react';

import { Label } from '@/components/ui/label';

describe('Label Component', () => {
  it('renders correctly', () => {
    render(<Label>Username</Label>);
    const label = screen.getByText(/username/i);
    expect(label).toBeInTheDocument();
  });

  it('associates with an input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="test-input">Label Text</Label>
        <input id="test-input" />
      </>,
    );
    const label = screen.getByText(/label text/i);
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Label</Label>);
    const label = screen.getByText(/label/i);
    expect(label).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    render(
      <Label>
        <span>Star</span> Label
      </Label>,
    );
    expect(screen.getByText('Star')).toBeInTheDocument();
    expect(screen.getByText(/label/i)).toBeInTheDocument();
  });
});
