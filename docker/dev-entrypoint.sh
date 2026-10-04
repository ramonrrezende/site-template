#!/bin/sh
# Reinstala as dependências quando o package-lock.json muda.
#
# O node_modules mora num volume do Docker, não na pasta do projeto: assim os
# binários de Linux não se misturam com os do host. A contrapartida é que o
# volume não acompanha o lockfile sozinho, e depois de um `git pull` que mexe
# nas dependências ele ficaria desatualizado. O hash gravado na última
# instalação diz se é preciso reinstalar.
set -e

hash="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ "$(cat node_modules/.lock-hash 2>/dev/null)" != "$hash" ]; then
  echo "package-lock.json mudou: reinstalando as dependências..."
  npm ci --no-audit --no-fund
  echo "$hash" > node_modules/.lock-hash
fi

exec "$@"
