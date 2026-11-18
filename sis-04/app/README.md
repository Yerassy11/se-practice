# Smart Campus room availability checker

The Vitest suite runs from `app/`. The Vite/React UI remains in the Week 08 `app/project/` directory; its shared room, filter and booking modules are in `app/src/`.

From `app/`:

```powershell
npm ci
npx vitest run
```

From `app/project/`:

```powershell
npm ci
npm run dev
npm run build
```

Vite prints the local URL for the read-only UI. The catalog and bookings are fictional and held in memory.
