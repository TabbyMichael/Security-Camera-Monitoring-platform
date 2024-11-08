import mongoose from 'mongoose';

const cameraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  streamUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'offline',
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor'],
    required: true,
  },
  resolution: {
    type: String,
    default: '1080p',
  },
}, {
  timestamps: true,
});

export const Camera = mongoose.model('Camera', cameraSchema); 