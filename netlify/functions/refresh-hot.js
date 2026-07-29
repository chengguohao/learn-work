// Netlify Function：刷新抖音热点
const SUPABASE_URL = 'https://rcxtmcfcahskmakzvjco.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeHRtY2ZjYWhza21ha3p2amNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDc3MzMsImV4cCI6MjEwMDgyMzczM30.R-x1sb4WoZzNpf5_12JxrSCXEfng2k-_xpek0q7r0FY';

exports.handler = async function () {
  try {
    const resp = await fetch('https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&detail_list=1&source=6&main_billboard_count=5&pc_client_type=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.douyin.com/hot'
      }
    });
    const data = await resp.json();
    const items = (data?.data?.word_list || []).slice(0, 5);
    if (items.length === 0) {
      return { statusCode: 500, body: JSON.stringify({ error: '未抓取到数据' }) };
    }

    const styles = ['搞笑', '知识', '生活', '美食', '旅行'];
    const records = items.map((item, i) => ({
      title: item.word,
      // 把链接藏在 description 里，前端解析
      description: '🔥 热榜第' + (i + 1) + '名',
      style: styles[i],
      views: (item.hot_value / 10000).toFixed(1) + 'w',
      likes: '--',
      adapt_tip: '🎯 可改编 ↓点击跳转抖音',
      url: item.group_id ? 'https://www.douyin.com/video/' + item.group_id : ''
    }));

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    };

    // 插入（不清空旧数据，新数据会排在前面）
    const ins = await fetch(SUPABASE_URL + '/rest/v1/douyin_hot', {
      method: 'POST', headers, body: JSON.stringify(records)
    });

    if (!ins.ok) {
      const txt = await ins.text();
      // 如果 url 列不存在，去掉重试
      if (txt.includes('url')) {
        const fallback = records.map(({ url, ...r }) => r);
        const ins2 = await fetch(SUPABASE_URL + '/rest/v1/douyin_hot', {
          method: 'POST', headers, body: JSON.stringify(fallback)
        });
        if (ins2.ok) {
          return {
            statusCode: 200,
            body: JSON.stringify({ success: true, count: items.length, noLink: true })
          };
        }
        return { statusCode: 500, body: JSON.stringify({ error: '写入失败' }) };
      }
      return { statusCode: 500, body: JSON.stringify({ error: txt.substring(0, 100) }) };
    }

    const inserted = await ins.json();
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true, count: inserted.length,
        hasLink: true,
        data: inserted.map(r => ({ title: r.title, url: r.url }))
      })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
