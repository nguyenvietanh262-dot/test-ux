const mongoose = require('mongoose');

const seedAchievements = async () => {
  const achievements = [
    {
      badgeId: 'first_task',
      name: 'Bước đầu tiên',
      description: 'Hoàn thành nhiệm vụ đầu tiên',
      icon: '🌱',
      category: 'tasks',
      requirement: { type: 'taskCount', value: 1 }
    },
    {
      badgeId: 'task_master_10',
      name: 'Người thực thi',
      description: 'Hoàn thành 10 nhiệm vụ',
      icon: '⭐',
      category: 'tasks',
      requirement: { type: 'taskCount', value: 10 }
    },
    {
      badgeId: 'task_master_50',
      name: 'Chuyên gia nhiệm vụ',
      description: 'Hoàn thành 50 nhiệm vụ',
      icon: '🏆',
      category: 'tasks',
      requirement: { type: 'taskCount', value: 50 }
    },
    {
      badgeId: 'streak_3',
      name: 'Kiên trì 3 ngày',
      description: 'Duy trì streak 3 ngày liên tiếp',
      icon: '🔥',
      category: 'streak',
      requirement: { type: 'streak', value: 3 }
    },
    {
      badgeId: 'streak_7',
      name: 'Tuần hoàn hảo',
      description: 'Duy trì streak 7 ngày liên tiếp',
      icon: '💪',
      category: 'streak',
      requirement: { type: 'streak', value: 7 }
    },
    {
      badgeId: 'streak_30',
      name: 'Tháng kỷ luật',
      description: 'Duy trì streak 30 ngày liên tiếp',
      icon: '👑',
      category: 'streak',
      requirement: { type: 'streak', value: 30 }
    },
    {
      badgeId: 'points_100',
      name: 'Người mới',
      description: 'Đạt 100 điểm',
      icon: '💎',
      category: 'points',
      requirement: { type: 'points', value: 100 }
    },
    {
      badgeId: 'points_500',
      name: 'Người tích cực',
      description: 'Đạt 500 điểm',
      icon: '💰',
      category: 'points',
      requirement: { type: 'points', value: 500 }
    },
    {
      badgeId: 'points_1000',
      name: 'Triệu phú điểm',
      description: 'Đạt 1000 điểm',
      icon: '🌟',
      category: 'points',
      requirement: { type: 'points', value: 1000 }
    },
    {
      badgeId: 'gratitude_10',
      name: 'Trái tim biết ơn',
      description: 'Hoàn thành 10 nhiệm vụ biết ơn',
      icon: '🙏',
      category: 'tasks',
      requirement: { type: 'categoryTasks', value: 10, category: 'gratitude' }
    },
    {
      badgeId: 'gift_10',
      name: 'Người cho đi',
      description: 'Hoàn thành 10 nhiệm vụ tặng quà',
      icon: '🎁',
      category: 'tasks',
      requirement: { type: 'categoryTasks', value: 10, category: 'gift' }
    },
    {
      badgeId: 'journal_10',
      name: 'Nhà văn',
      description: 'Hoàn thành 10 nhiệm vụ nhật ký',
      icon: '📖',
      category: 'tasks',
      requirement: { type: 'categoryTasks', value: 10, category: 'journal' }
    },
    {
      badgeId: 'meditation_10',
      name: 'Tâm an',
      description: 'Hoàn thành 10 nhiệm vụ thiền định',
      icon: '🧘',
      category: 'tasks',
      requirement: { type: 'categoryTasks', value: 10, category: 'meditation' }
    }
  ];

  return achievements;
};

module.exports = seedAchievements;
