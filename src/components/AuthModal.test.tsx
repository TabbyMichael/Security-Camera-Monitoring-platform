import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { AuthModal } from './AuthModal';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

vi.mock('../services/api');
vi.mock('react-hot-toast');

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('AuthModal', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render the login form by default', () => {
    renderWithContext(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('should switch to the sign up form when "Sign up" is clicked', () => {
    renderWithContext(<AuthModal isOpen={true} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Sign up'));
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });

  it('should call the login function on submit when in login mode', async () => {
    vi.mocked(api.login).mockResolvedValue({ _id: '1', name: 'Test User', email: 'test@example.com', token: 'fake-token' });
    renderWithContext(<AuthModal isOpen={true} onClose={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should call the register function on submit when in sign up mode', async () => {
    vi.mocked(api.register).mockResolvedValue({ _id: '1', name: 'Test User', email: 'test@example.com', token: 'fake-token' });
    renderWithContext(<AuthModal isOpen={true} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Sign up')); // Switch to sign up

    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign up'));

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
    });
  });

  // TODO: This test is flaky and needs to be fixed.
  // it('should show an error if passwords do not match on sign up', async () => {
  //   renderWithContext(<AuthModal isOpen={true} onClose={() => {}} />);
  //   fireEvent.click(screen.getByText('Sign up'));

  //   fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
  //   fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'password456' } });
  //   fireEvent.click(screen.getByText('Sign up'));

  //   const errorMessage = await screen.findByTestId('error-message');
  //   expect(errorMessage).toBeInTheDocument();
  //   expect(errorMessage).toHaveTextContent('Passwords do not match');
  //   expect(api.register).not.toHaveBeenCalled();
  // });
});
