
from __future__ import annotations
import argparse
import io
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SIS = ROOT / "sis-03"


def git_archive(ref: str, *paths: str) -> zipfile.ZipFile:
    result = subprocess.run(["git", "archive", "--format=zip", ref, *paths], cwd=ROOT, capture_output=True)
    if result.returncode:
        raise RuntimeError(f"Cannot read {ref} ({result.stderr.decode(errors='replace').strip()}).\n"
                           f"Check `git fetch origin` and `git ls-tree -r --name-only {ref}`.")
    return zipfile.ZipFile(io.BytesIO(result.stdout))


def put_file(data: bytes, target: Path) -> None:
    if target.exists() and target.stat().st_size:
        raise RuntimeError(f"Refusing to overwrite: {target} (inspect it or move it yourself).")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print("COPIED", target.relative_to(ROOT))


def put_tree(archive: zipfile.ZipFile, source: str, target: Path) -> None:
    prefix = source.rstrip("/") + "/"
    found = 0
    for name in archive.namelist():
        if not name.startswith(prefix) or name.endswith("/"):
            continue
        rel = Path(name[len(prefix):])
        if any(p in ("node_modules", ".git", "__pycache__") for p in rel.parts) or rel.name.startswith(".env"):
            continue
        dest = target / rel
        if dest.name == ".gitkeep":
            continue
        put_file(archive.read(name), dest)
        found += 1
    if not found:
        raise RuntimeError(f"Archive contains no source files under {prefix}")


def copy_single(archive: zipfile.ZipFile, origin: str, dest: Path) -> None:
    try:
        put_file(archive.read(origin), dest)
    except KeyError:
        raise RuntimeError(f"Missing in branch: {origin}. Find exact file using git ls-tree -r.")


def main():
    parser = argparse.ArgumentParser(description="Bring the ORIGINAL Week 05/06 exports into SIS-03")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--v1", action="store_true", help="Import original v1 before the v1 commit")
    group.add_argument("--final", action="store_true", help="Import Week 06 final after v1 was committed")
    opts = parser.parse_args()
    if not (ROOT / ".git").exists():
        # .git can also be a worktree file.
        proc = subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=ROOT, capture_output=True)
        if proc.returncode:
            raise RuntimeError(f"Run this from inside a real Git repository: {ROOT}")
    branch = subprocess.run(["git", "branch", "--show-current"], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    if branch != "sis-03":
        raise RuntimeError(f"Expected branch sis-03, found {branch!r}; do not commit to main.")
    if opts.v1:
        with git_archive("origin/week-05", "week-05/code/original/booking_v1.py") as z:
            copy_single(z, "week-05/code/original/booking_v1.py", SIS / "code/original/booking_v1.py")
        with git_archive("origin/week-06", "week-06/original", "week-06/evidence/v1.png") as z:
            put_tree(z, "week-06/original", SIS / "web/original")
            copy_single(z, "week-06/evidence/v1.png", SIS / "evidence/web-v1.png")
        print("Done: FIRST VERSIONS imported unchanged. Inspect and commit BEFORE a new repair.")
    else:
        with git_archive("origin/week-06", "week-06/prototype") as z:
            put_tree(z, "week-06/prototype", SIS / "web/final")
        print("Done: Week 06 final imported. New SIS-03 repair, retest and export may follow.")


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print("ERROR:", exc, file=sys.stderr)
        sys.exit(1)
