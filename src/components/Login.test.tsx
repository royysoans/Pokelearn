import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('Login Component', () => {
  const mockSignIn = vi.fn();
  const mockToast = vi.fn();
  const mockOnSwitchToSignup = vi.fn();
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      signIn: mockSignIn,
    });
    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
  });

  it('renders login form elements properly', () => {
    render(<Login onSwitchToSignup={mockOnSwitchToSignup} onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Login$/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\? Sign up/i)).toBeInTheDocument();
  });

  it('handles successful login flow', async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });

    render(<Login onSwitchToSignup={mockOnSwitchToSignup} onLoginSuccess={mockOnLoginSuccess} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'trainer@pokelearn.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pikachu123' } });

    fireEvent.click(screen.getByRole('button', { name: /^Login$/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('trainer@pokelearn.com', 'pikachu123');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Welcome back!',
      }));
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });

  it('handles login failure with error toast', async () => {
    mockSignIn.mockResolvedValueOnce({
      error: { message: 'Invalid login credentials' },
    });

    render(<Login onSwitchToSignup={mockOnSwitchToSignup} onLoginSuccess={mockOnLoginSuccess} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@pokelearn.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /^Login$/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('wrong@pokelearn.com', 'wrongpass');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Login Failed',
        description: 'Invalid login credentials',
        variant: 'destructive',
      }));
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  it('switches to signup when clicking signup link', () => {
    render(<Login onSwitchToSignup={mockOnSwitchToSignup} onLoginSuccess={mockOnLoginSuccess} />);

    fireEvent.click(screen.getByText(/Don't have an account\? Sign up/i));
    expect(mockOnSwitchToSignup).toHaveBeenCalled();
  });
});
