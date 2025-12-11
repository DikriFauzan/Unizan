# Minimal validator: checks presence of auth and allowed authority levels
ALLOWED_LEVELS = {"LEVEL_0","LEVEL_1","LEVEL_2","LEVEL_3","OWNER"}

def validate(ir: dict):
    meta = ir.get("meta",{})
    auth = meta.get("auth")
    if not auth:
        raise ValueError("Missing auth in IR (use AUTH:LEVEL_X)")
    if auth not in ALLOWED_LEVELS:
        raise ValueError(f"Unknown auth level: {auth}")
    # additional domain checks (dalil/hadith) require research/integration (butuh riset lanjutan)
    return True
