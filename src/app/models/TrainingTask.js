import mongoose from 'mongoose';

const TrainingTaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.models.TrainingTask || mongoose.model('TrainingTask', TrainingTaskSchema);
