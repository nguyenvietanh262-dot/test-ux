const Achievement = require('../models/Achievement');

exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ category: 1, 'requirement.value': 1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.createAchievement = async (req, res) => {
  try {
    const { badgeId, name, description, icon, category, requirement } = req.body;

    const existingBadge = await Achievement.findOne({ badgeId });
    if (existingBadge) {
      return res.status(400).json({ message: 'Badge ID đã tồn tại' });
    }

    const achievement = new Achievement({
      badgeId,
      name,
      description,
      icon,
      category,
      requirement
    });

    await achievement.save();
    res.status(201).json({ message: 'Tạo thành tựu thành công', achievement });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
