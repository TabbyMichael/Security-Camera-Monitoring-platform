import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { CameraGrid } from './CameraGrid';
import { api } from '../services/api';

// Mock the api service
vi.mock('../services/api');

const mockCameras = [
  {
    _id: '1',
    name: 'Test Camera 1',
    url: 'http://example.com/stream1',
  },
  {
    _id: '2',
    name: 'Test Camera 2',
    url: 'http://example.com/stream2',
  },
];

describe('CameraGrid', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render camera feeds when the api call is successful', async () => {
    // Mock the successful api response
    vi.mocked(api.getCameras).mockResolvedValue(mockCameras);

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
    vi.mocked(api.getCameras).mockRejectedValue(new Error('API Error'));

    render(<CameraGrid />);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText('An error occurred while fetching your cameras')
      ).toBeInTheDocument();
    });
  });
});
