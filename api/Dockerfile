FROM node:14-slim

RUN apt-get update

RUN apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    wget

# Dockerize is needed to sync containers startup
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Create a dummy set of credentials and config for test
RUN mkdir /root/.aws && echo '[octopus-docker]\naws_access_key_id=setkey\naws_secret_access_key=asecret' >/root/.aws/credentials && echo '[profile octopus-docker]\nregion=eu-west-1' >/root/.aws/config

# Create and move to app directory
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app

# Only npm install if we're not using act or GH Actions (where we cache)
# ARG RUNNER
# RUN if [ "$RUNNER" = "0" ] ; then npm i; fi
RUN npm i

# Install Dependencies
RUN npm i -g serverless@latest

COPY . /app