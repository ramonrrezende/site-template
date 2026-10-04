import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera HTML estático em `out/`, servido pelo S3 + CloudFront. Sem servidor
  // Node em produção: nada de API routes, server actions ou ISR.
  output: "export",

  // A otimização de imagens do Next depende de servidor. No export estático,
  // as imagens vão como estão: otimize antes de colocar em `public/`.
  images: { unoptimized: true },

  // Gera `rota/index.html` em vez de `rota.html`. O endpoint de site do S3 (e
  // o nginx do preview) resolvem `/rota/` para o index da pasta, mas não
  // acrescentam `.html` sozinhos.
  trailingSlash: true,
};

export default nextConfig;
