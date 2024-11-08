import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['motion', 'offline', 'tampering', 'low_light'],
  },
  camera: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camera',
    required: true,
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
  },
  message: {
    type: String,
    required: true,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: {
    type: Date,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export const Alert = mongoose.model('Alert', alertSchema); 