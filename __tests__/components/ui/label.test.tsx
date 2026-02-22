import { render, screen } from '@testing-library/react';

import { Label } from '@/components/ui/label';

describe('Label 컴포넌트', () => {
  it('올바르게 렌더링되어야 한다', () => {
    render(<Label>Username</Label>);
    const label = screen.getByText(/username/i);
    expect(label).toBeInTheDocument();
  });

  it('htmlFor를 통해 input과 연결되어야 한다', () => {
    render(
      <>
        <Label htmlFor="test-input">Label Text</Label>
        <input id="test-input" />
      </>,
    );
    const label = screen.getByText(/label text/i);
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('사용자 지정 className을 적용해야 한다', () => {
    render(<Label className="custom-class">Label</Label>);
    const label = screen.getByText(/label/i);
    expect(label).toHaveClass('custom-class');
  });

  it('자식 요소를 올바르게 렌더링해야 한다', () => {
    render(
      <Label>
        <span>Star</span> Label
      </Label>,
    );
    expect(screen.getByText('Star')).toBeInTheDocument();
    expect(screen.getByText(/label/i)).toBeInTheDocument();
  });
});
