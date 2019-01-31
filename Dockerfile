FROM node:10

COPY . /app
WORKDIR /app
RUN bash ./scripts/ci-install.sh && \
    bash ./scripts/build.sh && \
    rm -rf ./packages/red-agate-util && \
    rm -rf ./packages/red-agate-math && \
    rm -rf ./packages/red-agate-svg-canvas && \
    rm -rf ./packages/red-agate && \
    rm -rf ./packages/red-agate-barcode && \
    rm -rf ./packages/red-agate-react-host && \
    rm -rf ./packages/_lib-dist && \
    cd ./packages/_debug_app && \
    rm -rf ./node_modules && \
    npm uninstall puppeteer && \
    npm ci --production && \
    cd ../.. && \
    npm cache clean --force && \
    rm -rf /tmp/*

WORKDIR /app/packages/_debug_app
EXPOSE 3000
ENTRYPOINT [ "node", "dist/app.js", "--express" ]
