# SEOコンサルタント LP

SEOコンサルティングサービスのランディングページとお問い合わせフォームです。

## 構成

- `index.html` - メインHTML（ヒーロー、サービス紹介、特徴、問い合わせフォーム）
- `style.css` - スタイルシート
- `script.js` - フォームバリデーション・送信処理

## ローカルで確認

```bash
cd seo-consultant-site
python3 -m http.server 8080
```

ブラウザで http://localhost:8080 を開いてください。

## 本番運用時のフォーム送信

現在の実装はデモ用で、送信後にモーダルを表示するだけです。本番では以下のいずれかで実際にメール送信を行ってください。

### Formspree を使う場合（簡単・無料枠あり）

1. [Formspree](https://formspree.io/) でアカウント作成
2. フォームの `action` を Formspree のエンドポイントに変更

```html
<form id="inquiry-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

3. `script.js` の送信部分を、通常のフォーム送信（`form.submit()`）または Formspree の API に置き換え

### その他

- お使いの CMS（WordPress、Webflow など）のフォーム機能
- Google Forms を iframe で埋め込む
- 自前のバックエンド API に送信

## カスタマイズ

- **ロゴ・サイト名**: `index.html` の `.logo` を編集
- **色・フォント**: `style.css` の `:root` 変数を変更
- **フォーム項目**: `index.html` のフォームと `script.js` の `requiredFields` を対応させて編集
