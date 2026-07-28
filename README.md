# ⚡ 成国浩的工作台

手机 + 电脑都能用的个人工作台，数据通过 Supabase 多端同步。

## 🚀 快速启动

直接在浏览器打开 `index.html` 即可：

```
start index.html
```

或者双击 `index.html` 文件。

## 🔑 详细步骤：配置 Supabase 数据同步

工作台需要用到 3 张数据表，跟着下面的步骤一次性搞定。

---

### 第一步：创建 Supabase 项目（如果没有）

> 如果你已经有项目了，跳到第二步。

1. 打开 [supabase.com](https://supabase.com)，点击右上角 **Sign In**（用 GitHub 登录最快）
2. 登录后进入 Dashboard，点击 **New project**
3. 填写项目信息：
   - **Name**：随便填，比如 `chenggh-workbench`
   - **Database Password**：设置一个密码（**一定要记住！**）
   - **Region**：选 **Singapore**（新加坡，国内访问最快）
   - **Pricing Plan**：选 **Free**（免费计划够用）
4. 点击 **Create new project**，等 1-2 分钟创建完成

---

### 第二步：找到 API 配置信息

1. 进入你的项目，点击左侧菜单 **Project Settings**（⚙️ 齿轮图标）
2. 在 Settings 页面点击左侧 **API**
3. 在 **Project API keys** 区域，你会看到两行：

| 你需要的是 | 长什么样 | 位置 |
|-----------|---------|------|
| **Project URL** | `https://xxxxx.supabase.co` | 页面最上方 |
| **anon public key** | `eyJhbGciOiJIUzI1NiIs...`（很长一串） | API Keys 区域第 1 行 |

> ⚠️ 用 **anon public**（第1行），**不要**用 service_role key（第2行）！

---

### 第三步：在 Supabase 创建数据库表

1. 点击左侧菜单 **Table Editor**（表格图标）
2. 点击 **Create a new table**，按下面的规格建 3 张表：

#### 表① `douyin_hot`（抖音热点）

| 列名 | 类型 | 说明 |
|------|------|------|
| `id` | `int8` | ✅ 勾选 "Is Primary Key"，勾选 "Is Identity" |
| `title` | `text` | 视频标题 |
| `description` | `text` | 视频描述 |
| `style` | `text` | 风格（搞笑/知识/生活/美食/旅行） |
| `views` | `text` | 播放量，如 "528.3w" |
| `likes` | `text` | 点赞数，如 "32.1w" |
| `adapt_tip` | `text` | 二创改编建议 |

建表 SQL（点击 **SQL Editor** → 贴进去运行）：
```sql
CREATE TABLE douyin_hot (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  description text,
  style text,
  views text,
  likes text,
  adapt_tip text
);
```

#### 表② `xhs_hot`（小红书热点）

| 列名 | 类型 | 说明 |
|------|------|------|
| `id` | `int8` | ✅ 主键 + 自增 |
| `title` | `text` | 标题 |
| `description` | `text` | 描述 |
| `style` | `text` | 风格（穿搭/美妆/生活/美食/旅行） |
| `likes` | `text` | 点赞数 |
| `collects` | `text` | 收藏数 |
| `adapt_tip` | `text` | 改编建议 |

SQL：
```sql
CREATE TABLE xhs_hot (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  description text,
  style text,
  likes text,
  collects text,
  adapt_tip text
);
```

#### 表③ `xhs_reviews`（小红书复盘记录）

| 列名 | 类型 | 说明 |
|------|------|------|
| `id` | `int8` | ✅ 主键 + 自增 |
| `title` | `text` | 内容标题 |
| `content` | `text` | 文案内容 |
| `type` | `text` | 类型（图文/视频） |
| `time` | `timestamptz` | 发布时间 |

SQL：
```sql
CREATE TABLE xhs_reviews (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text,
  content text,
  type text,
  time timestamptz DEFAULT now()
);
```

> **建完 3 张表后**，回到 **Table Editor** 确认每张表都能看到。

---

### 第四步：把信息填进工作台

1. 用浏览器打开 `index.html`
2. 弹出配置窗口，依次填入：
   - **Project URL** → 粘贴 `https://xxxxx.supabase.co`
   - **Anon Key** → 粘贴 `eyJhbGciOiJIUzI1NiIs...`
3. 点击 **保存并启动**

✅ 配置完成！以后你在手机上提交的复盘数据，电脑上打开就能看到，反之亦然。

---

### 补充：往表里导入初始数据（可选）

想在抖音/小红书热点看到数据，可以往表里手动插入：

1. 点击左侧 **Table Editor** → 选择 `douyin_hot`
2. 点击 **Insert** → **Insert row**
3. 填入数据（参考 js/douyin.js 里的示例格式）
4. 或者用 **SQL Editor** 执行 INSERT 语句批量导入

> 💡 **不配置 Supabase 也能用！** 所有功能都有内置的本地示例数据，直接打开就能体验。

## 📱 三大功能模块

### 1️⃣ 公共英语三级学习 📚

| 功能 | 说明 |
|------|------|
| ✅ 每日任务 | 5项学习任务清单，打卡进度环显示完成率 |
| 📖 单词库 | 80个 PETS-3 核心词汇（音标+中文+例句），支持搜索 |
| 📝 短语库 | 40组高频短语，带用法示例 |
| ✍️ 范文库 | 6篇真题范文（环保/在线学习/职业规划/健康/科技/压力） |

### 2️⃣ 抖音热点 🔥

- 爆款视频列表（含播放量、点赞数）
- 按风格筛选（搞笑/知识/生活/美食/旅行）
- 每条标注 **二创改编建议** 🎯

### 3️⃣ 小红书 · 复盘与灵感 💡

| 子功能 | 说明 |
|--------|------|
| 🔥 热点 | 小红书爆款内容 + 风格筛选 + 改编建议 |
| 📊 复盘 | 记录每次发布内容，AI 自动生成优化建议（标题/文案/互动/表情） |
| 💡 灵感 | 每日灵感推荐，随机切换，持续提供创作灵感 |

## 📁 项目结构

```
workbuddy/
├── index.html          ← 主入口（打开即用）
├── css/
│   └── style.css       ← 暖色学习风样式（移动端适配）
├── js/
│   ├── app.js          ← 主应用（导航/配置/启动）
│   ├── supabase.js     ← Supabase 客户端 & 数据同步
│   ├── english.js      ← 英语三级学习模块
│   ├── douyin.js       ← 抖音热点模块
│   └── xiaohongshu.js  ← 小红书复盘模块
└── data/
    └── english-3.js    ← 英语三级内置数据（词库/短语/范文）
```

## 🔄 数据同步

- 默认使用**本地 localStorage** 存储（打卡记录、复盘记录）
- 配置 Supabase 后自动切换到**云端同步**，手机和电脑数据实时共享
- 各模块数据加载策略：Supabase → 本地示例（fallback）
