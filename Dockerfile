# syntax=docker/dockerfile:1

# Manter igual ao .nvmrc, que é de onde o CI lê a versão.
ARG NODE_VERSION=24

# ---- deps: dependências instaladas a partir do lockfile ----------------------
FROM node:${NODE_VERSION}-bookworm-slim AS deps
ENV NEXT_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package.json package-lock.json ./
# O hash diz ao entrypoint de dev que estas dependências batem com o lockfile.
# A pasta .next é criada aqui para que o volume nomeado herde o dono `node`;
# se o Docker a criasse, ela nasceria como root e o Next não conseguiria escrever.
RUN npm ci --no-audit --no-fund \
 && sha256sum package-lock.json | cut -d' ' -f1 > node_modules/.lock-hash \
 && mkdir .next

# ---- dev: servidor de desenvolvimento; o compose monta o código em /app ------
FROM deps AS dev
COPY --chmod=755 docker/dev-entrypoint.sh /usr/local/bin/dev-entrypoint
EXPOSE 3000
ENTRYPOINT ["dev-entrypoint"]
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

# ---- build: export estático em /app/out --------------------------------------
FROM deps AS build
COPY --chown=node:node . .
RUN npm run build

# ---- preview: serve o export do jeito que o S3/CloudFront serve --------------
FROM nginx:alpine AS preview
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
