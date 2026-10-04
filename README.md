# site-template

Template base para sites estáticos em Next.js: export estático servido pelo
S3 + CloudFront, ambiente de desenvolvimento em Docker e nenhuma biblioteca
de UI. Cada projeto escolhe a sua.

Vem cru: uma única página provisória que só confirma que o ambiente está
rodando. Todo o conteúdo é do projeto que nasce daqui.

## O que vem pronto

- **Fonte única de dados** em `src/config/site.ts`: metadados, JSON-LD,
  robots, sitemap, `llms.txt` e o texto visível saem do mesmo lugar.
- **SEO**: metadata com Open Graph e Twitter, canonical por página, JSON-LD
  da organização, `robots.txt` com os bots separados por categoria e
  `sitemap.xml` com `lastmod` fixo.
- **`llms.txt` gerado no build** a partir do config, sem cópia manual para
  manter em dia.
- **Google Analytics e Ads opcionais**: sem IDs no config, nada é carregado.
- **Estilo sem dependências**: CSS Modules + tokens em variáveis CSS no
  `src/app/globals.css`.
- **Docker** para desenvolvimento e para o preview da build de produção.
- **GitHub Actions**: CI (lint, typecheck, build) em pull request e deploy no
  S3 + CloudFront via OIDC no push em `master`.

## Começar um projeto novo

No GitHub, use **Use this template**. Ou, localmente:

```bash
git clone --depth 1 <url-deste-repo> meu-site
cd meu-site && rm -rf .git && git init -b master
```

Troque o `name` no `package.json` pelo nome do projeto.

## Rodar

O único requisito é Docker com Compose (Docker Desktop no macOS e no Windows).
Node não precisa estar instalado.

```bash
docker compose up                       # http://localhost:3000, com hot reload
```

Todo comando npm roda dentro do container. Como o código é montado do host,
mudanças em `package.json` e `package-lock.json` aparecem na sua pasta:

```bash
docker compose run --rm web npm install <pacote>
docker compose run --rm web npm run lint
docker compose run --rm web npm run typecheck
docker compose run --rm web npm run build    # gera out/
```

Preview da build de produção, servida por nginx como o S3 serviria:

```bash
docker compose --profile preview up --build preview   # http://localhost:8080
```

Para trocar as portas, por exemplo para rodar dois projetos ao mesmo tempo,
copie `.env.example` para `.env` e ajuste `PORT` e `PREVIEW_PORT`.

### Como o Docker está montado

- `node_modules` e `.next` ficam em volumes do Docker, não na pasta do
  projeto, então os binários de Linux não se misturam com os do host. O Docker
  cria essas duas pastas vazias no host como pontos de montagem; podem ser
  ignoradas (estão no `.gitignore`).
- Ao subir, o container compara o hash do `package-lock.json` com o da última
  instalação e roda `npm ci` só se ele mudou, por exemplo depois de um
  `git pull` que mexeu nas dependências.
- O container roda como o usuário `node` (uid 1000), que coincide com o
  usuário padrão da maioria das instalações Linux. Assim, os arquivos criados
  pelo container na sua pasta ficam com o seu usuário.

### Windows

Clone o repositório **dentro do WSL2** (por exemplo em `~/projetos`, não em
`/mnt/c/...`). Com o código no disco do Windows, as mudanças de arquivo não
chegam ao container e o hot reload para de funcionar; o Turbopack, padrão no
Next 16, ignora `WATCHPACK_POLLING`. Se não der para usar o WSL2, rode o dev
com webpack e polling: `next dev --webpack` com `WATCHPACK_POLLING=true` no
ambiente do serviço `web`.

## Personalizar

1. `src/config/site.ts`: URL, nome, descrição, contato, endereço, tipo
   schema.org e IDs do Google. Atualize `ultimaAtualizacaoConteudo` sempre
   que mudar algo que o visitante vê.
2. `src/app/page.tsx`: a página provisória. Substitua pelo conteúdo do
   projeto.
3. `src/app/globals.css`: cores, medidas e raios nos tokens do `:root`.
4. `src/app/layout.tsx`: a fonte (qualquer uma do `next/font/google`) e o
   que se repete em todas as páginas, como cabeçalho e rodapé.
5. `src/app/icon.svg`: o ícone da aba.
6. `src/app/opengraph-image.png` (1200×630): crie para ter imagem na prévia
   do link no WhatsApp e nas redes. O Next detecta o arquivo sozinho.
7. `src/app/robots.ts`: por padrão, os coletores de treinamento de IA são
   bloqueados. É uma escolha por projeto.
8. Imagens vão em `public/` (crie a pasta). O export estático não otimiza
   imagens, então otimize antes de colocá-las lá.
9. Página nova: crie `src/app/<rota>/page.tsx`, declare o
   `alternates.canonical` dela e acrescente a rota em `src/app/sitemap.ts`.
10. Texto que aparece em mais de um lugar (FAQ, serviços, preços) mora num
    módulo próprio, por exemplo `src/content/`, e é importado pela página, pelo
    JSON-LD e pelo `llms.txt`, nunca copiado.

## Estrutura

```
src/
├─ config/site.ts           dados do site (fonte única)
├─ lib/                     JSON-LD
├─ components/              JsonLd e Analytics; componentes do projeto entram aqui
└─ app/                     rotas, layout, estilos globais, robots, sitemap, llms.txt
docker/                     entrypoint do dev e nginx do preview
```

## Adicionar uma biblioteca de UI

Como não há reset nem tema de terceiros, qualquer biblioteca entra sem
conflito. Mapeie os tokens do `globals.css` para o tema dela, em vez de
duplicar valores.

- **Tailwind (+ shadcn/ui)**:
  `docker compose run --rm web npm install tailwindcss @tailwindcss/postcss`,
  crie o `postcss.config.mjs` com o plugin `@tailwindcss/postcss` e adicione
  `@import "tailwindcss";` no topo do `globals.css`.
- **Bibliotecas com CSS-in-JS** (MUI, Chakra...): siga o guia de App Router
  da biblioteca, que costuma pedir um provider no `layout.tsx`.

## Deploy (S3 + CloudFront)

O workflow `.github/workflows/deploy.yml` roda a cada push em `master`. Ele
é pulado enquanto `AWS_ROLE_ARN` não estiver configurada. Para ativar:

1. Na AWS, crie uma role que confie no provedor OIDC do GitHub (restrita a
   este repositório) e permita `s3:ListBucket`, `s3:PutObject` e
   `s3:DeleteObject` no bucket, e `cloudfront:CreateInvalidation` nas
   distribuições.
2. No GitHub, em *Settings → Secrets and variables → Actions → Variables*,
   crie `AWS_ROLE_ARN`, `S3_BUCKET` e `CLOUDFRONT_DISTRIBUTION_ID`. São
   opcionais `AWS_REGION` (padrão `us-east-1`) e
   `CLOUDFRONT_REDIRECT_DISTRIBUTION_ID`.

O export usa `trailingSlash: true`, que gera `rota/index.html`. O endpoint de
site do S3 resolve isso sozinho. Se o CloudFront usar o bucket como origem
REST (com OAC), ele não acrescenta o `index.html` em subpastas, e é preciso
uma CloudFront Function para isso. Para um site de página única, nada muda.

Os arquivos de `_next/static` (com hash no nome) vão com cache de um ano; o
resto, com revalidação a cada visita.

## Notas de manutenção

- **Node**: a versão fica em `.nvmrc` (lida pelo CI) e no `ARG NODE_VERSION`
  do `Dockerfile`. Mude as duas juntas.
- **ESLint 9**: fica nesta versão, mesmo com o aviso de "no longer
  supported", porque o `eslint-plugin-react` que vem no `eslint-config-next`
  16.3 ainda quebra no ESLint 10. É a mesma versão que o `create-next-app` usa.
- **`allowScripts` no `package.json`**: o npm 11 bloqueia scripts de
  instalação de dependências até alguém decidir. O do `unrs-resolver` está
  negado: ele só confere o binário nativo, que já chega como dependência
  opcional. Para revisar novos: `docker compose run --rm web npm install-scripts ls`.
