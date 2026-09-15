# 経済ニュースダイジェスト自動配信

大学生向けに経済ニュースを要約し、テーマ別に**毎日9:00と16:00（日本時間）**にGmailへ自動配信する仕組みです。送信した記事は指定のGoogleスプレッドシートに自動で記録され、感想・学び・疑問を書き込めるようにしてあります。

## なぜ日経新聞そのものではないのか

[日経電子版の著作権ページ](https://www.nikkei.com/info/copyright.html) では、有料・無料記事を問わず、スクレイピング・クローリング・ボット等の自動的な手段による日経コンテンツの取得・収集を明示的に禁止しています。また `www.nikkei.com` 本体は公式RSSも提供していません（英語版の Nikkei Asia にはRSSがありますが、個人の非商用の閲覧目的限定・転載禁止という利用条件です）。

そのため、この仕組みでは **公式に無料RSSを提供している経済ニュース源**（NHK NEWS WEB、Yahoo!ニュースなど）を情報源として使用しています。`config/sources.yaml` にRSSのURLを追加すれば、他の経済ニュース源も自由に追加できます。もし日経電子版を契約していて日経の記事を対象にしたい場合は、日経が提供する法人向けAPI／記事利用サービス（[reprint.nikkei.co.jp](https://reprint.nikkei.co.jp/copyright.html)）経由での正規契約が必要です。

## 仕組みの概要

1. `config/sources.yaml` に登録したRSSフィードから最新記事を取得
2. `config/recipients.yaml` で指定した宛先ごとに、テーマ（キーワード）に合う記事だけを抽出
3. （`ANTHROPIC_API_KEY` を設定していれば）Claude APIで大学生向けにやさしく要約
4. HTMLメールを作成し、Gmail経由で該当の宛先に送信（記事本文には各ニュース源の元記事へのリンクから飛べる）
5. 送信した記事の「見出し」「リンク」をGoogleスプレッドシートに追記（感想欄は空欄のまま、自分で記入する）
6. 一度送った記事は `state/sent_log.json` に記録し、重複配信を防止

## 必要な準備（GitHub Secretsの登録）

リポジトリの `Settings > Secrets and variables > Actions` から以下を登録してください。

| Secret名 | 必須 | 内容 |
|---|---|---|
| `GMAIL_ADDRESS` | ✅ | 送信元・自分のGmailアドレス（例: `hengshanharuki08@gmail.com`） |
| `GMAIL_APP_PASSWORD` | ✅ | Gmailの「アプリパスワード」（16桁）。下記手順で発行 |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | ✅ | スプレッドシート書き込み用のサービスアカウント鍵（JSON全文をそのまま貼り付け） |
| `ANTHROPIC_API_KEY` | 任意 | 設定するとClaudeが記事をやさしく要約。未設定の場合はRSSの概要文をそのまま使用 |

### 1. Gmailアプリパスワードの発行手順

1. 配信に使うGoogleアカウントで [Googleアカウントのセキュリティ設定](https://myaccount.google.com/security) を開く
2. 「2段階認証プロセス」を有効にする（未設定の場合は先に設定）
3. 検索窓で「アプリ パスワード」を検索 → アプリ名を適当に入力（例: `news-digest`）して生成
4. 表示された16桁のパスワードを `GMAIL_APP_PASSWORD` としてSecretsに登録

### 2. Googleスプレッドシート書き込み用サービスアカウントの作成手順

1. [Google Cloud Console](https://console.cloud.google.com/) で新規プロジェクトを作成（または既存のものを使用）
2. 「APIとサービス」→「ライブラリ」から **Google Sheets API** を有効化
3. 「APIとサービス」→「認証情報」→「認証情報を作成」→「サービスアカウント」で作成
4. 作成したサービスアカウントの「鍵」タブから鍵を追加（JSON形式）→ ダウンロードされたJSONファイルの中身をそのまま `GOOGLE_SERVICE_ACCOUNT_JSON` としてSecretsに登録
5. JSON内の `client_email`（例: `xxxx@yyyy.iam.gserviceaccount.com`）をコピーし、[対象のスプレッドシート](https://docs.google.com/spreadsheets/d/1nek8cFJzcnYnwdg0J1egZLJmGJXh2Jh6OhSrQ214QbI/edit) の共有設定から**編集者として追加**する

### 3. Anthropic APIキー（任意・推奨）

[console.anthropic.com](https://console.anthropic.com/) でAPIキーを発行し、`ANTHROPIC_API_KEY` として登録すると、記事が大学生向けにやさしく要約されます。未設定でも動作しますが、その場合はRSSの元の概要文がそのままメールに載ります。

## 配信先とテーマの変更方法（自由に編集可能）

`config/recipients.yaml` を編集するだけで、配信先メールアドレスとテーマを自由に追加・変更できます。

```yaml
recipients:
  - email: "hengshanharuki08@gmail.com"
    themes:
      - "金融"
      - "スタートアップ"
      - "就職"
      - "為替"
    max_articles: 5

  # 例: 友達を追加したい場合
  # - email: "friend@gmail.com"
  #   themes:
  #     - "AI"
  #     - "半導体"
  #   max_articles: 3
```

- `themes` に書いたキーワードが記事のタイトルか概要に1つでも含まれていれば配信対象になります
- `themes` を空（`[]`）にすると、テーマ関係なく最新記事から配信されます
- `max_articles` は1回の配信で届ける記事数の上限です

## ニュース源の変更方法

`config/sources.yaml` にRSSのURLを追加・削除することで情報源を自由に変更できます（公式RSSを提供しているニュース源のみを追加してください）。

## スプレッドシートの記録について

配信された記事は自動で以下のようにスプレッドシートへ追記されます。

| 列 | 内容 | 記入者 |
|---|---|---|
| A列 | ニュース記事の見出し | 自動 |
| B列 | 記事へのリンク | 自動 |
| C列 | 自分のコメント・感想・学び・疑問 | 手動（自分で記入） |

## 実行タイミング

`.github/workflows/news-digest.yml` に以下のcronを設定しています（GitHub Actionsのcronは協定世界時UTC基準）。

- `0 0 * * *` → 日本時間 9:00
- `0 7 * * *` → 日本時間 16:00

**注意:** GitHub Actionsのスケジュール実行は、そのリポジトリの**デフォルトブランチ**（通常 `main`）にワークフローファイルが存在する場合のみ有効になります。このブランチをmainにマージするまでは自動実行されません。動作確認したい場合はGitHubの「Actions」タブから対象のワークフローを選び、「Run workflow」で手動実行できます。

## 構成ファイル

```
news-digest/
├── README.md
├── requirements.txt
├── config/
│   ├── sources.yaml       # RSSフィード一覧
│   └── recipients.yaml    # 配信先メールアドレスとテーマ
├── scripts/
│   ├── fetch_news.py      # RSS取得
│   ├── summarize.py       # Claudeによる大学生向け要約
│   ├── sheet_logger.py    # スプレッドシートへの記録
│   └── send_digest.py     # 全体の実行スクリプト（メイン）
└── state/
    └── sent_log.json       # 送信済み記事の記録（重複配信防止・自動更新）
```

## ローカルでのテスト実行

```bash
cd news-digest
pip install -r requirements.txt
export GMAIL_ADDRESS="hengshanharuki08@gmail.com"
export GMAIL_APP_PASSWORD="xxxxxxxxxxxxxxxx"
export GOOGLE_SERVICE_ACCOUNT_JSON="$(cat service_account.json)"
export ANTHROPIC_API_KEY="sk-ant-..."   # 任意
python scripts/send_digest.py
```
