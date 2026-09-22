"""RSSフィードの疎通確認用スクリプト（メール送信・シート書き込みは行わない）"""
import sys
from pathlib import Path

import feedparser
import yaml

ROOT = Path(__file__).resolve().parent.parent


def main():
    with open(ROOT / "config" / "sources.yaml", encoding="utf-8") as f:
        feeds = yaml.safe_load(f)["feeds"]

    all_ok = True
    for feed in feeds:
        parsed = feedparser.parse(feed["url"])
        count = len(parsed.entries)
        status = "OK" if count > 0 else "NG (0件)"
        print(f"[{status}] {feed['name']} - {count}件 - {feed['url']}")
        if count > 0:
            print(f"    例: {parsed.entries[0].get('title', '')}")
        else:
            all_ok = False
            bozo_reason = getattr(parsed, "bozo_exception", None)
            if bozo_reason:
                print(f"    エラー詳細: {bozo_reason}")

    if not all_ok:
        print("\n0件のフィードがあります。URLが変わっている可能性があるので確認してください。")
        sys.exit(1)


if __name__ == "__main__":
    main()
