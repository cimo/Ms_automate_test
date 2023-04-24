FROM node:18.13.0

ARG VERSION_TAG
ARG ENV_NAME
ARG DOMAIN

ARG SERVER_PORT

ENV VERSION_TAG=${VERSION_TAG}
ENV ENV_NAME=${ENV_NAME}
ENV DOMAIN=${DOMAIN}

ENV DEBIAN_FRONTEND=noninteractive
ENV DEBCONF_NOWARNINGS=yes
ENV TZ="Asia/Tokyo"

COPY ./ /home/root/

RUN cd ~ \
    # No root
    && mkdir -p /home/root/ \
    && chown -R node:node /home/root/ /usr/local/lib/node_modules/ /root/.npm/ /usr/local/bin/ \
    && chmod 775 /home/root/ /usr/local/lib/node_modules/ /root/.npm/ /usr/local/bin/ \
    # Apt
    && apt-get update && apt-get install -y \
    ca-certificates \
    # Certificate
    && update-ca-certificates \
    # Chrome - Browser
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmour -o /usr/share/keyrings/google_linux_signing_key.gpg \
    && bash -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google_linux_signing_key.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' \
    && apt-get update && apt-get install -y google-chrome-stable \
    # Chrome - Driver
    && VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE") \
    && wget -q -O /home/root/chromedriver_linux64.zip "https://chromedriver.storage.googleapis.com/${VERSION}/chromedriver_linux64.zip" \
    && unzip /home/root/chromedriver_linux64.zip -d /usr/bin/ \
    && chmod +x /usr/bin/chromedriver \
    && rm /home/root/chromedriver_linux64.zip \
    # Clean
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean -y \
    && apt-get autoclean -y \
    && apt-get autoremove -y

USER node

WORKDIR /home/root/

RUN npm install && npm run build

CMD node /home/root/dist/Controller/Server.js

EXPOSE ${SERVER_PORT}
