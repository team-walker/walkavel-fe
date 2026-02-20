import { fireEvent, render, screen } from '@testing-library/react';

import { Input } from '@/components/ui/input';

describe('Input 컴포넌트', () => {
  it('올바르게 렌더링되어야 한다', () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('값 변경을 처리해야 한다', () => {
    render(<Input placeholder="Test input" />);
    const input = screen.getByPlaceholderText('Test input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New value' } });
    expect(input.value).toBe('New value');
  });

  it('disabled prop이 전달되면 비활성화되어야 한다', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('사용자 지정 className을 적용해야 한다', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('다양한 타입으로 렌더링되어야 한다', () => {
    render(<Input type="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });
});
