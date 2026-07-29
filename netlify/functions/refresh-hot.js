// Netlify Function：刷新抖音热点
const SUPABASE_URL = 'https://rcxtmcfcahskmakzvjco.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeHRtY2ZjYWhza21ha3p2amNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDc3MzMsImV4cCI6MjEwMDgyMzczM30.R-x1sb4WoZzNpf5_12JxrSCXEfng2k-_xpek0q7r0FY';

// 从抖音 API 抓热榜
async function fetchFromDouyin() {
  const resp = await fetch('https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&detail_list=1&source=6&main_billboard_count=5&pc_client_type=1', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.douyin.com/hot',
      'Accept': 'application/json, text/plain, */*'
    }
  });
  if (!resp.ok) throw new Error('抖音API状态码: ' + resp.status);
  const data = await resp.json();
  const items = data?.data?.word_list || [];
  if (items.length === 0) throw new Error('抖音API返回空数据');
  return items.slice(0, 5);
}

exports.handler = async function () {
  try {
    // 1. 抓取抖音热榜
    let items;
    try {
      items = await fetchFromDouyin();
    } catch (e) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: '抓取抖音热榜失败: ' + e.message })
      };
    }

    // 2. 准备数据
    const styles = ['搞笑', '知识', '生活', '美食', '旅行'];
    const records = items.map((item, i) => ({
      title: item.word,
      description: '🔥 热榜第' + (i + 1) + '名',
      style: styles[i],
      views: (item.hot_value / 10000).toFixed(1) + 'w',
      likes: '--',
      adapt_tip: '🎯 可改编 ↓点击跳转抖音',
    }));

    // 3. 写入 Supabase
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json'
    };

    // 先清空旧数据
    await fetch(SUPABASE_URL + '/rest/v1/douyin_hot?id=gte.0', {
      method: 'DELETE', headers
    });

    // 插入新数据
    const ins = await fetch(SUPABASE_URL + '/rest/v1/douyin_hot', {
      method: 'POST', headers, body: JSON.stringify(records)
    });

    if (!ins.ok) {
      const txt = await ins.text();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '写入Supabase失败: ' + txt.substring(0, 100) })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, count: items.length })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '系统错误: ' + e.message })
    };
  }
};
