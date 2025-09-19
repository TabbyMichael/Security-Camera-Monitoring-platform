import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';
import { vi } from 'vitest';

// Mock child components to isolate the Header test
vi.mock('../SearchBar', () => ({
  SearchBar: () => <input placeholder="Search..." />
}));

vi.mock('../AuthModal', () => ({
  AuthModal: () => <div data-testid="auth-modal" />
}));

describe('Header component', () => {
  // Helper function to render the component with router context
  const renderHeader = () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it('renders the logo text', () => {
    renderHeader();
    expect(screen.getByText('Guardian')).toBeInTheDocument();
    expect(screen.getByText('Eye')).toBeInTheDocument();
  });

  it('renders the SearchBar component', () => {
    renderHeader();
    // The mock provides the placeholder, so we test for that
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders the notification and user buttons with accessible names', () => {
    renderHeader();

    // Check for the notification button by its new aria-label
    const notificationButton = screen.getByRole('button', { name: /view notifications/i });
    expect(notificationButton).toBeInTheDocument();

    // Check for the user profile button by its new aria-label
    const userButton = screen.getByRole('button', { name: /open user menu/i });
    expect(userButton).toBeInTheDocument();
  });
});
