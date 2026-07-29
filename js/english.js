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
  const els = ['wordCard', 'cardProgress', 'cardActions', 'cardFooter'];
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

// 渲染当前卡片
function renderCard() {
  const activeWords = getActiveWords();
  const total = activeWords.length;

  if (total === 0) {
    document.getElementById('wordCard').style.display = 'none';
    document.getElementById('cardDone').style.display = 'block';
    document.getElementById('cardProgress').style.display = 'none';
    document.getElementById('cardActions').style.display = 'none';
    document.getElementById('cardFooter').style.display = 'none';
    return;
  }

  document.getElementById('cardDone').style.display = 'none';
  document.getElementById('wordCard').style.display = 'block';
  document.getElementById('cardProgress').style.display = 'flex';
  document.getElementById('cardActions').style.display = 'flex';
  document.getElementById('cardFooter').style.display = 'block';

  // 确保索引在有效范围
  if (EnglishState.currentIndex >= total) {
    EnglishState.currentIndex = 0;
  }

  const word = activeWords[EnglishState.currentIndex];
  if (!word) return;

  document.getElementById('cardWord').textContent = word.word;
  document.getElementById('cardNumber').textContent = `${EnglishState.currentIndex + 1} / ${total}`;
  document.getElementById('cardPhonetic').textContent = word.phonetic;
  document.getElementById('cardMeaning').textContent = word.meaning;

  // 例句（如果有）
  const exampleBox = document.getElementById('cardExampleBox');
  if (word.example) {
    exampleBox.classList.remove('hidden');
    document.getElementById('cardExampleEn').textContent = word.example;
    document.getElementById('cardExampleCn').textContent = word.translation || '';
  } else {
    exampleBox.classList.add('hidden');
  }

  // 进度条
  const progress = ((EnglishState.currentIndex + 1) / total) * 100;
  document.getElementById('progressFill').style.width = progress + '%';

  // 标记当前单词的学习状态样式
  const card = document.getElementById('wordCard');
  const status = EnglishState.wordProgress[word.word];
  card.className = 'word-card';
  if (status === 'known') card.classList.add('card-known');
  else if (status === 'unknown') card.classList.add('card-unknown');
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
    renderCard();
  }
}

// 下一个单词（不标记）
function nextCard() {
  const activeWords = getActiveWords();
  if (activeWords.length === 0) return;
  if (EnglishState.currentIndex < activeWords.length - 1) {
    EnglishState.currentIndex++;
    renderCard();
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
    if (remaining.length === 0 || (EnglishState.reviewMode && remaining.filter(w => {
      return EnglishState.wordProgress[w.word] === 'unknown';
    }).length === 0)) {
      document.getElementById('wordCard').style.display = 'none';
      document.getElementById('cardDone').style.display = 'block';
      document.getElementById('cardProgress').style.display = 'none';
      document.getElementById('cardActions').style.display = 'none';
      document.getElementById('cardFooter').style.display = 'none';
      return;
    }
  }

  renderCard();
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
  renderCard();
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

  // 手机左右滑动切换单词
  var swipeStartX = 0, swipeIng = false;
  
  // 用事件委托到父容器，避免卡片隐藏时绑定事件的问题
  document.getElementById('tab-words').addEventListener('touchstart', function(e) {
    var card = e.target.closest('#wordCard');
    if (!card) return;
    swipeStartX = e.touches[0].clientX;
    swipeIng = true;
    card.style.transition = 'none';
    card.style.transform = '';
  }, { passive: true });
  
  document.getElementById('tab-words').addEventListener('touchmove', function(e) {
    if (!swipeIng) return;
    var card = document.getElementById('wordCard');
    var dx = e.touches[0].clientX - swipeStartX;
    card.style.transform = 'translateX(' + dx + 'px)';
  }, { passive: true });
  
  document.getElementById('tab-words').addEventListener('touchend', function(e) {
    if (!swipeIng) return;
    swipeIng = false;
    var card = document.getElementById('wordCard');
    var dx = swipeStartX - e.changedTouches[0].clientX;
    
    if (Math.abs(dx) > 40) {
      card.style.transition = 'transform 0.25s ease';
      card.style.transform = 'translateX(' + (dx > 0 ? '-120%' : '120%') + ')';
      setTimeout(function() {
        if (dx > 0) nextCard(); else prevCard();
        card.style.transition = 'none';
        card.style.transform = 'translateX(' + (dx > 0 ? '120%' : '-120%') + ')';
        requestAnimationFrame(function() {
          card.style.transition = 'transform 0.25s ease';
          card.style.transform = 'translateX(0)';
        });
      }, 200);
    } else {
      card.style.transition = 'transform 0.2s ease';
      card.style.transform = 'translateX(0)';
    }
  }, { passive: true });
}
