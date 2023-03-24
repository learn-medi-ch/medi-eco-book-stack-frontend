FROM node:19-alpine AS build

COPY app /build/medi-eco-book-stack-query-actions/app
RUN chmod +x /build/medi-eco-book-stack-query-actions/app/bin/install-dependencies.sh
RUN chmod +x /build/medi-eco-book-stack-query-actions/app/docker-entrypoint.sh

RUN /build/medi-eco-book-stack-query-actions/app/bin/install-dependencies.sh

FROM node:19-alpine AS medi-eco-book-stack-query-actions

COPY --from=build /build /opt/

RUN chown -R node:node /opt/medi-eco-book-stack-query-actions

USER node:node

EXPOSE 8500

WORKDIR /opt/medi-eco-book-stack-query-actions/app
ENTRYPOINT ["/opt/medi-eco-book-stack-query-actions/app/docker-entrypoint.sh"]
