import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { ManageCameras } from './ManageCameras';
import { api } from '../services/api';

vi.mock('../services/api');

const mockCameras = [
  { _id: '1', name: 'Front Door', url: 'rtsp://test.com/1' },
  { _id: '2', name: 'Backyard', url: 'rtsp://test.com/2' },
];

describe('ManageCameras', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch and display the list of cameras', async () => {
    vi.mocked(api.getCameras).mockResolvedValue(mockCameras);
    render(<ManageCameras />);

    await waitFor(() => {
      expect(screen.getByText('Front Door')).toBeInTheDocument();
      expect(screen.getByText('Backyard')).toBeInTheDocument();
    });
  });

  it('should call the addCamera function on form submission', async () => {
    vi.mocked(api.getCameras).mockResolvedValue([]);
    const newCamera = { _id: '3', name: 'Garage', url: 'rtsp://test.com/3' };
    vi.mocked(api.addCamera).mockResolvedValue(newCamera);

    render(<ManageCameras />);

    fireEvent.change(screen.getByLabelText('Camera Name'), { target: { value: 'Garage' } });
    fireEvent.change(screen.getByLabelText('Camera URL'), { target: { value: 'rtsp://test.com/3' } });
    fireEvent.click(screen.getByText('Add Camera'));

    await waitFor(() => {
      expect(api.addCamera).toHaveBeenCalledWith({ name: 'Garage', url: 'rtsp://test.com/3' });
    });

    // Check if the new camera is added to the list
    await waitFor(() => {
        expect(screen.getByText('Garage')).toBeInTheDocument();
    });
  });
});
