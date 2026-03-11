import requests
from requests.structures import CaseInsensitiveDict
from dotenv import load_dotenv
import os

load_dotenv()

def is_valid(email: str):
    url = f"http://easyemailapi.com/api/verify/{email}"

    headers = {"Authorization": f"Bearer {os.getenv("EMAIL_API_TOKEN")}"}
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        valid = data["valid"]

        return valid

    return False