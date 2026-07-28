/* ============================================
   抖音热点模块
   ============================================ */

const DouyinState = {
  currentStyle: 'all',
  data: [],
};

// ---- 初始化 ----
function initDouyin() {
  loadDouyinData();
  bindDouyinEvents();
}

// ---- 加载数据 ----
function loadDouyinData() {
  // 优先从 Supabase 加载（如果已配置）
  if (isSupabaseReady()) {
    fetchData('douyin_hot')
      .then(data => {
        if (data && data.length > 0) {
          // 将 Supabase 的 snake_case 映射为前端 camelCase
          DouyinState.data = data.map(item => ({
            ...item,
            adaptTip: item.adapt_tip,
          }));
          renderDouyinList();
          return;
        }
        // 无数据则用本地示例
        loadLocalDouyinData();
      })
      .catch(() => loadLocalDouyinData());
  } else {
    loadLocalDouyinData();
  }
}

// ---- 本地示例数据 ----
function loadLocalDouyinData() {
  DouyinState.data = getLocalDouyinData();
  renderDouyinList();
}

function getLocalDouyinData() {
  return [
    {
      id: 1, title: '【挑战】30天学会一项新技能，第一天就翻车了！',
      description: '搞笑翻车现场，播放量破500w',
      style: '搞笑', views: '528.3w', likes: '32.1w',
      adaptTip: '🎯 可以改编成"30天学英语"系列'
    },
    {
      id: 2, title: '拒绝焦虑｜普通人如何找到人生方向？',
      description: '知识类高赞内容，评论区共鸣强烈',
      style: '知识', views: '412.7w', likes: '28.5w',
      adaptTip: '🎯 可以结合英语学习做"普通人如何自学过三级"'
    },
    {
      id: 3, title: '美食博主探店｜藏在巷子里的神仙小店',
      description: '沉浸式探店，节奏感强，完播率高',
      style: '美食', views: '386.2w', likes: '21.3w',
      adaptTip: '🎯 探店的形式可以借鉴做"探店式学习打卡"'
    },
    {
      id: 4, title: '生活记录｜和我一起过一天吧 Vlog',
      description: '日常 Vlog 形式，治愈系风格',
      style: '生活', views: '295.8w', likes: '18.2w',
      adaptTip: '🎯 可以拍"备考 PETS-3 的一天"同款 Vlog'
    },
    {
      id: 5, title: '旅行Vlog｜100元挑战在一个陌生城市生活一天',
      description: '低成本挑战类，评论区互动极强',
      style: '旅行', views: '267.4w', likes: '15.6w',
      adaptTip: '🎯 改成"100元挑战一天英语学习资料"'
    },
    {
      id: 6, title: '英语学习方法｜半年从零基础到流利交流',
      description: '教育类爆款，收藏率高',
      style: '知识', views: '243.1w', likes: '19.8w',
      adaptTip: '🎯 直接对标："公共英语三级30天冲刺计划"'
    },
    {
      id: 7, title: '搞笑配音｜当你的朋友开始学英语',
      description: '情景喜剧式，评论区互动活跃',
      style: '搞笑', views: '218.6w', likes: '14.2w',
      adaptTip: '🎯 可以拍"学英语的尴尬瞬间"系列'
    },
    {
      id: 8, title: '自律Vlog｜凌晨5点起床学习的人现在怎么样了',
      description: '自律类高频话题，激励型内容',
      style: '生活', views: '198.5w', likes: '12.7w',
      adaptTip: '🎯 结合："凌晨5点备考公共英语三级"'
    },
  ];
}

// ---- 渲染列表 ----
function renderDouyinList() {
  const container = document.getElementById('dyHotList');
  let items = DouyinState.data;

  if (DouyinState.currentStyle !== 'all') {
    items = items.filter(item => item.style === DouyinState.currentStyle);
  }

  if (items.length === 0) {
    container.innerHTML = '<div class="empty-state">该分类暂无热点数据</div>';
    return;
  }

  container.innerHTML = items.map((item, idx) => `
    <div class="hot-item">
      <div>
        <span class="hot-rank ${idx < 3 ? 'top3' : ''}">${idx + 1}</span>
        <span style="font-size:12px;color:var(--text-secondary)">${item.style}</span>
      </div>
      <div class="hot-title">${item.title}</div>
      <div class="hot-desc">${item.description}</div>
      <div class="hot-meta">
        <span class="hot-stats">👁 ${item.views} · ❤️ ${item.likes}</span>
        <span class="hot-tag">#${item.style}</span>
        <span class="hot-adapt">${item.adaptTip}</span>
      </div>
    </div>
  `).join('');
}

// ---- 事件绑定 ----
function bindDouyinEvents() {
  document.querySelectorAll('#page-douyin .tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#page-douyin .tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      DouyinState.currentStyle = btn.dataset.style;
      renderDouyinList();
    });
  });
}
