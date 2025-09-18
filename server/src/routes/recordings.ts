import express from 'express';
import { protect } from '../middleware/auth';
import { Recording } from '../models/Recording';

const router = express.Router();

// Get all recordings
router.get('/', protect, async (req, res) => {
  try {
    let recordings = await Recording.find({})
      .populate('camera', 'name location')
      .sort({ startTime: -1 });

    if (recordings.length === 0) {
      // If no recordings, return mock data for UI development
      recordings = [
        {
          _id: 'mock1',
          camera: { name: 'Front Door' },
          startTime: new Date('2025-09-18T10:00:00Z'),
          endTime: new Date('2025-09-18T10:05:00Z'),
          duration: 300,
          fileUrl: '#',
          type: 'motion',
          size: 5242880, // 5MB
        },
        {
          _id: 'mock2',
          camera: { name: 'Backyard' },
          startTime: new Date('2025-09-18T11:30:00Z'),
          endTime: new Date('2025-09-18T11:32:00Z'),
          duration: 120,
          fileUrl: '#',
          type: 'manual',
          size: 2097152, // 2MB
        },
      ] as any;
    }

    res.json(recordings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recordings by camera
router.get('/camera/:cameraId', protect, async (req, res) => {
  try {
    const recordings = await Recording.find({ camera: req.params.cameraId })
      .populate('camera', 'name location')
      .sort({ startTime: -1 });
    res.json(recordings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new recording
router.post('/', protect, async (req, res) => {
  try {
    const recording = await Recording.create(req.body);
    res.status(201).json(recording);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 