import { render, screen } from '@testing-library/react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

describe('Card 컴포넌트', () => {
  it('모든 섹션이 올바르게 렌더링되어야 한다', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('각 부분에 사용자 지정 className이 적용되어야 한다', () => {
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

  it('스타일링을 위한 적절한 data-slots와 함께 렌더링되어야 한다', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>,
    );

    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title');
  });
});
