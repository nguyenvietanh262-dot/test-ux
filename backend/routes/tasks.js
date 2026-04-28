const express = require('express');
const router = express.Router();
const { createTask, getTasks, completeTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.patch('/:id/complete', auth, completeTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
