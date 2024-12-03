# use node 22 as base image
FROM node:22-bullseye

# set working directory
WORKDIR /usr/src/app

# set ownership and permissions for the /usr/src directory
# TODO: use environment variable for repo path
RUN chown -R node:node /usr/src && chmod 755 /usr/src

# set environment variables
ENV PNPM_HOME=/usr/local/.pnpm-store
ENV PATH=$PNPM_HOME/bin:$PATH

# install pnpm
ENV PNPM_VERSION=9
RUN npm install -g pnpm@${PNPM_VERSION}

# copy pnpm lock files
COPY pnpm-lock.yaml ./

# fetch dependencies
RUN pnpm fetch

# copy source code
COPY . ./

# install dependencies
RUN pnpm install --offline

# build app
RUN pnpm build

# add tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# set port
ENV PORT=3000
EXPOSE ${PORT}

# set user and environment
USER node
ENV NODE_ENV=production

ENTRYPOINT ["/tini", "--"]
CMD [ "/usr/src/app/entrypoint.sh" ]
