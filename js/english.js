/* ============================================
   英语三级学习模块（卡片模式 + Supabase 同步）
   ============================================ */

// ---- 状态管理 ----
const EnglishState = {
  tasks: JSON.parse(localStorage.getItem('eng_tasks') || '[]'),
  // 单词学习进度
  wordProgress: JSON.parse(localStorage.getItem('eng_word_progress') || '{}'),
  // 单词数据
  words: [],
  currentIndex: 0,
  reviewMode: false,
  isLoading: false,
};

const PROGRESS_KEY = 'eng_word_progress';
const LEARN_DATE_KEY = 'eng_learn_date';

// ---- 卡片轨道（滑动）相关状态 ----
let cardNodes = {};        // 索引 -> 卡片 DOM 节点（窗口化：只渲染当前 ±1 张）
const CARD_WINDOW = 1;     // 左右各预渲染 1 张，兼顾性能与"看得到邻卡"
let trackEl = null;        // 视口 DOM 引用（#cardTrack，负责裁剪，自身不位移）
let stripEl = null;        // 滑轨 DOM 引用（.card-strip，承载卡片并整体位移）
let lastStackSig = '';     // 上一次构建轨道的数据签名，用于判断是否需要重建

// 转义，避免数据中的 < > & 破坏结构
function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ---- 初始化 ----
function initEnglish() {
  renderTasks();
  renderPhrases();
  renderWritings();
  loadWordData();
  bindEnglishEvents();
}

// ---- 每日任务（保持原样）----
function getTodayTasks() {
  const today = new Date().toDateString();
  const saved = EnglishState.tasks;
  const todaySaved = saved.filter(t => t.date === today);
  if (todaySaved.length > 0) {
    return ENGLISH_DATA.dailyTasks.map(t => {
      const found = todaySaved.find(s => s.id === t.id);
      return { ...t, date: today, done: found ? found.done : false };
    });
  }
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

  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const circle = document.getElementById('progressCircle');
  const text = document.getElementById('progressPercent');
  const circumference = 113;
  circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
  text.textContent = percent + '%';

  container.innerHTML = tasks.map(t => `
    <div class="task-item ${t.done ? 'done' : ''}">
      <button class="task-check ${t.done ? 'done' : ''}" data-id="${t.id}" data-done="${t.done}"></button>
      <div class="task-body">
        <div class="task-title">${t.title}</div>
        <div class="task-desc">${t.desc} · ${t.duration}</div>
      </div>
    </div>
  `).join('');

  const now = new Date();
  document.getElementById('taskDate').textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

// ========== 单词卡片模式 ==========

// 标准化单词数据（兼容新旧格式）
function normalizeWord(w) {
  return {
    word: w.word || w.en || '',
    phonetic: w.phonetic_uk || w.phonetic || w.phonetic_us || '',
    meaning: w.meaning || w.cn || '',
    example: w.example || '',
    translation: w.translation || '',
  };
}

// 加载单词数据
async function loadWordData() {
  showLoading(true);

  let rawWords = [];

  // 1. 优先从 Supabase 加载
  if (isSupabaseReady()) {
    try {
      const data = await fetchData('english_words', {
        orderBy: { column: 'id', ascending: true }
      });
      if (data && data.length > 0) {
        rawWords = data;
      }
    } catch (e) {
      console.warn('[English] Supabase 加载失败，使用本地数据', e);
    }
  }

  // 2. fallback：从本地内置 JSON 加载
  if (rawWords.length === 0) {
    // 尝试从 data/english_words.json 加载（PWA 可通过 fetch 读取）
    try {
      const resp = await fetch('data/english_words.json');
      if (resp.ok) {
        const json = await resp.json();
        rawWords = json.words || [];
      }
    } catch (e) {
      console.warn('[English] 本地 JSON 加载失败，使用内置数据');
    }
  }

  // 3. 最后的 fallback：内置的小词库
  if (rawWords.length === 0) {
    // 标准化内置数据
    rawWords = ENGLISH_DATA.words.map(w => ({
      word: w.en,
      phonetic: w.phonetic || '',
      meaning: w.cn || '',
      example: w.example || '',
      translation: '',
    }));
  }

  // 标准化
  EnglishState.words = rawWords.map(normalizeWord);

  // 恢复学习进度
  restoreProgress();

  showLoading(false);
  renderCard();
  renderStats();
}

// 显示/隐藏加载状态
function showLoading(loading) {
  document.getElementById('cardLoading').style.display = loading ? 'block' : 'none';
  const els = ['cardTrack', 'cardProgress', 'cardActions', 'cardFooter'];
  els.forEach(id => {
    document.getElementById(id).style.display = loading ? 'none' : '';
  });
}

// 获取当前学习的单词列表（普通模式 all / 复习模式 only unknown）
function getActiveWords() {
  if (EnglishState.reviewMode) {
    const unknown = EnglishState.words.filter(w => {
      const p = EnglishState.wordProgress[w.word];
      return p === 'unknown';
    });
    return unknown.length > 0 ? unknown : EnglishState.words;
  }
  return EnglishState.words;
}

// 渲染当前卡片（animate=true 时带滑动过渡）
function renderCard(animate) {
  renderStack(!!animate);
}

// 显示"全部学完"状态
function showDone() {
  document.getElementById('cardTrack').style.display = 'none';
  document.getElementById('cardDone').style.display = 'block';
  document.getElementById('cardProgress').style.display = 'none';
  document.getElementById('cardActions').style.display = 'none';
  document.getElementById('cardFooter').style.display = 'none';
}

// 从"完成"状态切回卡片
function hideDone() {
  document.getElementById('cardDone').style.display = 'none';
  document.getElementById('cardTrack').style.display = 'block';
  document.getElementById('cardProgress').style.display = 'flex';
  document.getElementById('cardActions').style.display = 'flex';
  document.getElementById('cardFooter').style.display = 'block';
}

// 生成单张卡片 DOM
function buildCardEl(index, word, total) {
  const el = document.createElement('div');
  el.className = 'word-card';
  const status = EnglishState.wordProgress[word.word];
  if (status === 'known') el.classList.add('card-known');
  else if (status === 'unknown') el.classList.add('card-unknown');
  el.innerHTML = `
    <div class="card-word">${escapeHtml(word.word)}</div>
    <div class="card-number">${index + 1} / ${total}</div>
    <div class="card-phonetic">${escapeHtml(word.phonetic)}</div>
    <div class="card-divider"></div>
    <div class="card-meaning">${escapeHtml(word.meaning)}</div>
    <div class="card-example-box ${word.example ? '' : 'hidden'}">
      <div class="example-en">${escapeHtml(word.example)}</div>
      <div class="example-cn">${escapeHtml(word.translation || '')}</div>
    </div>`;
  return el;
}

// 保证窗口 [currentIndex-1, currentIndex+1] 内的卡片已渲染
function ensureWindow() {
  const activeWords = getActiveWords();
  const total = activeWords.length;
  const start = Math.max(0, EnglishState.currentIndex - CARD_WINDOW);
  const end = Math.min(total - 1, EnglishState.currentIndex + CARD_WINDOW);

  // 移除窗口外的旧节点
  Object.keys(cardNodes).forEach(k => {
    const i = parseInt(k, 10);
    if (i < start || i > end) {
      cardNodes[i].remove();
      delete cardNodes[i];
    }
  });

  // 补建窗口内缺失的节点
  for (let i = start; i <= end; i++) {
    if (!cardNodes[i] && activeWords[i]) {
      cardNodes[i] = buildCardEl(i, activeWords[i], total);
      stripEl.appendChild(cardNodes[i]);
    }
  }
  layoutCards();
}

// 当前轨道数据签名（复习模式 / 词库规模变化时需重建）
function currentStackSig() {
  return (EnglishState.reviewMode ? 'r:' : 'n:') + EnglishState.words.length;
}

// 清空并重建整条轨道（数据量/内容变化时调用）
function rebuildStack() {
  if (!trackEl) trackEl = document.getElementById('cardTrack');
  trackEl.innerHTML = '';
  // 视口(track)只负责裁剪；位移交给内层 strip，避免邻卡被 overflow 裁掉
  stripEl = document.createElement('div');
  stripEl.className = 'card-strip';
  trackEl.appendChild(stripEl);
  cardNodes = {};
  ensureWindow();
  positionTrack(false);
  lastStackSig = currentStackSig();
}

// 按轨道宽度定位每张卡片（像素，避免 % 歧义）
function layoutCards() {
  if (!trackEl) return;
  const w = trackEl.clientWidth;
  Object.keys(cardNodes).forEach(k => {
    const el = cardNodes[k];
    el.style.width = w + 'px';
    el.style.left = (parseInt(k, 10) * w) + 'px';
  });
  // 轨道高度跟随当前卡片
  const cur = cardNodes[EnglishState.currentIndex];
  if (cur) trackEl.style.height = cur.offsetHeight + 'px';
}

// 设置滑轨位移；dragPx 为拖动时的实时偏移
function positionTrack(animate, dragPx) {
  if (!stripEl) return;
  const w = trackEl.clientWidth;
  const x = -EnglishState.currentIndex * w + (dragPx || 0);
  stripEl.style.transition = animate
    ? 'transform 0.32s cubic-bezier(.22,.61,.36,1)'
    : 'none';
  stripEl.style.transform = `translate3d(${x}px,0,0)`;
}

// 统一的卡片渲染入口（窗口化 + 滑动动画）
function renderStack(animate) {
  const activeWords = getActiveWords();
  if (!trackEl) trackEl = document.getElementById('cardTrack');

  if (activeWords.length === 0) { showDone(); return; }
  hideDone();

  // 数据变化（切换复习模式 / 重新加载词库）时重建整条轨道
  if (currentStackSig() !== lastStackSig) {
    rebuildStack();
  } else {
    ensureWindow();
  }
  positionTrack(animate);

  // 进度条
  const total = activeWords.length;
  const progress = ((EnglishState.currentIndex + 1) / total) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
}

// 渲染统计信息
function renderStats() {
  const total = EnglishState.words.length;
  const learned = Object.keys(EnglishState.wordProgress).length;
  const known = Object.values(EnglishState.wordProgress).filter(v => v === 'known').length;
  const unknown = Object.values(EnglishState.wordProgress).filter(v => v === 'unknown').length;
  const masterRate = learned > 0 ? Math.round((known / learned) * 100) : 0;

  // 今日学习数
  const today = new Date().toDateString();
  const todayLearned = Object.entries(
    JSON.parse(localStorage.getItem(LEARN_DATE_KEY) || '{}')
  ).filter(([k, d]) => d === today).length;

  document.getElementById('todayCount').textContent = todayLearned || learned;
  document.getElementById('masterRate').textContent = masterRate + '%';
  document.getElementById('reviewCount').textContent = unknown;

  // 更新进度环（合并到每日任务进度）
  // 如果今日有学习，自动勾选背单词任务
  if (todayLearned > 0 || learned > 0) {
    const today = new Date().toDateString();
    const saved = EnglishState.tasks.filter(t => t.date !== today);
    const todayTasks = getTodayTasks().map(t => {
      if (t.id === 't1' && !t.done) {
        return { id: 't1', date: today, done: true };
      }
      return { id: t.id, date: today, done: t.done };
    });
    EnglishState.tasks = [...saved, ...todayTasks];
    localStorage.setItem('eng_tasks', JSON.stringify(EnglishState.tasks));
    renderTasks();
  }
}

// 上一个单词（不标记）
function prevCard() {
  const activeWords = getActiveWords();
  if (activeWords.length === 0) return;
  if (EnglishState.currentIndex > 0) {
    EnglishState.currentIndex--;
    renderCard(true);
  }
}

// 下一个单词（不标记）
function nextCard() {
  const activeWords = getActiveWords();
  if (activeWords.length === 0) return;
  if (EnglishState.currentIndex < activeWords.length - 1) {
    EnglishState.currentIndex++;
    renderCard(true);
  }
}

// 标记单词学习状态
function markWord(status) {
  const activeWords = getActiveWords();
  if (activeWords.length === 0) return;

  const word = activeWords[EnglishState.currentIndex];
  if (!word) return;

  // 保存进度
  EnglishState.wordProgress[word.word] = status;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(EnglishState.wordProgress));

  // 记录学习日期
  const dateLog = JSON.parse(localStorage.getItem(LEARN_DATE_KEY) || '{}');
  dateLog[word.word] = new Date().toDateString();
  localStorage.setItem(LEARN_DATE_KEY, JSON.stringify(dateLog));

  // 更新当前卡片的样式
  const cur = cardNodes[EnglishState.currentIndex];
  if (cur) {
    cur.classList.remove('card-known', 'card-unknown');
    if (status === 'known') cur.classList.add('card-known');
    else if (status === 'unknown') cur.classList.add('card-unknown');
  }

  // 下一张
  if (EnglishState.currentIndex < activeWords.length - 1) {
    EnglishState.currentIndex++;
  } else {
    // 学完一轮
    if (EnglishState.reviewMode) {
      // 复习模式：还有不认识的就继续
      EnglishState.currentIndex = 0;
    }
    // 检查是否全部完成
    const remaining = getActiveWords();
    if (remaining.length === 0 || (EnglishState.reviewMode && remaining.every(w => {
      return EnglishState.wordProgress[w.word] !== 'unknown';
    }))) {
      showDone();
      renderStats();
      return;
    }
  }

  renderCard(true);
  renderStats();
}

// 恢复学习进度
function restoreProgress() {
  const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  EnglishState.wordProgress = saved;
}

// 切换复习模式
function toggleReviewMode() {
  EnglishState.reviewMode = !EnglishState.reviewMode;
  EnglishState.currentIndex = 0;
  const btn = document.getElementById('btnReviewMode');
  if (EnglishState.reviewMode) {
    btn.textContent = '📖 普通模式';
    btn.classList.add('active');
  } else {
    btn.textContent = '🔁 复习模式';
    btn.classList.remove('active');
  }
  renderCard();
  renderStats();
}

// 重置进度
function resetProgress() {
  if (!confirm('确定要重置所有单词学习进度吗？')) return;
  EnglishState.wordProgress = {};
  localStorage.setItem(PROGRESS_KEY, '{}');
  EnglishState.currentIndex = 0;
  rebuildStack();
  renderStats();
}

// ---- 短语（保持原样）----
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

// ---- 作文（保持原样）----
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

  // 卡片操作：认识
  document.getElementById('btnKnown').addEventListener('click', () => markWord('known'));

  // 卡片操作：不认识
  document.getElementById('btnUnknown').addEventListener('click', () => markWord('unknown'));

  // 复习模式切换
  document.getElementById('btnReviewMode').addEventListener('click', toggleReviewMode);

  // 重置进度
  document.getElementById('btnResetProgress').addEventListener('click', resetProgress);

  // 重新开始
  document.getElementById('btnRestart').addEventListener('click', () => {
    EnglishState.currentIndex = 0;
    renderCard();
  });

  // 键盘快捷键：← 不认识，→ 认识
  document.addEventListener('keydown', (e) => {
    const wordsTab = document.getElementById('tab-words');
    if (!wordsTab.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') markWord('unknown');
    else if (e.key === 'ArrowRight') markWord('known');
  });

  // ===== 卡片滑动（轨道式：手指拖动时能看到上/下一张）=====
  const track = document.getElementById('cardTrack');
  trackEl = track;
  let dragStartX = 0, dragging = false;

  function onDragStart(clientX) {
    if (getActiveWords().length === 0) return;
    dragging = true;
    dragStartX = clientX;
    if (stripEl) stripEl.style.transition = 'none';
  }
  function onDragMove(clientX) {
    if (!dragging) return;
    const dx = clientX - dragStartX;
    positionTrack(false, dx);
  }
  function onDragEnd(clientX) {
    if (!dragging) return;
    dragging = false;
    const dx = clientX - dragStartX;
    const w = track.clientWidth;
    const threshold = Math.max(50, w * 0.2);   // 滑过约 1/5 宽度即切换
    const total = getActiveWords().length;
    if (dx <= -threshold && EnglishState.currentIndex < total - 1) {
      EnglishState.currentIndex++;            // 左滑 → 下一张
    } else if (dx >= threshold && EnglishState.currentIndex > 0) {
      EnglishState.currentIndex--;            // 右滑 → 上一张
    }
    renderCard(true);
  }

  // 触摸滑动（移动端）
  track.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove', e => onDragMove(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', e => onDragEnd(e.changedTouches[0].clientX), { passive: true });

  // 鼠标拖拽（桌面端预览/调试用）
  track.addEventListener('mousedown', e => {
    e.preventDefault();
    onDragStart(e.clientX);
  });
  window.addEventListener('mousemove', e => { if (dragging) onDragMove(e.clientX); });
  window.addEventListener('mouseup', e => { if (dragging) onDragEnd(e.clientX); });

  // 屏幕旋转/尺寸变化时重新布局
  window.addEventListener('resize', () => {
    if (getActiveWords().length > 0) { layoutCards(); positionTrack(false); }
  });
}
