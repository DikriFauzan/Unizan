import json
import hashlib
from typing import Dict, Any

def make_ir(stmt: Dict[str,Any]) -> Dict[str,Any]:
    ir = {
        "command": stmt.get("command"),
        "args": stmt.get("args", []),
        "meta": {},
    }
    # copy known fields
    for k in ("auth","target","identity"):
        if k in stmt:
            ir["meta"][k] = stmt[k]
    # put timestamp-lite and hash
    payload = json.dumps({"command":ir["command"], "args":ir["args"], "meta":ir["meta"]}, sort_keys=True)
    ir["meta"]["hash"] = hashlib.sha256(payload.encode()).hexdigest()
    return ir
