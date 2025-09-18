import express from 'express';
import { protect } from '../middleware/auth';
import { Alert } from '../models/Alert';
import { AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

// Get all alerts
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    let alerts = await Alert.find({})
      .populate('camera', 'name location')
      .sort({ createdAt: -1 });

    if (alerts.length === 0) {
      // If no alerts, return mock data for UI development
      alerts = [
        {
          _id: 'mockAlert1',
          type: 'motion',
          camera: { name: 'Main Entrance' },
          severity: 'high',
          message: 'Motion detected at the main entrance.',
          resolved: false,
          createdAt: new Date('2025-09-18T12:00:00Z'),
        },
        {
          _id: 'mockAlert2',
          type: 'offline',
          camera: { name: 'Parking Lot' },
          severity: 'critical',
          message: 'Parking Lot camera has gone offline.',
          resolved: false,
          createdAt: new Date('2025-09-18T09:30:00Z'),
        },
        {
          _id: 'mockAlert3',
          type: 'tampering',
          camera: { name: 'Side Gate' },
          severity: 'medium',
          message: 'Camera at Side Gate may have been tampered with.',
          resolved: true,
          resolvedAt: new Date('2025-09-18T08:00:00Z'),
          createdAt: new Date('2025-09-18T07:45:00Z'),
        },
      ] as any;
    }

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