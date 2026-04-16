import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Please provide activity type'],
    enum: ['Running', 'Cycling', 'Weightlifting', 'Yoga', 'Swimming', 'Other']
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Please provide duration in minutes']
  },
  
  // Weightlifting specific
  exerciseName: { type: String },
  weightLifted: { type: Number }, // in kg
  sets: { type: Number },
  reps: { type: Number },
  
  // Other specific
  description: { type: String }, 
  
  caloriesBurned: {
    type: Number,
    required: [true, 'Please provide calories burned']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
