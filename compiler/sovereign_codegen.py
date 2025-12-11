import json
def emit_uci(ir: dict) -> str:
    # UCI is JSON with schema: { uci: {...}, signature: null }
    uci = {
        "uci": {
            "cmd": ir["command"],
            "args": ir.get("args",[]),
            "meta": ir.get("meta",{})
        },
        "signature": None
    }
    return json.dumps(uci, indent=2, sort_keys=True)
