import { render, screen } from '@testing-library/react';

import { Badge } from '@/components/ui/badge';

describe('Badge 컴포넌트', () => {
  it('자식 요소와 함께 올바르게 렌더링되어야 한다', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('기본 변형 클래스로 렌더링되어야 한다', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveAttribute('data-variant', 'default');
    expect(badge).toHaveClass('bg-primary');
  });

  it('파괴적(destructive) 변형 클래스로 렌더링되어야 한다', () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    const badge = screen.getByText('Destructive');
    expect(badge).toHaveAttribute('data-variant', 'destructive');
    expect(badge).toHaveClass('bg-destructive');
  });

  it('윤곽선(outline) 변형 클래스로 렌더링되어야 한다', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText('Outline');
    expect(badge).toHaveAttribute('data-variant', 'outline');
    expect(badge).toHaveClass('border-border');
  });

  it('사용자 지정 className을 적용해야 한다', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('asChild가 true일 때 다른 요소로 렌더링되어야 한다', () => {
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
