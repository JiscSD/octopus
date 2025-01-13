# syntax=docker/dockerfile:1.7-labs
FROM public.ecr.aws/docker/library/node:20-alpine

RUN apk add \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    openssl-dev \
    libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i
COPY --exclude=**/node_modules . .
RUN npx prisma generate
CMD ["npm", "run", "ariImport", "--", "dryRun=false", "reportFormat=email"]