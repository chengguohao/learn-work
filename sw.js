// 成国浩的工作台 - Service Worker
const CACHE_NAME = 'chenggh-workbench-v1';
const ASSETS = [
  '.',
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/supabase.js',
  'js/english.js',
  'js/douyin.js',
  'js/xiaohongshu.js',
  'data/english-3.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/512.png',
];

// 安装：缓存核心文件
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// 拦截请求：缓存优先，网络备用
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).catch(() => cached)
    )
  );
});
