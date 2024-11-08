FROM ubuntu:22.04

ARG _ENV_NAME
ARG _DOMAIN
ARG _TIMEZONE
ARG _SERVER_PORT
ARG _PATH_ROOT
ARG _VERSION_TAG

ENV ENV_NAME=${_ENV_NAME}
ENV DOMAIN=${_DOMAIN}
ENV TZ=${_TIMEZONE}
ENV PATH_ROOT=${_PATH_ROOT}
ENV VERSION_TAG=${_VERSION_TAG}

ENV DEBIAN_FRONTEND=noninteractive
ENV DEBCONF_NOWARNINGS=yes
ENV NODE_OPTIONS=--use-openssl-ca
ENV SUDO_FORCE_REMOVE=yes

COPY ./certificate/proxy/ /usr/local/share/ca-certificates/
COPY ./ ${PATH_ROOT}

RUN cd ~ \
    && VERSION_CODENAME=$(grep VERSION_CODENAME= /etc/os-release | cut -d= -f2) \
    && chmod -R 0644 /usr/local/share/ca-certificates/ \
    && apt-get update && apt-get install -y ca-certificates gnupg curl \
    && update-ca-certificates \
    # NodeJs
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
    # No root
    && groupadd -g 1000 node \
    && useradd -d ${PATH_ROOT} -s /bin/bash -u 1000 -g 1000 node \
    && mkdir -p ${PATH_ROOT} /usr/local/lib/node_modules/ /usr/local/bin/ \
    && chown -R node:node ${PATH_ROOT} /usr/local/lib/node_modules/ /usr/local/bin/ \
    && chmod -R 775 ${PATH_ROOT} /usr/local/lib/node_modules/ /usr/local/bin/ \
    # Apt
    && apt-get update && apt-get install -y \
    fonts-noto \
    fonts-noto-cjk \
    libatomic1 \
    libxslt1.1 \
    libwoff1 \
    libevent-2.1-7 \
    libopus0 \
    libharfbuzz-icu0 \
    libopenjp2-7 \
    libwebpdemux2 \
    libenchant-2-2 \
    libsecret-1-0 \
    libhyphen0 \
    libflite1 \
    libegl1 \
    libgudev-1.0-0 \
    libevdev2 \
    libgles2 \
    gstreamer1.0-libav \
    sudo \
    # Sudo
    && echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
    && echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections \
    # Playwright
    && npx playwright install --with-deps chrome \
    && npx playwright install --with-deps msedge \
    # Clean
    && apt-get remove --purge -y sudo \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean -y \
    && apt-get autoclean -y \
    && apt-get autoremove -y

USER node

WORKDIR ${PATH_ROOT}

RUN npm install && npx playwright install && npm run build

CMD node ${PATH_ROOT}dist/controller/Server.js

EXPOSE ${_SERVER_PORT}
