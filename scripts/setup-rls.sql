-- ============================================
-- Supabase RLS 策略：允许匿名用户读写热点数据
-- 在 Supabase SQL Editor 中执行一次即可
-- ============================================

-- 抖音热点
DROP POLICY IF EXISTS "anon_select" ON douyin_hot;
DROP POLICY IF EXISTS "anon_insert" ON douyin_hot;
DROP POLICY IF EXISTS "anon_delete" ON douyin_hot;

CREATE POLICY "anon_select" ON douyin_hot FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON douyin_hot FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_delete" ON douyin_hot FOR DELETE TO anon USING (true);

-- 小红书热点
DROP POLICY IF EXISTS "anon_select" ON xhs_hot;
DROP POLICY IF EXISTS "anon_insert" ON xhs_hot;

CREATE POLICY "anon_select" ON xhs_hot FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON xhs_hot FOR INSERT TO anon WITH CHECK (true);
