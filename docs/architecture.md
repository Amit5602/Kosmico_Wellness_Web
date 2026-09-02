# Architecture Overview

## CURRENT (Phase 3 - Foundation)

### Frontend Architecture

- Initialized with Vite + React.
- Uses Tailwind CSS v4, Zustand, and TanStack Query.
- Axios configured for centralized API communication at `/api/v1`.

### Backend MVC Architecture

- **App/Server Split**: `app.js` configures Express (middlewares, routes) while `server.js` starts the HTTP server.
- **MVC Folders**: `models/`, `controllers/`, `routes/`, `services/`, `repositories/`, `middleware/`, `validators/`.
- **Health Check**: Configured `GET /api/v1/health` for orchestrator readiness probes.

### Worker Architecture

- Isolated Node process (`worker.js`) to handle BullMQ jobs.
- Connected via Redis.

### Docker Architecture

- `docker-compose.dev.yml` provisions:
  1. Frontend (Hot-reloading enabled)
  2. Backend (Nodemon enabled)
  3. Worker
  4. MongoDB (Development only)
  5. Redis

## FUTURE (Production & Scaling)

### Service Layer

- Controllers will remain thin. Business logic (e.g., cart calculation, coupon validation) will live strictly inside `/services`.

### Repository Layer

- Complex MongoDB aggregations and direct queries will reside in `/repositories` to decouple business logic from the ODM (Mongoose).

### Redis Architecture

- Redis will store session state (if required), rate limiting counters, and caching for high-read endpoints (e.g., product catalog).

### Future Load-Balancing Architecture

- Edge CDN (Cloudflare/Vercel) will serve frontend assets.
- ALB (Application Load Balancer) will route `/api` traffic across multiple stateless Backend Docker containers.

### Scalability Strategy

- Support 100,000+ users by caching reads via Redis and scaling read-heavy MongoDB operations through Atlas Replica Sets. Offloading synchronous delays via BullMQ.
