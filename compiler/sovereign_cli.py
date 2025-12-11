#!/usr/bin/env python3
import sys
from sovereign_lexer import tokenize
from sovereign_parser import parse
from sovereign_ir import make_ir
from sovereign_validator import validate
from sovereign_optimizer import optimize
from sovereign_codegen import emit_uci
from sovereign_runtime import dispatch

def compile_and_run(source: str, run=False):
    tokens = tokenize(source)
    stmt = parse(tokens)
    ir = make_ir(stmt)
    validate(ir)
    ir_opt = optimize(ir)
    uci = emit_uci(ir_opt)
    print("=== UCI ===")
    print(uci)
    if run:
        print("=== RUNTIME ===")
        out = dispatch(uci)
        print(out)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: sovereign_cli.py '<SOURCE STRING>' [--run]")
        sys.exit(1)
    src = sys.argv[1]
    do_run = "--run" in sys.argv
    compile_and_run(src, run=do_run)
