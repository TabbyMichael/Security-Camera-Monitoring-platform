import express from 'express';
import { protect } from '../middleware/auth';
import { Recording } from '../models/Recording';

const router = express.Router();

// Get all recordings
router.get('/', protect, async (req, res) => {
  try {
    const recordings = await Recording.find({})
      .populate('camera', 'name location')
      .sort({ startTime: -1 });
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