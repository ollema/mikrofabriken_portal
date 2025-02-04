# ------------------------------------------------------------------------------
# base image
# ------------------------------------------------------------------------------
FROM node:22 AS base
ENV PNPM_HOME="/usr/local/.pnpm-store"
ENV PATH="$PNPM_HOME:$PATH"
# TODO: revert when fixed upstream
# RUN corepack enable
RUN npm install -g pnpm@9.15.5

# ------------------------------------------------------------------------------
# builder image
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /usr/src/app

# copy lock file and fetch dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch

# copy source code and build
COPY . ./
RUN pnpm install --offline
RUN pnpm build

# ------------------------------------------------------------------------------
# production image
# ------------------------------------------------------------------------------
FROM base AS production
WORKDIR /usr/src/app

# set correct ownership and permissions
RUN chown -R node:node /usr/src && chmod 755 /usr/src

# install git-lfs
RUN apt-get update && \
  apt-get install -y git-lfs && \
  git lfs install && \
  rm -rf /var/lib/apt/lists/*

# add tini
ENV TINI_VERSION=v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# copy built assets from builder stage
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/entrypoint.sh ./entrypoint.sh

# set production configs
ENV PORT=3000
EXPOSE ${PORT}
ENV NODE_ENV=production
USER node

ENTRYPOINT ["/tini", "--"]
CMD [ "/usr/src/app/entrypoint.sh" ]
