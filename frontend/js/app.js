const API_URL = 'http://localhost:5000/api';

let currentUser = null;
let authToken = null;
let tasks = [];
let currentCategory = 'all';
let isLoginMode = true;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
});

function setupEventListeners() {
  // Auth form
  document.getElementById('authForm').addEventListener('submit', handleAuth);
  document.getElementById('authToggleLink').addEventListener('click', toggleAuthMode);

  // Task modal
  document.getElementById('addTaskBtn').addEventListener('click', () => {
    document.getElementById('taskModal').classList.add('show');
  });
  document.getElementById('cancelTaskBtn').addEventListener('click', () => {
    document.getElementById('taskModal').classList.remove('show');
  });
  document.getElementById('taskForm').addEventListener('submit', handleCreateTask);

  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      loadTasks();
    });
  });
}

function checkAuth() {
  const token = localStorage.getItem('humaiToken');
  if (token) {
    authToken = token;
    loadUserProfile();
  }
}

async function handleAuth(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
  const body = isLoginMode
    ? { email, password }
    : { email, password, username, displayName: username };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('humaiToken', authToken);
      showMainApp();
      loadTasks();
    } else {
      alert(data.message || 'Đã xảy ra lỗi');
    }
  } catch (error) {
    console.error('Auth error:', error);
    alert('Không thể kết nối đến server');
  }
}

function toggleAuthMode(e) {
  e.preventDefault();
  isLoginMode = !isLoginMode;

  const usernameGroup = document.getElementById('usernameGroup');
  const submitBtn = document.querySelector('#authForm button[type="submit"]');
  const toggleText = document.getElementById('authToggleText');
  const toggleLink = document.getElementById('authToggleLink');

  if (isLoginMode) {
    usernameGroup.style.display = 'none';
    submitBtn.textContent = 'Đăng nhập';
    toggleText.textContent = 'Chưa có tài khoản?';
    toggleLink.textContent = 'Đăng ký';
  } else {
    usernameGroup.style.display = 'block';
    submitBtn.textContent = 'Đăng ký';
    toggleText.textContent = 'Đã có tài khoản?';
    toggleLink.textContent = 'Đăng nhập';
  }
}

async function loadUserProfile() {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      currentUser = await response.json();
      showMainApp();
      loadTasks();
    } else {
      localStorage.removeItem('humaiToken');
      authToken = null;
    }
  } catch (error) {
    console.error('Profile load error:', error);
  }
}

function showMainApp() {
  document.getElementById('authScreen').classList.remove('show');
  document.getElementById('mainApp').style.display = 'flex';
  updateUserUI();
}

function updateUserUI() {
  if (!currentUser) return;

  const initials = currentUser.displayName
    ? currentUser.displayName.substring(0, 2).toUpperCase()
    : currentUser.username.substring(0, 2).toUpperCase();

  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('streakValue').textContent = `🔥 ${currentUser.streak}`;
  document.getElementById('pointsValue').textContent = currentUser.points;
  document.getElementById('levelValue').textContent = currentUser.level;
  document.getElementById('tasksValue').textContent = currentUser.stats?.totalTasksCompleted || 0;
  document.getElementById('bannerPoints').textContent = `${currentUser.points} ✦`;
}

async function loadTasks() {
  try {
    const url = currentCategory === 'all'
      ? `${API_URL}/tasks`
      : `${API_URL}/tasks?category=${currentCategory}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      tasks = await response.json();
      renderTasks();
    }
  } catch (error) {
    console.error('Load tasks error:', error);
  }
}

function renderTasks() {
  const taskList = document.getElementById('taskList');

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <div class="empty-text">Chưa có nhiệm vụ nào</div>
      </div>
    `;
    return;
  }

  const categoryIcons = {
    gratitude: '🙏',
    gift: '🎁',
    journal: '📖',
    meditation: '🧘',
    exercise: '🏃',
    other: '📌'
  };

  taskList.innerHTML = tasks.map(task => `
    <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task._id}">
      <div class="task-checkbox">${task.completed ? '✓' : ''}</div>
      <div class="task-info">
        <div class="task-title">${categoryIcons[task.category] || '📌'} ${task.title}</div>
        ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
      </div>
      <div class="task-points">+${task.points} ✦</div>
    </div>
  `).join('');

  // Add click handlers
  document.querySelectorAll('.task-card:not(.completed)').forEach(card => {
    card.addEventListener('click', () => completeTask(card.dataset.id));
  });
}

async function handleCreateTask(e) {
  e.preventDefault();

  const taskData = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDesc').value,
    category: document.getElementById('taskCategory').value,
    points: parseInt(document.getElementById('taskPoints').value)
  };

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(taskData)
    });

    if (response.ok) {
      document.getElementById('taskModal').classList.remove('show');
      document.getElementById('taskForm').reset();
      loadTasks();
    }
  } catch (error) {
    console.error('Create task error:', error);
  }
}

async function completeTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      const data = await response.json();
      currentUser.points = data.user.points;
      currentUser.level = data.user.level;
      currentUser.streak = data.user.streak;
      currentUser.stats.totalTasksCompleted += 1;

      updateUserUI();
      loadTasks();

      // Show celebration
      showCelebration(data.task.points);
    }
  } catch (error) {
    console.error('Complete task error:', error);
  }
}

function showCelebration(points) {
  const celebration = document.createElement('div');
  celebration.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #FF7043, #FF9800);
    color: white;
    padding: 24px 32px;
    border-radius: 20px;
    font-size: 24px;
    font-weight: 900;
    z-index: 2000;
    animation: celebPop 0.5s ease;
  `;
  celebration.textContent = `+${points} ✦`;
  document.body.appendChild(celebration);

  setTimeout(() => celebration.remove(), 1000);
}
