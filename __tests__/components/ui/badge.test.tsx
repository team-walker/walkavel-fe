import { render, screen } from '@testing-library/react';

import { Badge } from '@/components/ui/badge';

describe('Badge Component', () => {
  it('renders correctly with children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders with default variant classes', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveAttribute('data-variant', 'default');
    expect(badge).toHaveClass('bg-primary');
  });

  it('renders with destructive variant classes', () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    const badge = screen.getByText('Destructive');
    expect(badge).toHaveAttribute('data-variant', 'destructive');
    expect(badge).toHaveClass('bg-destructive');
  });

  it('renders with outline variant classes', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText('Outline');
    expect(badge).toHaveAttribute('data-variant', 'outline');
    expect(badge).toHaveClass('border-border');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('renders as a different element when asChild is true', () => {
    render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>,
    );
    const link = screen.getByRole('link', { name: 'Link Badge' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('bg-primary');
  });
});
