from __future__ import annotations
import argparse
import importlib.util
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]

CASES = [
    ("T1", 660,720,540,False,[(600,660)],False),
    ("T2", 630,690,540,False,[(600,660)],False),
    ("T3", 660,720,540,True, [(600,660)],False),
    ("T4", 720,840,540,False,[(600,660)],False),
    ("T5", 720,841,540,False,[(600,660)],False),
    ("T6", 540,570,540,False,[(600,660)],False),
    ("T7", 720,660,540,False,[(600,660)],False),
    ("T8", 1380,1440,540,False,[(600,660)],False),
    ("T9", 1380,1441,540,False,[(600,660)],False),
    ("T10",720,780,540,False,[(600,660),(700,760)],False),
    ("T11",660,720,540,False,[(600,660)],True),
]


def load(path):
    spec = importlib.util.spec_from_file_location("booking_" + path.stem, str(path))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.can_book


def observe(fn, case):
    name,start,end,now,blocked,base,twice=case
    bookings = list(base)
    try:
        if twice:
            fn(start,end,now,blocked,bookings)
        result = fn(start,end,now,blocked,bookings)
        actual = "True" if result is True else ("False" if result is False else "Error")
    except Exception:
        actual = "Error"
    mutation = bookings != base
    return actual, mutation


def update(text, observed):
    lines = text.splitlines(keepends=True)
    in_sec5 = False
    count=0
    for i, line in enumerate(lines):
        if line.startswith("## 5."):
            in_sec5 = True
        elif in_sec5 and line.startswith("## 6."):
            in_sec5 = False
        if not in_sec5 or not line.startswith("| T"):
            continue
        m = re.match(r"\|\s*(T(?:1[01]|[1-9]))\s*\|", line)
        if not m:
            continue
        cid = m.group(1)
        cells = [x.strip() for x in line.strip().strip("|").split("|")]
        if len(cells)!=8:
            raise ValueError(f"Unexpected row shape for {cid}: {len(cells)} cells")
        cells[4],cells[5]=observed[cid]
        lines[i]="| " + " | ".join(cells) + " |\n"
        count+=1
    if count!=len(observed):
        raise ValueError(f"Found {count} rows, expected {len(observed)}")
    return "".join(lines)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--write",action="store_true",help="Write only Python columns in section 5")
    options=parser.parse_args()
    orig=BASE/"code/original/booking_v1.py"
    final=BASE/"code/booking.py"
    if not orig.exists():
        sys.exit("Original v1 missing. Import your authentic Week 05 version first.")
    a=load(orig)
    b=load(final)
    results={}
    print("CASE | Python v1 | Python final | mutated v1? | mutated final?")
    print("-----|-----------|--------------|------------|--------------")
    for case in CASES:
        ao, am=observe(a,case)
        bo,bm=observe(b,case)
        results[case[0]]=(ao,bo)
        print(f"{case[0]:<4} | {ao:<9} | {bo:<12} | {str(am):<10} | {bm}")
    if options.write:
        report=BASE/"report.md"
        report.write_text(update(report.read_text(encoding="utf-8"),results),encoding="utf-8")
        print("Updated Python v1 and final columns for T1--T11, leaving page results untouched.")

if __name__=='__main__':
    main()