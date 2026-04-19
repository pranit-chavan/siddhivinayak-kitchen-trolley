# Kitchen Trolley Backend

NestJS backend for the Siddhivinayak Kitchen Trolley ERP.

## Included in this first slice

- JWT-based owner/admin login
- first-owner bootstrap endpoint
- Neon-ready Prisma/PostgreSQL schema
- lead capture
- customer master
- project creation and status history
- Swagger docs

## Setup

1. Copy `.env.example` to `.env`
2. Fill in your Neon connection strings and JWT secret

Neon connection guidance:

- `DATABASE_URL` should use the pooled Neon connection string for app traffic.
- `DIRECT_URL` should use the direct Neon connection string for Prisma migrations.
- Keep `sslmode=require` enabled on both URLs.
- Keep `pgbouncer=true` only on the pooled `DATABASE_URL`.
- If your Neon project enforces channel binding, add `channel_binding=require` to `DATABASE_URL`.
3. Install packages:

```bash
npm install
```

4. Generate the Prisma client:

```bash
npm run prisma:generate
```

5. Validate the Prisma schema and environment:

```bash
npm run prisma:validate
```

6. Run your first migration after the database is configured:

```bash
npm run prisma:migrate:dev -- --name init_core_erp
```

For deployment environments, use:

```bash
npm run prisma:migrate:deploy
```

7. Start the API:

```bash
npm run start:dev
```

## First login flow

1. Open Swagger at `http://localhost:4000/docs`
2. Call `POST /api/v1/auth/bootstrap-owner` once
3. Call `POST /api/v1/auth/login`
4. Use the returned bearer token in Swagger for protected routes

## Important note

This machine is currently on Node `20.10.0`, so Prisma is pinned to `6.16.0` for compatibility. Upgrading Node later will let us move Prisma forward cleanly.

## Deployment readiness checks

- `GET /` for base service status
- `GET /api/v1/health/ready` for database readiness
- `GET /docs` for Swagger validation
