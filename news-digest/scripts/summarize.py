"""記事タイトル・概要を大学生向けにやさしく要約する"""
import os


def summarize_for_students(title, snippet, model="claude-haiku-4-5-20251001"):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return snippet or "(概要は元記事でご確認ください)"

    from anthropic import Anthropic

    client = Anthropic(api_key=api_key)

    prompt = (
        "以下の経済ニュースを、経済の予備知識があまりない大学生向けに、"
        "3行以内・150字程度の日本語で要約してください。"
        "専門用語が出てくる場合は簡単な補足を添えてください。"
        "記事にない情報を付け足さず、事実を正確に伝えてください。\n\n"
        f"タイトル: {title}\n概要: {snippet}"
    )

    response = client.messages.create(
        model=model,
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text.strip()
