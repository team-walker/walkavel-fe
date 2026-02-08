import { render, screen } from '@testing-library/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

describe('Card Component', () => {
  it('renders all sections correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies custom className to parts', () => {
    render(
      <Card className="card-class">
        <CardHeader className="header-class">Header</CardHeader>
      </Card>,
    );

    const card = screen.getByText('Header').closest('[data-slot="card"]');
    const header = screen.getByText('Header');

    expect(card).toHaveClass('card-class');
    expect(header).toHaveClass('header-class');
  });

  it('renders with appropriate data-slots for styling', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>,
    );

    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title');
  });
});
