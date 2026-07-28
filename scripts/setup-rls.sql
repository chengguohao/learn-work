-- ============================================
-- Supabase RLS 策略：允许匿名用户写入热点数据
-- 在 Supabase SQL Editor 中执行一次即可
-- ============================================

-- 抖音热点：允许匿名插入
CREATE POLICY "anon_insert" ON douyin_hot
  FOR INSERT TO anon WITH CHECK (true);

-- 小红书热点：允许匿名插入
CREATE POLICY "anon_insert" ON xhs_hot
  FOR INSERT TO anon WITH CHECK (true);

--（可选）允许匿名删除（清空旧数据用）
CREATE POLICY "anon_delete" ON douyin_hot
  FOR DELETE TO anon USING (true);
