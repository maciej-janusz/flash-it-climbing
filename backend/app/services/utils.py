import unicodedata
import re

def clean_string(text: str) -> str:
    replacements = {
        'ł': 'l', 'Ł': 'L',
        'ø': 'o', 'Ø': 'O',
        'æ': 'ae', 'Æ': 'AE',
        'ß': 'ss'
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)

    # ą, ć, ę, ś, ż, ź, ń, ó
    nfkd_form = unicodedata.normalize('NFKD', text)
    text = "".join([c for c in nfkd_form if not unicodedata.combining(c)])

    return " ".join(text.split()).lower()