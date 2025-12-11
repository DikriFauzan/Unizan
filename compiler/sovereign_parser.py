from typing import List, Tuple, Any
# Very small parser for statements like:
# COMMAND ARG1 ARG2 KEY:LEVEL_2
# Example:
# ACTIVATE MODULE_NEOENGINE TARGET:DEVICE_01 AUTH:LEVEL_3

def parse(tokens: List[Tuple[str,str]]):
    # simplistic: split by IDENT tokens and COLON pairs
    if not tokens:
        return []
    # re-build a simple token string list
    words = [t[1] for t in tokens]
    # join into statements by semicolon or newline not present — assume single-line input
    # we will parse space separated
    i = 0
    stmt = {}
    # first token is command
    cmd = words[0]
    stmt['command'] = cmd
    args = []
    i = 1
    while i < len(words):
        w = words[i]
        if ":" in w:
            # split KEY:VALUE (maybe tokenized as IDENT COLON IDENT)
            if w.count(":") == 1:
                k,v = w.split(":",1)
                stmt[k.lower()] = v
            else:
                # fallback
                parts = w.split(":",1)
                stmt[parts[0].lower()] = parts[1]
            i += 1
            continue
        # handle patterns where tokens were separated: IDENT COLON IDENT
        if i+2 < len(words) and words[i+1] == ":":
            stmt[words[i].lower()] = words[i+2]
            i += 3
            continue
        # normal arg
        args.append(w)
        i += 1
    if args:
        stmt['args'] = args
    return stmt
