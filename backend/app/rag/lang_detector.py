from langdetect import detect

def detect_language(text: str) -> str:
    lang = detect(text)
    print(f"Detected language: {lang}")
    return lang