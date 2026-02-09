import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/]
  },
  password: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

userSchema.methods.generateApiKey = function() {
  const userId = this._id.toString();
  const email = this.email.split('@')[0];
  const randomString = crypto.randomBytes(16).toString('hex');
  
  this.apiKey = `mern-${userId}-${email}-${randomString}`;
  return this.apiKey;
};

export default mongoose.model('User', userSchema);