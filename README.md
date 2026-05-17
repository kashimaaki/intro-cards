# 🎴 自己紹介カード DB

写真付き自己紹介カードの管理Webアプリ。  
200名規模対応。早稲田タグ・パート・役職フィルタ搭載。

## スタック

- **Frontend**: React + Vite
- **DB + 写真Storage**: Supabase（無料枠で充分）
- **Hosting**: GitHub Pages（自動デプロイ）

---

## セットアップ手順

### 1. Supabase プロジェクト作成

1. https://supabase.com にアクセス → 新しいプロジェクト作成
2. **SQL Editor** を開いて `supabase-setup.sql` の内容を貼り付けて実行
3. **Storage** → **New Bucket** → 名前: `photos`、Public: ON にする
4. Storage のポリシーSQL（setup.sql 下部）も実行

### 2. 環境変数の取得

Supabase Dashboard → Project Settings → API より:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon / public` Key → `VITE_SUPABASE_ANON_KEY`

### 3. ローカル開発

```bash
git clone https://github.com/<あなたのID>/intro-cards
cd intro-cards
npm install
cp .env.example .env
# .env を編集して VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を入力
npm run dev
```

### 4. GitHub にプッシュ

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/<あなたのID>/intro-cards.git
git push -u origin main
```

### 5. GitHub Secrets の設定

GitHub リポジトリ → **Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | SupabaseのProject URL |
| `VITE_SUPABASE_ANON_KEY` | Supabaseのanon key |

### 6. GitHub Pages の有効化

**Settings → Pages → Build and deployment**  
- Source: **Deploy from a branch**  
- Branch: **gh-pages** / root

→ `https://<あなたのID>.github.io/intro-cards/` でアクセス可能になります！

### 7. vite.config.js のリポジトリ名確認

```js
const REPO_NAME = 'intro-cards'  // ← GitHubリポジトリ名と一致させる
```

---

## 機能

| 機能 | 説明 |
|------|------|
| 写真アップロード | フォームで選択 → Supabase Storageに自動保存 |
| 早稲田タグ | 大学欄に「早稲田」と入力で自動ON / 手動トグルも可 |
| 検索 | 名前・大学名で即時フィルタ |
| パートフィルタ | 楽器パート別に絞り込み |
| 役職フィルタ | 役職別に絞り込み |
| 性別フィルタ | 性別で絞り込み |
| 編集・削除 | 各カードから随時更新可能 |

---

## カスタマイズ

`src/components/constants.js` でパート・役職のリストを変更できます。
