import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';

test('simple math', () => {
    expect(1 + 1).toBe(2);
});

test('simple render', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
});
