const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  badgeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['streak', 'tasks', 'points', 'special'],
    default: 'tasks'
  },
  requirement: {
    type: {
      type: String,
      enum: ['streak', 'taskCount', 'points', 'categoryTasks'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    category: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
