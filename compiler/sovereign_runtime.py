# Minimal runtime: only simulates dispatch (no external calls)
import json
def dispatch(uci_json: str):
    uci = json.loads(uci_json)
    cmd = uci["uci"]["cmd"]
    meta = uci["uci"]["meta"]
    # owner bypass simulation
    if meta.get("auth") == "OWNER":
        return {"status":"ok","result":"owner bypass executed"}
    # simple demo behaviors
    if cmd == "ACTIVATE":
        return {"status":"ok","result":f"Activated {' '.join(uci['uci']['args'])}"}
    if cmd == "DEACTIVATE":
        return {"status":"ok","result":f"Deactivated {' '.join(uci['uci']['args'])}"}
    return {"status":"error","error":"unknown command"}
