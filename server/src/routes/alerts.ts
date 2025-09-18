import express from 'express';
import { protect } from '../middleware/auth';
import { Alert } from '../models/Alert';
import { AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

// Get all alerts
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const alerts = await Alert.find({})
      .populate('camera', 'name location')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new alert
router.post('/', protect, validateRequest(['type', 'camera', 'severity', 'message']), async (req: AuthRequest, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resolve alert
router.patch('/:id/resolve', protect, async (req: AuthRequest, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy: req.user?.id,
      },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 