FROM public.ecr.aws/docker/library/node:20-alpine
RUN apk add \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    openssl-dev \
    libc6-compat
RUN git clone -b OC-926 --single-branch https://github.com/JiscSD/octopus /app
WORKDIR /app/api
RUN npm i
CMD ["npm", "run", "ariImport", "--", "dryRun=true", "reportFormat=email"]