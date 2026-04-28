const express = require('express');
const router = express.Router();
const { getAchievements, createAchievement } = require('../controllers/achievementController');

router.get('/', getAchievements);
router.post('/', createAchievement);

module.exports = router;
