import re
TOKENS = [
    ("NUMBER", r"\d+"),
    ("IDENT", r"[A-Z_][A-Z0-9_]*"),
    ("STRING", r"\"(.*?)\""),
    ("LPAREN", r"\("),
    ("RPAREN", r"\)"),
    ("COMMA", r","),
    ("COLON", r":"),
    ("NEWLINE", r"\n"),
    ("SPACE", r"[ \t]+"),
]

token_regex = "|".join("(?P<%s>%s)" % pair for pair in TOKENS)

def tokenize(source: str):
    pos = 0
    tokens = []
    for m in re.finditer(token_regex, source):
        kind = m.lastgroup
        value = m.group(0)
        if kind == "SPACE" or kind == "NEWLINE":
            continue
        if kind == "STRING":
            value = m.group(1)
        tokens.append((kind, value))
        pos = m.end()
    return tokens
