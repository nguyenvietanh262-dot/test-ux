const express = require('express');
const router = express.Router();
const { getLeaderboard, getCommunityFeed } = require('../controllers/communityController');
const auth = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/feed', auth, getCommunityFeed);

module.exports = router;
