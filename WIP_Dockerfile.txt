FROM node:10

RUN ["/bin/bash", "./scripts/ci-install.sh"]
RUN ["/bin/bash", "./scripts/build.sh"]

RUN cd packages/_debug_app

EXPOSE 3000
ENTRYPOINT [ "node", "dist/app.js", "--express" ]
