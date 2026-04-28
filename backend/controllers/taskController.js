const Task = require('../models/Task');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Achievement = require('../models/Achievement');

exports.createTask = async (req, res) => {
  try {
    const { title, description, category, points, dueDate, recurring } = req.body;

    const task = new Task({
      userId: req.userId,
      title,
      description,
      category,
      points: points || 10,
      dueDate,
      recurring: recurring || 'none'
    });

    await task.save();
    res.status(201).json({ message: 'Tạo nhiệm vụ thành công', task });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { completed, category } = req.query;
    const filter = { userId: req.userId };

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    if (category) {
      filter.category = category;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy nhiệm vụ' });
    }

    if (task.completed) {
      return res.status(400).json({ message: 'Nhiệm vụ đã hoàn thành' });
    }

    task.completed = true;
    task.completedAt = new Date();
    await task.save();

    const user = await User.findById(req.userId);
    user.points += task.points;
    user.stats.totalTasksCompleted += 1;

    if (task.category === 'gratitude') user.stats.gratitudeTasks += 1;
    else if (task.category === 'gift') user.stats.giftTasks += 1;
    else if (task.category === 'journal') user.stats.journalTasks += 1;
    else if (task.category === 'meditation') user.stats.meditationTasks += 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }

    user.lastActiveDate = new Date();

    const pointsForLevel = user.level * 100;
    if (user.points >= pointsForLevel) {
      user.level += 1;
    }

    await user.save();

    const activity = new Activity({
      userId: req.userId,
      type: 'task_completed',
      description: `Hoàn thành nhiệm vụ "${task.title}"`,
      points: task.points,
      metadata: { taskId: task._id, category: task.category }
    });
    await activity.save();

    await checkAchievements(user);

    res.json({
      message: 'Hoàn thành nhiệm vụ thành công',
      task,
      user: {
        points: user.points,
        level: user.level,
        streak: user.streak
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy nhiệm vụ' });
    }

    res.json({ message: 'Xóa nhiệm vụ thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

async function checkAchievements(user) {
  const achievements = await Achievement.find();

  for (const achievement of achievements) {
    const alreadyEarned = user.badges.some(b => b.badgeId === achievement.badgeId);
    if (alreadyEarned) continue;

    let earned = false;

    switch (achievement.requirement.type) {
      case 'streak':
        earned = user.streak >= achievement.requirement.value;
        break;
      case 'taskCount':
        earned = user.stats.totalTasksCompleted >= achievement.requirement.value;
        break;
      case 'points':
        earned = user.points >= achievement.requirement.value;
        break;
      case 'categoryTasks':
        const categoryKey = `${achievement.requirement.category}Tasks`;
        earned = user.stats[categoryKey] >= achievement.requirement.value;
        break;
    }

    if (earned) {
      user.badges.push({ badgeId: achievement.badgeId, earnedAt: new Date() });
      await user.save();

      const activity = new Activity({
        userId: user._id,
        type: 'badge_earned',
        description: `Đạt thành tựu "${achievement.name}"`,
        metadata: { badgeId: achievement.badgeId }
      });
      await activity.save();
    }
  }
}
