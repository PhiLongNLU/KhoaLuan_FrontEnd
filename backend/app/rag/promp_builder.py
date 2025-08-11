from jinja2 import Template
from app.rag.lang_detector import detect_language

def classify_question_type(question: str) -> str:
    q = question.lower()

    if any(kw in q for kw in ["how", "làm thế nào", "cách", "bằng cách nào"]):
        return "how"
    elif any(kw in q for kw in ["why", "tại sao", "vì sao"]):
        return "why"
    elif any(kw in q for kw in ["what is", "define", "meaning", "definition", "là gì", "định nghĩa", "ý nghĩa"]):
        return "definition"
    elif any(kw in q for kw in ["compare", "difference", "so sánh", "khác biệt", "giống và khác"]):
        return "comparison"
    else:
        return "default"

PROMPT_TEMPLATES = {
    "en": {
        "how":       "Describe the process or method based on the following passage.",
        "why":       "Explain the reason or cause related to the following passage.",
        "definition":"Define or clarify the concept based on the following passage.",
        "comparison":"Compare the aspects mentioned in the following passage.",
        "default":   "Answer the question in detail based on the following passage."
    },
    "vi": {
        "how":       "Hãy mô tả quy trình hoặc cách thực hiện dựa trên đoạn văn sau.",
        "why":       "Hãy giải thích nguyên nhân hoặc lý do liên quan đến đoạn văn sau.",
        "definition":"Hãy định nghĩa hoặc giải thích rõ khái niệm dựa trên đoạn văn sau.",
        "comparison":"Hãy so sánh các khía cạnh trong đoạn văn sau nếu có.",
        "default":   "Hãy trả lời câu hỏi một cách chi tiết dựa trên đoạn văn sau."
    }
}

PROMPT_TEMPLATE = Template(
    """<s>[INST] Please read context on my prompt and generate a human answer according to question. {{ instruction }} Context: {{ context }} Question: {{ question }}  Please answer this question by {{language}}. [/INST]>"""
)

def generate_prompt(question: str, context: str) -> str:
    lang = detect_language(question)
    q_type = classify_question_type(question)

    lang_dict = {
    "vi": "Vietnamese",
    "en": "English",
    "fr": "French",
    "jp": "Japanese",
    }
    
    # if template does not have contained language pack, use "en" as default
    if lang not in PROMPT_TEMPLATES:
        lang = "en"

    instruction = PROMPT_TEMPLATES[lang].get(q_type, PROMPT_TEMPLATES[lang]["default"])

    return PROMPT_TEMPLATE.render(
        instruction=instruction,
        context=context,
        question=question,
        language=lang_dict[lang]
    )