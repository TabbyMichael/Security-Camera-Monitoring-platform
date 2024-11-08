import mongoose from 'mongoose';

const recordingSchema = new mongoose.Schema({
  camera: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camera',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['motion', 'scheduled', 'manual'],
    required: true,
  },
  size: {
    type: Number, // in bytes
    required: true,
  },
}, {
  timestamps: true,
});

export const Recording = mongoose.model('Recording', recordingSchema); 