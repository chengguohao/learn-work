/* ============================================
   小红书 · 复盘与灵感模块
   ============================================ */

const XHSState = {
  currentStyle: 'all',
  reviews: JSON.parse(localStorage.getItem('xhs_reviews') || '[]'),
  currentSubtab: 'hot',
};

// ---- 初始化 ----
function initXiaohongshu() {
  loadXHSHotData();
  renderReviews();
  renderInspire();
  bindXHSEvents();
}

// ---- 热点数据 ----
function loadXHSHotData() {
  if (isSupabaseReady()) {
    fetchData('xhs_hot')
      .then(data => {
        if (data && data.length > 0) {
          XHSState.hotData = data.map(item => ({
            ...item,
            adaptTip: item.adapt_tip,
          }));
          renderXHSHotList();
          return;
        }
        loadLocalXHSData();
      })
      .catch(() => loadLocalXHSData());
  } else {
    loadLocalXHSData();
  }
}

function loadLocalXHSData() {
  XHSState.hotData = getLocalXHSData();
  renderXHSHotList();
}

function getLocalXHSData() {
  return [
    {
      id: 1, title: '一周穿搭不重样｜早春通勤穿搭指南',
      description: '图文合集类，收藏率极高',
      style: '穿搭', likes: '45.2w', collects: '28.6w',
      adaptTip: '🎯 可以结合"备考期间穿搭"做日常内容'
    },
    {
      id: 2, title: '素人改造｜普通女孩如何找到自己的风格',
      description: '变身类内容，评论区讨论热烈',
      style: '穿搭', likes: '38.7w', collects: '22.1w',
      adaptTip: '🎯 可以做成"学英语前后的变化"对比'
    },
    {
      id: 3, title: '沉浸式护肤｜夜间护肤流程分享',
      description: 'ASMR 风格，完播率高',
      style: '美妆', likes: '32.5w', collects: '18.3w',
      adaptTip: '🎯 可以做成"沉浸式学习"同款风格'
    },
    {
      id: 4, title: '平价彩妆推荐｜百元以内好物合集',
      description: '好物推荐类，带货属性强',
      style: '美妆', likes: '29.8w', collects: '20.5w',
      adaptTip: '🎯 改成"百元以内英语学习好物"'
    },
    {
      id: 5, title: '租房改造｜出租屋也能拥有的温馨小窝',
      description: '改造类爆款，前后对比强烈',
      style: '生活', likes: '42.3w', collects: '35.1w',
      adaptTip: '🎯 可以拍"书桌改造｜打造高效学习区"'
    },
    {
      id: 6, title: '自律打卡｜30天改变自己计划表',
      description: '教程类PDF分享，评论求模板',
      style: '生活', likes: '36.8w', collects: '29.4w',
      adaptTip: '🎯 直接做"公共英语三级30天计划表"可分享'
    },
    {
      id: 7, title: '烤箱美食｜懒人版巴斯克蛋糕一次成功',
      description: '美食教程，步骤清晰易模仿',
      style: '美食', likes: '25.6w', collects: '15.2w',
      adaptTip: '🎯 学习这类"步骤化"内容形式做英语教学'
    },
    {
      id: 8, title: '周末去哪｜说走就走的一日游攻略',
      description: '旅游攻略类，收藏备用型',
      style: '旅行', likes: '22.4w', collects: '18.7w',
      adaptTip: '🎯 可以结合"边旅行边学英语"主题'
    },
  ];
}

// ---- 渲染热点列表 ----
function renderXHSHotList() {
  const container = document.getElementById('xhsHotList');
  let items = XHSState.hotData || [];

  if (XHSState.currentStyle !== 'all') {
    items = items.filter(item => item.style === XHSState.currentStyle);
  }

  if (items.length === 0) {
    container.innerHTML = '<div class="empty-state">该分类暂无热点</div>';
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
        <span class="hot-stats">❤️ ${item.likes} · 📌 ${item.collects}</span>
        <span class="hot-tag">#${item.style}</span>
        <span class="hot-adapt">${item.adaptTip}</span>
      </div>
    </div>
  `).join('');
}

// ---- 复盘系统 ----
function renderReviews() {
  const container = document.getElementById('reviewList');
  const reviews = XHSState.reviews;

  if (reviews.length === 0) {
    container.innerHTML = '<div class="empty-state">还没有复盘记录，发布一条吧 📝</div>';
    return;
  }

  // 按时间倒序
  const sorted = [...reviews].sort((a, b) => new Date(b.time) - new Date(a.time));

  container.innerHTML = sorted.map(r => {
    const optimizeTips = generateOptimizeTips(r);
    return `
      <div class="review-card">
        <div class="review-card-title">${r.title || '无标题'}</div>
        <div class="review-card-body">${r.content}</div>
        <div class="review-card-meta">
          <span>📄 ${r.type || '图文'}</span>
          <span>🕐 ${formatTime(r.time)}</span>
        </div>
        <div class="review-card-optimize">
          <strong>💪 优化建议：</strong><br>${optimizeTips}
        </div>
      </div>
    `;
  }).join('');
}

// ---- AI 复盘优化建议（基于规则） ----
function generateOptimizeTips(review) {
  const tips = [];
  const title = review.title || '';
  const content = review.content || '';

  if (title.length < 5) {
    tips.push('📌 标题较短，建议10-20字，加入关键词如"英语三级/打卡/逆袭"');
  }
  if (title.length > 25) {
    tips.push('📌 标题过长，建议精简到20字以内');
  }
  if (!['?', '！', '❗', '✨', '🔥'].some(c => content.includes(c))) {
    tips.push('📌 文案缺少情绪符号，适当加入❗✨🔥等表情增加互动感');
  }
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 3) {
    tips.push('📌 文案段落较少，建议分段：开头吸引→中间干货→结尾互动');
  }
  if (!/\d+天|\d+个|\d+种/.test(content)) {
    tips.push('📌 加入数字（如"3个方法""30天挑战"）能明显提升点击率');
  }
  if (!content.includes('?' || '？')) {
    tips.push('📌 结尾加一个互动问题（如"你觉得呢？"）能提升评论区活跃度');
  }
  // 检查是否有号召行动
  if (!/关注|收藏|点赞|评论|转发/.test(content)) {
    tips.push('📌 没有引导互动，建议加入"点赞收藏关注"等CTA引导');
  }
  // 检查是否有表情
  if (!/[\u{1F000}-\u{1FFFF}]/u.test(content)) {
    tips.push('📌 全文字无表情符号，适当加入📚🔥✨💪等表情增加视觉吸引力');
  }

  if (tips.length === 0) {
    tips.push('✅ 这篇内容质量不错！继续优化细节，保持稳定更新频率');
  }

  return tips.slice(0, 4).join('<br>');
}

// ---- 灵感系统 ----
function renderInspire() {
  const container = document.getElementById('inspireContent');
  const inspires = getInspires();
  const random = inspires[Math.floor(Math.random() * inspires.length)];
  container.innerHTML = `
    <p class="inspire-text">💡 ${random.text}</p>
    <p class="inspire-source">📎 ${random.source}</p>
  `;
}

function getInspires() {
  return [
    { text: '「挑战」用英语点单：拍一个去咖啡店全程用英语交流的Vlog，展示真实交流场景', source: '结合英语学习+生活场景' },
    { text: '「对比」英语三级考前VS考后：用幽默的方式展示备考前后的变化反差', source: '抖音热门反差类内容形式' },
    { text: '「干货」公共英语三级高频词汇200个（PDF可打印）— 发图文让评论区留邮箱', source: '小红书收藏型爆款模式' },
    { text: '「日常」36小时沉浸式备考：从早到晚的学习生活记录，展示时间管理和学习方法', source: '小红书/抖音双平台适用' },
    { text: '「测评」5个免费英语学习App实测推荐，哪个最适合考三级？', source: '好物测评类高互动形式' },
    { text: '「故事」我为什么决定考公共英语三级？讲述个人故事引发共鸣', source: '个人叙事类高完播率' },
    { text: '「教程」10分钟搞定英语三级作文模板，背完直接上考场', source: '教育类强干货高收藏' },
    { text: '「问答」粉丝提问：英语零基础能过三级吗？一一回答消除焦虑', source: '互动类高评论率' },
    { text: '「改造」把书桌改成ins风学习角，学习动力翻倍', source: '小红书热门改造类' },
    { text: '「Vlog」去图书馆沉浸式学习的一天，记录专注时刻', source: '日常Vlog治愈系风格' },
    { text: '「盘点」那些年考英语三级踩过的坑，帮粉丝避雷', source: '经验分享类高互动' },
    { text: '「打卡」30天英语三级备考 Day 1 — 用打卡系列养成追更习惯', source: '系列化内容提高粉丝粘性' },
    { text: '「探店」探访城市最美书店/自习室，边探边聊英语学习', source: '跨领域结合增加新鲜感' },
    { text: '「方法论」如何无痛背单词？记忆曲线+场景化学习法', source: '方法论干货高收藏率' },
    { text: '「配音」用英语给热门电影片段配音，展示口语练习成果', source: '趣味性内容增加传播度' },
    { text: '「翻包」备考党的包包里有什么？学习好物分享', source: '小红书"翻包"系列热门形式' },
  ];
}

// ---- 工具 ----
function formatTime(timeStr) {
  const d = new Date(timeStr);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ---- 事件绑定 ----
function bindXHSEvents() {
  // 风格标签
  document.querySelectorAll('#page-xiaohongshu .style-tags .tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#page-xiaohongshu .style-tags .tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      XHSState.currentStyle = btn.dataset.style;
      renderXHSHotList();
    });
  });

  // 子 Tab 切换
  document.querySelectorAll('#page-xiaohongshu .tab-bar .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#page-xiaohongshu .tab-bar .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sub = btn.dataset.subtab;
      document.querySelectorAll('#page-xiaohongshu .tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById('subtab-xhs-' + sub).classList.add('active');
    });
  });

  // 提交复盘
  document.getElementById('submitReview').addEventListener('click', () => {
    const content = document.getElementById('reviewContent').value.trim();
    const title = document.getElementById('reviewTitle').value.trim();
    const type = document.getElementById('reviewType').value;

    if (!content) {
      alert('请填写内容');
      return;
    }

    const review = {
      id: Date.now(),
      title: title || '未命名内容',
      content,
      type,
      time: new Date().toISOString(),
    };

    // 保存到本地
    XHSState.reviews.unshift(review);
    localStorage.setItem('xhs_reviews', JSON.stringify(XHSState.reviews));

    // 如果有 Supabase，同步
    if (isSupabaseReady()) {
      insertData('xhs_reviews', review);
    }

    // 清空表单
    document.getElementById('reviewContent').value = '';
    document.getElementById('reviewTitle').value = '';
    renderReviews();

    // 切换到复盘 tab 查看结果
    document.querySelector('[data-subtab="review"]').click();
  });

  // 换灵感
  document.getElementById('refreshInspire').addEventListener('click', renderInspire);
}
