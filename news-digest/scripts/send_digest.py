"""経済ニュースダイジェストの取得・要約・配信・記録を行うメインスクリプト"""
import json
import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

import yaml

from fetch_news import fetch_all_articles
from sheet_logger import log_articles_to_sheet
from summarize import summarize_for_students

ROOT = Path(__file__).resolve().parent.parent
STATE_PATH = ROOT / "state" / "sent_log.json"
MAX_STATE_PER_RECIPIENT = 500


def load_yaml(path):
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_state():
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {}


def save_state(state):
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def matches_theme(article, themes):
    if not themes:
        return True
    text = f"{article['title']} {article['summary']}".lower()
    return any(theme.lower() in text for theme in themes)


def build_email_html(articles):
    rows = []
    for a in articles:
        rows.append(
            f"""
            <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #e5e5e5;">
              <div style="font-size:16px;font-weight:bold;margin-bottom:6px;color:#111;">{a['title']}</div>
              <div style="font-size:12px;color:#777;margin-bottom:8px;">出典: {a['source']}</div>
              <div style="font-size:14px;line-height:1.7;margin-bottom:8px;color:#333;">{a['student_summary']}</div>
              <a href="{a['link']}" style="font-size:13px;color:#1a73e8;text-decoration:none;">本文を読む →</a>
            </div>
            """
        )
    return f"""
    <html><body style="font-family:'Hiragino Sans','Yu Gothic',sans-serif;max-width:600px;margin:0 auto;color:#222;">
      <h2 style="font-size:20px;">今日の経済ニュースダイジェスト</h2>
      {''.join(rows)}
      <p style="font-size:12px;color:#999;">気になった記事があれば、感想・学び・疑問をスプレッドシートのC列に書き込んでおきましょう。</p>
    </body></html>
    """


def send_email(sender, app_password, to_email, subject, html_body):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender, app_password)
        server.sendmail(sender, [to_email], msg.as_string())


def main():
    sources = load_yaml(ROOT / "config" / "sources.yaml")["feeds"]
    recipients = load_yaml(ROOT / "config" / "recipients.yaml")["recipients"]
    settings = load_yaml(ROOT / "config" / "settings.yaml")

    gmail_address = os.environ["GMAIL_ADDRESS"]
    gmail_app_password = os.environ["GMAIL_APP_PASSWORD"]
    spreadsheet_id = settings.get("spreadsheet_id")
    summary_model = settings.get("summary_model", "claude-haiku-4-5-20251001")

    all_articles = fetch_all_articles(sources)
    state = load_state()
    sheet_rows = []

    for recipient in recipients:
        email_addr = recipient["email"]
        themes = recipient.get("themes", [])
        max_articles = recipient.get("max_articles", 5)
        sent_links = set(state.get(email_addr, []))

        candidates = [
            a for a in all_articles
            if a["link"] not in sent_links and matches_theme(a, themes)
        ][:max_articles]

        if not candidates:
            print(f"[{email_addr}] 新着の該当記事なし")
            continue

        for a in candidates:
            a["student_summary"] = summarize_for_students(a["title"], a["summary"], model=summary_model)

        html = build_email_html(candidates)
        send_email(gmail_address, gmail_app_password, email_addr, "【経済ニュースダイジェスト】今日の注目記事", html)
        print(f"[{email_addr}] {len(candidates)}件送信")

        sent_links.update(a["link"] for a in candidates)
        state[email_addr] = list(sent_links)[-MAX_STATE_PER_RECIPIENT:]
        sheet_rows.extend(candidates)

    save_state(state)

    if spreadsheet_id and sheet_rows:
        log_articles_to_sheet(spreadsheet_id, sheet_rows)


if __name__ == "__main__":
    main()
