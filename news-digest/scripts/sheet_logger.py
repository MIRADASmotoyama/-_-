"""送信した記事をGoogleスプレッドシートに記録する"""
import base64
import json
import os

import gspread
from google.oauth2.service_account import Credentials

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


def _get_client():
    raw = os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"]
    try:
        info = json.loads(raw)
    except json.JSONDecodeError:
        info = json.loads(base64.b64decode(raw))
    creds = Credentials.from_service_account_info(info, scopes=SCOPES)
    return gspread.authorize(creds)


def log_articles_to_sheet(spreadsheet_id, articles):
    client = _get_client()
    sheet = client.open_by_key(spreadsheet_id).sheet1
    rows = [[a["title"], a["link"], ""] for a in articles]
    sheet.append_rows(rows, value_input_option="USER_ENTERED")
