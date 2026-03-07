# pic-control-center

Monorepo for PIC-G21 Control Center:

- `apps/control-center`: Next.js App Router dashboard + API routes
- `services/mqtt-worker`: long-running MQTT ingest worker
- `packages/shared`: shared Zod schemas, MQTT topic helpers and control logic
- `infra/supabase/schema.sql`: Supabase schema + RLS + profile trigger
- `firmware/esp32-spot-heater`: ESP32 firmware skeleton

## Architecture

1. Marketing website (separate repo): static hosting on Vercel.
2. Control Center UI + API routes: deploy `apps/control-center` on Vercel.
3. Database/Auth: Supabase Postgres + Auth + RLS.
4. Device communication: MQTT TLS broker (HiveMQ Cloud / EMQX).
5. Streaming ingest: deploy `services/mqtt-worker` on Render/Fly/Railway.

## Prerequisites

- Node.js 20+
- pnpm 9+ (or npm)
- Supabase project
- MQTT broker credentials

## 1) Setup Supabase

1. Open Supabase SQL Editor.
2. Run [`infra/supabase/schema.sql`](./infra/supabase/schema.sql).
3. In Auth settings, allow email/password signup.

The SQL includes:

- tables: `profiles`, `devices`, `device_settings`, `device_pairing_codes`, `device_commands`, `device_telemetry`
- indexes for telemetry and command `msgId`
- RLS policies for user-scoped access
- trigger to auto-create `profiles` from `auth.users`

## 2) Environment variables

Copy `.env.example` and fill values:

```bash
cp .env.example .env
```

For `apps/control-center`, required keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MQTT_BROKER_URL`
- `MQTT_USER`
- `MQTT_PASS`
- `NEXT_PUBLIC_DEMO_MODE` (`true` to run local demo auth/data without real Supabase)

For `services/mqtt-worker`, required keys:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MQTT_BROKER_URL`
- `MQTT_USER`
- `MQTT_PASS`

## 3) Install and run locally

With pnpm (preferred):

```bash
pnpm install
pnpm dev:all
```

With npm workspaces:

```bash
npm install
npm run dev
npm run dev --workspace @pic/mqtt-worker
```

If the UI appears unstyled in local dev (plain HTML), run Control Center in stable mode:

```bash
cd apps/control-center
npm run dev:stable
```

Useful scripts:

- `pnpm dev` (control-center only)
- `pnpm dev:all` (control-center + mqtt-worker)
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`

`@pic/control-center` build runs `next build --no-lint` with `NEXT_IGNORE_INCORRECT_LOCKFILE=1`.
Lint still runs in workspace scripts (`pnpm lint`).

## Main API routes

- `POST /api/pairing/create`
  - Auth required
  - Creates/updates device + pairing code (10 min)
  - Rotates provisioning secret and stores only hash in DB
- `POST /api/device/pair`
  - Device endpoint (no user session)
  - Validates `device_uid + pairing_code + device_secret`
- `POST /api/devices/:id/command`
  - Auth + owner check
  - Computes duty (`computeDutyCycle`) and publishes MQTT command
  - Applies simple low-solar budget limit from last 6h battery samples
- `GET /api/devices/:id/telemetry?range=24h`
  - Auth + owner check
  - Returns telemetry rows

When `NEXT_PUBLIC_DEMO_MODE=true`, auth and API flows run in local demo mode with cookie session + mock data.

## Control algorithm

Shared function: [`packages/shared/src/control.ts`](./packages/shared/src/control.ts)

Core rule:

1. If battery `< minBattV` -> duty `0`, state `LOW_BATT`.
2. If `tInternal <= tSet - tBand` -> duty `maxDuty` (mode-adjusted).
3. If `tInternal >= tSet + tBand` -> duty `0`.
4. Else -> maintenance duty (mode-adjusted).

Modes supported: `ECO`, `NORMAL`, `BOOST`, `AUTO`.

A simple power-budget limiter reduces max duty when recent battery samples indicate low solar input.

## Device pairing and firmware

- Use dashboard **Add device** to generate `pairingCode` + `provisioningSecret`.
- Put values in `firmware/esp32-spot-heater/src/main.cpp`.
- Firmware calls `/api/device/pair` before starting MQTT.
- Firmware publishes telemetry timestamps in epoch milliseconds (NTP synced).

## Deploy

### Vercel (`apps/control-center`)

Set root to `apps/control-center` and add env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MQTT_BROKER_URL`
- `MQTT_USER`
- `MQTT_PASS`

### Worker (`services/mqtt-worker`)

Deploy as long-running service and set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MQTT_BROKER_URL`
- `MQTT_USER`
- `MQTT_PASS`

Start command:

```bash
pnpm --filter @pic/mqtt-worker start
```

## Notes

- Pairing and telemetry ingest use `service_role` on server side.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- `node_modules` is excluded from git.
