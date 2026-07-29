-- 给 douyin_hot 表添加 url 字段（存储抖音视频链接）
ALTER TABLE douyin_hot ADD COLUMN IF NOT EXISTS url text;
