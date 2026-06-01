# Vercel デプロイ（Portal）

本番 `https://miraireach.marketing` の Vercel プロジェクトは、**GitHub の [`akiohjp/miraireach-platform`](https://github.com/akiohjp/miraireach-platform)** を Root Directory なし（リポジトリ直下）でビルドしています。

モノレポ `ai_comany_core` の `Portal/` だけを直しても、**この GitHub に push しない限り本番は変わりません**。

## ヒーロー動画を更新するとき

1. ファイルを `Portal/public/hero/hero-dubai.mp4` に置く（名前は厳守。**1920×1080 推奨**）
2. 必要なら `npm run hero:optimize`（720p などを 1080p に再エンコード）
3. 変更を `miraireach-platform` の `main` に反映する（下記いずれか）
4. Vercel でデプロイ完了を確認
5. 確認 URL: `https://miraireach.marketing/hero/hero-dubai.mp4` が **200** であること

エージェント向け手順は `.claude/skills/portal-production-deploy/SKILL.md` を参照。

## モノレポ → GitHub への反映（例）

```powershell
# 一時クローンに Portal をコピーして push（認証済み Git が必要）
git clone https://github.com/akiohjp/miraireach-platform.git _deploy-miraireach-platform
robocopy Portal _deploy-miraireach-platform /E /XD node_modules .next .vercel /XF .env.local .env
cd _deploy-miraireach-platform
git add public/hero src/components/GamImmersiveLp.tsx
git commit -m "feat: update hero video"
git push origin main
```

Vercel の **Root Directory** を `Portal` にした別プロジェクトを使う場合は、上記リポジトリではなくモノレポ連携の手順に合わせてください。
