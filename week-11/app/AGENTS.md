# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use exactly one fictional room with fictional bookings; do not use real names or timetables.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps; allow bookings that only touch at endpoints.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile.

## Commands

- Install: from `app/` run `npm install` and `npm --prefix project install`; run dev/build there and tests from `app/project/`.
- Dev server: `npm --prefix project run dev`
- Tests: `npx vitest run`
- Build: `npm --prefix project run build`

## You may

- Edit any file in the project.
- Add packages when a task needs them.
- Do not add login, databases, persistence, secrets, credentials, personal data, or external services.

## Before you finish

- Make sure the page still loads.
- Run and report tests before proposing acceptance; disclose failures or unavailable checks.
- Do not deploy or publish externally; require human approval before release.
