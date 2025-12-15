# fe-agency-order-courage

Frontend for Agency order Courage - a minimal RPG-style quest interface.

## Setup

```bash
npm install
```

## Development

Start the frontend dev server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy `/api/*` requests to the backend at `http://localhost:8787` (or the URL specified in `VITE_API_URL`).

**Important:** Make sure the backend is running first:

```bash
cd ../be-agency-order-courage
npm run dev
```

### Environment Variables

- **Development**: Uses Vite proxy by default (no `.env` needed). To use a different backend, create `.env.local` with:
  ```
  VITE_API_URL=http://localhost:8787
  ```

- **Production**: The build uses `VITE_API_URL` from environment or defaults to `https://be-agency-order-courage.williamjonescodes.workers.dev`.

## Build

```bash
npm run build
```

The build will use the production API URL. To override, set `VITE_API_URL` as an environment variable:

```bash
VITE_API_URL=https://your-backend.workers.dev npm run build
```

## Preview

```bash
npm run preview
```
