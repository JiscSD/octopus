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
RUN mkdir /app
# Build context is project root
COPY --exclude=**/node_modules . /app
WORKDIR /app/api
RUN npm i
CMD ["npm", "run", "ariImport", "--", "dryRun=false", "reportFormat=email"]