import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { CameraGrid } from './CameraGrid';
import { api } from '../services/api';

// Mock the api service
vi.mock('../services/api');

const mockCameras = [
  {
    id: 1,
    name: 'Test Camera 1',
    url: 'http://example.com/stream1',
    location: 'Test Location 1',
    status: 'online',
    recording: true,
  },
  {
    id: 2,
    name: 'Test Camera 2',
    url: 'http://example.com/stream2',
    location: 'Test Location 2',
    status: 'online',
    recording: false,
  },
];

describe('CameraGrid', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render camera feeds when the api call is successful', async () => {
    // Mock the successful api response
    vi.mocked(api.getCameraFeeds).mockResolvedValue({
      success: true,
      data: mockCameras,
    });

    render(<CameraGrid />);

    // Wait for the component to render the cameras
    await waitFor(() => {
      expect(screen.getByText('Test Camera 1')).toBeInTheDocument();
      expect(screen.getByText('Test Camera 2')).toBeInTheDocument();
    });

    // Check if the iframes are rendered with the correct src
    const iframe1 = screen.getByTestId('camera-feed-1');
    const iframe2 = screen.getByTestId('camera-feed-2');
    expect(iframe1).toHaveAttribute('src', 'http://example.com/stream1');
    expect(iframe2).toHaveAttribute('src', 'http://example.com/stream2');
  });

  it('should render an error message when the api call fails', async () => {
    // Mock the failed api response
    vi.mocked(api.getCameraFeeds).mockRejectedValue(new Error('API Error'));

    render(<CameraGrid />);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText('An error occurred while fetching camera feeds')
      ).toBeInTheDocument();
    });
  });

  it('should display a specific error message from the API on failure', async () => {
    const errorMessage = 'Failed to fetch cameras from external API';
    // Mock the failed api response with a specific error message
    vi.mocked(api.getCameraFeeds).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    render(<CameraGrid />);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
