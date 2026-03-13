FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Development image
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm db:generate
COPY scripts/docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}
ENTRYPOINT ["entrypoint.sh"]
CMD ["pnpm", "dev"]

# Production build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm db:generate
RUN pnpm build

# Production image
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma ./node_modules/.prisma
COPY scripts/docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}
ENTRYPOINT ["entrypoint.sh"]
CMD ["node", "server.js"]
