
# AGENTS.md

## Purpose
This project provides a read-only room availability check.

## Architecture
- booking.py: validates booking requests and returns a Boolean.
- test_booking.py: tests the booking rules.

## Setup
Requires Python 3.
No third-party runtime dependencies.

## Safe Commands
Run from the project directory:
- py -m unittest -v
- py -m py_compile booking.py

## Coding Conventions
- Follow PEP 8.
- Keep functions simple and readable.
- Preserve the can_book signature.
- Do not add unrelated features.

## Test Expectations
- Run all unit tests after each change.
- Preserve AC1–AC5.
- Add a regression test when fixing a confirmed defect.
- Review the diff before accepting any AI-generated change.

## Forbidden Actions
- Never commit secrets, credentials or personal data.
- Never deploy or publish to production.
- Never run destructive commands or delete project data.
- Never change or install dependencies without human review.
- Never bypass tests to make a change appear successful.
