import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { site } from "@/config/site";
import { organizacao } from "@/lib/dados-estruturados";

// Auto-hospedada pelo next/font, sem layout shift. Vira a variável CSS
// --fonte-carregada, usada em --fonte-texto no globals.css: para trocar de
// fonte, basta mudar aqui.
const fonte = Inter({
  subsets: ["latin"],
  variable: "--fonte-carregada",
});

export const metadata: Metadata = {
  // Necessário para o Next resolver as imagens do Open Graph em URL
  // absoluta: redes sociais rejeitam caminho relativo.
  metadataBase: new URL(site.url),
  title: { default: site.nome, template: `%s | ${site.nome}` },
  description: site.descricao,
  verification: site.google.verificacao
    ? { google: site.google.verificacao }
    : undefined,
  // A imagem vem de src/app/opengraph-image.(png|jpg), quando existir.
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.nome,
    title: site.nome,
    description: site.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: site.nome,
    description: site.descricao,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={site.idioma} className={fonte.variable}>
      <body>
        <main>{children}</main>
        <JsonLd dados={organizacao()} />
      </body>
      <Analytics />
    </html>
  );
}
