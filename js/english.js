/* ============================================
   英语三级学习模块
   ============================================ */

// ---- 状态管理 ----
const EnglishState = {
  tasks: JSON.parse(localStorage.getItem('eng_tasks') || '[]'),
  currentTab: 'words',
};

// ---- 初始化 ----
function initEnglish() {
  renderTasks();
  renderWords();
  renderPhrases();
  renderWritings();
  bindEnglishEvents();
}

// ---- 每日任务 ----
function getTodayTasks() {
  const today = new Date().toDateString();
  const saved = EnglishState.tasks;
  // 如果今天已有保存状态，用保存的
  const todaySaved = saved.filter(t => t.date === today);
  if (todaySaved.length > 0) {
    return ENGLISH_DATA.dailyTasks.map(t => {
      const found = todaySaved.find(s => s.id === t.id);
      return { ...t, date: today, done: found ? found.done : false };
    });
  }
  // 否则创建新的
  return ENGLISH_DATA.dailyTasks.map(t => ({ ...t, date: today, done: false }));
}

function saveTaskState(id, done) {
  const today = new Date().toDateString();
  const existing = EnglishState.tasks.filter(t => t.date !== today);
  const todayTasks = getTodayTasks().map(t => ({
    id: t.id, date: today, done: t.id === id ? done : t.done
  }));
  EnglishState.tasks = [...existing, ...todayTasks];
  localStorage.setItem('eng_tasks', JSON.stringify(EnglishState.tasks));
}

function renderTasks() {
  const container = document.getElementById('taskList');
  const tasks = getTodayTasks();
  const doneCount = tasks.filter(t => t.done).length;
  const total = tasks.length;

  // 更新进度环
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const circle = document.getElementById('progressCircle');
  const text = document.getElementById('progressPercent');
  const circumference = 113;
  circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
  text.textContent = percent + '%';

  // 渲染任务
  container.innerHTML = tasks.map(t => `
    <div class="task-item ${t.done ? 'done' : ''}">
      <button class="task-check ${t.done ? 'done' : ''}" data-id="${t.id}" data-done="${t.done}"></button>
      <div class="task-body">
        <div class="task-title">${t.title}</div>
        <div class="task-desc">${t.desc} · ${t.duration}</div>
      </div>
    </div>
  `).join('');

  // 显示日期
  const now = new Date();
  document.getElementById('taskDate').textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

// ---- 单词 ----
function renderWords(filter = '') {
  const container = document.getElementById('wordList');
  let words = ENGLISH_DATA.words;
  if (filter) {
    const kw = filter.toLowerCase();
    words = words.filter(w =>
      w.en.toLowerCase().includes(kw) || w.cn.includes(kw)
    );
  }
  if (words.length === 0) {
    container.innerHTML = '<div class="empty-state">没有找到匹配的单词</div>';
    return;
  }
  container.innerHTML = words.map(w => `
    <div class="word-item">
      <div>
        <span class="word-en">${w.en}</span>
        <span class="word-phonetic">${w.phonetic}</span>
      </div>
      <div class="word-cn">${w.cn}</div>
      <div class="word-example">${w.example}</div>
    </div>
  `).join('');
}

// ---- 短语 ----
function renderPhrases() {
  const container = document.getElementById('phraseList');
  container.innerHTML = ENGLISH_DATA.phrases.map(p => `
    <div class="phrase-item">
      <div class="phrase-en">${p.en}</div>
      <div class="phrase-cn">${p.cn}</div>
      <div class="word-example">${p.example}</div>
    </div>
  `).join('');
}

// ---- 作文 ----
function renderWritings() {
  const container = document.getElementById('writingList');
  container.innerHTML = ENGLISH_DATA.writings.map(w => `
    <div class="writing-item">
      <div class="writing-title">${w.title}</div>
      <div class="writing-body">${w.body}</div>
    </div>
  `).join('');
}

// ---- 事件绑定 ----
function bindEnglishEvents() {
  // 任务打卡
  document.getElementById('taskList').addEventListener('click', (e) => {
    const btn = e.target.closest('.task-check');
    if (!btn) return;
    const id = btn.dataset.id;
    const done = btn.dataset.done === 'true';
    saveTaskState(id, !done);
    renderTasks();
  });

  // Tab 切换
  document.querySelectorAll('#page-english .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#page-english .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('#page-english .tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById('tab-' + tab).classList.add('active');
    });
  });

  // 单词搜索
  let searchTimer;
  document.getElementById('wordSearch').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderWords(e.target.value), 300);
  });
}
