# ASOIU Conference Portal Frontend

## Deployment

### Option 1: Standalone Next.js
You can run the app directly using Node.js. In this mode, Next.js handles proxying `/api` requests to the backend.

1. Setup environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and set API_PROXY_TARGET=http://<backend-ip>:8080
   ```
2. Build and run:
   ```bash
   pnpm install
   pnpm build
   pnpm start
   ```

### Option 2: Docker + Nginx (Recommended)
This approach is highly optimized.

1. Build the Docker image:
   ```bash
   docker build -t frontend-app .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env frontend-app
   ```
3. Use the provided `nginx.conf` in your reverse proxy to route traffic between this frontend and your Spring Boot backend.
