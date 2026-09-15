"""RSSフィードから記事一覧を取得する"""
import feedparser


def fetch_all_articles(feeds):
    articles = []
    seen_links = set()

    for feed in feeds:
        parsed = feedparser.parse(feed["url"])
        for entry in parsed.entries:
            link = entry.get("link", "").strip()
            if not link or link in seen_links:
                continue
            seen_links.add(link)

            summary = (entry.get("summary") or entry.get("description") or "").strip()
            articles.append(
                {
                    "title": entry.get("title", "").strip(),
                    "link": link,
                    "summary": summary,
                    "source": feed["name"],
                    "published": entry.get("published", ""),
                }
            )

    return articles
