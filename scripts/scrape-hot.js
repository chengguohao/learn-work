// 抖音热榜抓取 + 导入 Supabase 工具
// 运行：node scripts/scrape-hot.js
// 前置：先在 Supabase SQL Editor 执行下方 SQL 开启 RLS 策略

const { chromium } = require('playwright');

const SUPABASE_URL = 'https://rcxtmcfcahskmakzvjco.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeHRtY2ZjYWhza21ha3p2amNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDc3MzMsImV4cCI6MjEwMDgyMzczM30.R-x1sb4WoZzNpf5_12JxrSCXEfng2k-_xpek0q7r0FY';

const STYLES = ['搞笑', '知识', '生活', '美食', '旅行'];

async function scrapeDouyinHot() {
  console.log('🔥 正在抓取抖音热榜...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.douyin.com/hot', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  const text = await page.textContent('body');
  await browser.close();

  const idx = text.indexOf('抖音热榜');
  if (idx < 0) throw new Error('未找到抖音热榜数据');
  
  const block = text.substring(idx + 4);
  const re = /(.+?)([\d.]+万热度)/g;
  let m;
  const items = [];
  while ((m = re.exec(block)) !== null && items.length < 30) {
    const title = m[1].trim().replace(/^\d+/, '').trim();
    if (title && title.length > 2) {
      items.push({ title, hot: m[2] });
    }
  }
  return items;
}

async function saveToSupabase(items) {
  console.log(`📤 正在写入 ${items.length} 条数据到 Supabase...`);
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates'
  };

  // 先清空旧数据
  const delResp = await fetch(SUPABASE_URL + '/rest/v1/douyin_hot', {
    method: 'DELETE',
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
  console.log('  清除旧数据:', delResp.status, delResp.statusText);

  // 插入新数据
  const records = items.map((item, i) => ({
    title: item.title,
    description: `抖音热榜第${i + 1}名`,
    style: STYLES[i % STYLES.length],
    views: item.hot,
    likes: '--',
    adapt_tip: '🎯 可参考此热点做相关内容改编'
  }));

  const insertResp = await fetch(SUPABASE_URL + '/rest/v1/douyin_hot', {
    method: 'POST',
    headers,
    body: JSON.stringify(records)
  });

  if (insertResp.ok) {
    console.log('✅ 成功写入 ' + items.length + ' 条数据');
  } else {
    const err = await insertResp.text();
    console.log('❌ 写入失败:', err.substring(0, 200));
    if (err.includes('row-level security')) {
      console.log('\n⚠️ 需要先在 Supabase SQL Editor 中执行:');
      console.log('   CREATE POLICY "anon_insert" ON douyin_hot FOR INSERT TO anon WITH CHECK (true);');
    }
  }
}

async function main() {
  try {
    const items = await scrapeDouyinHot();
    console.log('✅ 抓到 ' + items.length + ' 条热榜');
    items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.title} (${item.hot})`);
    });
    await saveToSupabase(items);
  } catch (e) {
    console.log('❌ 错误:', e.message);
  }
}

main();
