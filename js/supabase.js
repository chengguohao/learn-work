/* ============================================
   Supabase 客户端配置
   ============================================ */

const SUPABASE_CONFIG_KEY = 'chenggh_supabase_config';

// 默认配置（已内置，开箱即用）
const DEFAULT_CONFIG = {
  url: 'https://rcxtmcfcahskmakzvjco.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeHRtY2ZjYWhza21ha3p2amNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDc3MzMsImV4cCI6MjEwMDgyMzczM30.R-x1sb4WoZzNpf5_12JxrSCXEfng2k-_xpek0q7r0FY',
};

// 从 localStorage 读取配置（没有则用默认）
function getSupabaseConfig() {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_CONFIG;
}

// 保存配置到 localStorage
function saveSupabaseConfig(url, key) {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url, key }));
}

// 获取 Supabase 客户端（如果已配置）
let supabaseClient = null;

function initSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config || !config.url || !config.key) {
    console.warn('[Supabase] 未配置，使用本地模式');
    return null;
  }
  try {
    supabaseClient = supabase.createClient(config.url, config.key, {
      auth: { persistSession: false }
    });
    console.log('[Supabase] 客户端初始化成功');
    return supabaseClient;
  } catch (err) {
    console.error('[Supabase] 初始化失败:', err);
    return null;
  }
}

// 检查 Supabase 是否可用
function isSupabaseReady() {
  return supabaseClient !== null;
}

// ========== 数据同步函数 ==========

// 通用：从表查询数据
async function fetchData(table, options = {}) {
  if (!isSupabaseReady()) return null;
  try {
    let query = supabaseClient.from(table).select('*');
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? false });
    }
    if (options.limit) query = query.limit(options.limit);
    if (options.eq) query = query.eq(options.eq.column, options.eq.value);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`[Supabase] 查询 ${table} 失败:`, err);
    return null;
  }
}

// 通用：插入数据
async function insertData(table, records) {
  if (!isSupabaseReady()) return null;
  try {
    const { data, error } = await supabaseClient.from(table).insert(records).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`[Supabase] 插入 ${table} 失败:`, err);
    return null;
  }
}

// 通用：更新数据
async function updateData(table, id, updates) {
  if (!isSupabaseReady()) return null;
  try {
    const { data, error } = await supabaseClient.from(table).update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`[Supabase] 更新 ${table} 失败:`, err);
    return null;
  }
}

// 通用：删除数据
async function deleteData(table, id) {
  if (!isSupabaseReady()) return null;
  try {
    const { error } = await supabaseClient.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`[Supabase] 删除 ${table} 失败:`, err);
    return null;
  }
}
