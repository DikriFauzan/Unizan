# Very small optimizer: collapse no-op args, normalize command names
def optimize(ir: dict) -> dict:
    ir2 = dict(ir)
    # normalize command uppercase
    ir2["command"] = (ir2.get("command") or "").upper()
    # remove empty args
    ir2["args"] = [a for a in ir2.get("args", []) if a]
    return ir2
