FROM node:10



# Build and deploy the app.
COPY . /build
WORKDIR /build
RUN bash ./scripts/ci-install.sh \
    && bash ./scripts/build.sh \
    && mv ./packages/_debug_app /app \
    && cd /app \
    && rm -rf ./node_modules \
    && npm uninstall puppeteer \
    && npm ci --production \
    && rm -rf /build \
    && npm cache clean --force \
    && rm -rf /tmp/*



# Add user.
RUN groupadd -r appuser \
    && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app

# Run everything after as non-privileged user.
USER appuser

WORKDIR /app
EXPOSE 3000
ENTRYPOINT [ "node" ]
CMD [ "dist/app.js", "--express" ]
