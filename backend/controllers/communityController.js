const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getLeaderboard = async (req, res) => {
  try {
    const { type = 'points', limit = 10 } = req.query;

    let sortField = {};
    switch (type) {
      case 'points':
        sortField = { points: -1 };
        break;
      case 'streak':
        sortField = { streak: -1 };
        break;
      case 'level':
        sortField = { level: -1, points: -1 };
        break;
      case 'tasks':
        sortField = { 'stats.totalTasksCompleted': -1 };
        break;
      default:
        sortField = { points: -1 };
    }

    const users = await User.find()
      .select('username displayName avatar points level streak stats badges')
      .sort(sortField)
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      streak: user.streak,
      totalTasks: user.stats.totalTasksCompleted,
      badgeCount: user.badges.length
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getCommunityFeed = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await Activity.find()
      .populate('userId', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const feed = activities.map(activity => ({
      id: activity._id,
      user: {
        username: activity.userId.username,
        displayName: activity.userId.displayName,
        avatar: activity.userId.avatar
      },
      type: activity.type,
      description: activity.description,
      points: activity.points,
      metadata: activity.metadata,
      createdAt: activity.createdAt
    }));

    res.json(feed);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
