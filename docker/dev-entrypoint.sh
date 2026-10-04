#!/bin/sh
# Reinstala as dependências quando o package-lock.json muda.
#
# O node_modules mora num volume do Docker, não na pasta do projeto: assim os
# binários de Linux não se misturam com os do host. A contrapartida é que o
# volume não acompanha o lockfile sozinho, e depois de um `git pull` que mexe
# nas dependências ele ficaria desatualizado. O hash gravado na última
# instalação diz se é preciso reinstalar.
#
# Projeto recém-criado do template ainda não tem lockfile: ele é gerado na
# pasta do projeto, para ser commitado (CI e deploy usam npm ci), e o npm ci
# abaixo instala a partir dele. A geração roda numa pasta sem node_modules
# para resolver tudo no registry: a partir do node_modules do volume, o npm
# montaria o lockfile sem `integrity` e o npm ci deixaria de conferir o hash
# dos pacotes.
set -e

if [ ! -f package-lock.json ]; then
  echo "Sem package-lock.json: gerando um novo (commite-o)..."
  tmp="$(mktemp -d)"
  cp package.json "$tmp/"
  if [ -f .npmrc ]; then cp .npmrc "$tmp/"; fi
  (cd "$tmp" && npm install --package-lock-only --no-audit --no-fund)
  cp "$tmp/package-lock.json" .
  rm -rf "$tmp"
fi

hash="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ "$(cat node_modules/.lock-hash 2>/dev/null)" != "$hash" ]; then
  echo "package-lock.json mudou: reinstalando as dependências..."
  npm ci --no-audit --no-fund
  echo "$hash" > node_modules/.lock-hash
fi

exec "$@"
