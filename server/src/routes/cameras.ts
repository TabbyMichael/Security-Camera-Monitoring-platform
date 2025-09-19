import express from 'express';
import { protect } from '../middleware/auth';
import { Camera } from '../models/Camera';

const router = express.Router();

// Get all cameras
router.get('/', protect, async (req, res) => {
  try {
    const cameras = await Camera.find({});
    res.json(cameras);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new camera
router.post('/', protect, async (req, res) => {
  try {
    const camera = await Camera.create(req.body);
    res.status(201).json(camera);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update camera status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const camera = await Camera.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    res.json(camera);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 