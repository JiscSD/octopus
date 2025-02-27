FROM node:20-alpine

RUN apk update

RUN apk add \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    wget \
    openssl \
    openssl-dev \
    libc6-compat

# Dockerize is needed to sync containers startup
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Create and move to app directory
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app

# Only npm install if we're not using act or GH Actions (where we cache)
# ARG RUNNER
# RUN if [ "$RUNNER" = "0" ] ; then npm i; fi
RUN npm i

# Install Dependencies
RUN npm i -g serverless@latest

COPY . /app
RUN ls scripts