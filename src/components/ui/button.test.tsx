import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>);
    const button = getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('destructive');
  });

  it('applies size styles correctly', () => {
    const { getByRole } = render(<Button size="sm">Small</Button>);
    const button = getByRole('button', { name: /small/i });
    expect(button).toHaveClass('h-8');
  });

  it('can be disabled', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    const button = getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });
});
