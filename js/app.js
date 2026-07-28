/* ============================================
   成国浩的工作台 — 主应用
   ============================================ */

// ---- 页面导航 ----
let currentPage = 'english';

function navigateTo(page) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // 显示目标页面
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  // 更新底部导航
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add('active');

  currentPage = page;
}

// ---- 底部导航事件 ----
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    navigateTo(btn.dataset.page);
  });
});

// ---- 显示日期 ----
function updateDate() {
  const now = new Date();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const el = document.getElementById('todayDate');
  if (el) {
    el.textContent = `${now.getMonth() + 1}/${now.getDate()} 周${weekdays[now.getDay()]}`;
  }
}

// ---- Supabase 初始化 ----
function initSupabase() {
  initSupabaseClient();
  console.log('📡 Supabase 已连接');
}

// 保存配置（手动更换时用）
document.getElementById('saveConfig').addEventListener('click', () => {
  const url = document.getElementById('inputUrl').value.trim();
  const key = document.getElementById('inputKey').value.trim();

  if (!url || !key) {
    alert('请填写完整的 Supabase URL 和 Anon Key');
    return;
  }

  if (!url.startsWith('https://') || !url.includes('supabase.co')) {
    alert('URL 格式不正确，请检查');
    return;
  }

  saveSupabaseConfig(url, key);
  document.getElementById('configModal').classList.remove('show');
  initSupabaseClient();

  if (currentPage === 'douyin') loadDouyinData();
  if (currentPage === 'xiaohongshu') loadXHSHotData();

  alert('✅ 配置已更新');
});

// 启动
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  initSupabase();
  initEnglish();
  initDouyin();
  initXiaohongshu();
  console.log('⚡ 成国浩的工作台已启动');
});

// ---- 每次页面可见时更新日期 ----
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateDate();
});
