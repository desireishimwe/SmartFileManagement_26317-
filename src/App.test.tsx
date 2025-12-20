import { render } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';

// Mock contexts to avoid complex logic/fetching
vi.mock('./contexts/AuthContext', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('@mui/material', async () => {
    const actual = await vi.importActual<typeof import('@mui/material')>('@mui/material');
    return {
        ...actual,
        ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        CssBaseline: () => null
    };
});

test('renders App component', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
});
