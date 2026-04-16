import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide a name'] },
  email: { type: String, required: [true, 'Please provide an email'], unique: true },
  password: { type: String, required: [true, 'Please provide a password'] },
  role: { type: String, enum: ['user', 'admin', 'trainer'], default: 'user' },
  
  // Body Stats (Stored in Metric: kg, cm)
  weight: { type: Number, default: 70 },
  height: { type: Number, default: 170 },
  age: { type: Number, default: 25 },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  
  // Preferences & Goals
  unitPreference: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very active'], default: 'moderate' },
  goal: { type: String, enum: ['Lose Weight', 'Maintain', 'Gain Weight'], default: 'Maintain' },

  // Trainer Specific
  certificateUrl: { type: String, default: '' },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
