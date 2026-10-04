import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/**
 * Buscadores e assistentes de IA que levam gente até o site: indexam a
 * página para citá-la nas respostas, ou a abrem quando o usuário pergunta
 * algo. São os que interessam para a visibilidade — mantenha liberados.
 * Referência: https://developers.openai.com/api/docs/bots
 */
const buscaEAssistentes = [
  "OAI-SearchBot", // busca do ChatGPT
  "ChatGPT-User", // ChatGPT abrindo a página a pedido do usuário
  "OAI-AdsBot", // validação de anúncios no ChatGPT
  "Claude-SearchBot", // busca do Claude
  "Claude-User", // Claude abrindo a página a pedido do usuário
  "PerplexityBot", // índice do Perplexity
  "Perplexity-User",
  "Applebot", // Siri e Spotlight
  "DuckAssistBot", // DuckDuckGo
  "MistralAI-User",
  "YouBot",
];

/**
 * Coletores usados para treinar modelos. Bloqueados por opção: o conteúdo
 * do site não entra em dataset de treinamento. Isso não afeta a busca —
 * `Google-Extended` e `Applebot-Extended` existem só para essa recusa, e
 * não interferem no Googlebot nem no Applebot; o site segue elegível para
 * aparecer no ChatGPT, no Google e no Claude pelos bots do grupo acima.
 *
 * É uma escolha por projeto: para liberar, troque `disallow` por `allow`.
 */
const treinamentoDeModelos = [
  "GPTBot", // OpenAI
  "ClaudeBot", // Anthropic
  "Google-Extended", // Gemini / AI Overviews
  "Applebot-Extended", // Apple Intelligence
  "meta-externalagent", // Meta AI
  "Amazonbot",
  "CCBot", // Common Crawl
];

/**
 * Geram a prévia do link quando o site é compartilhado. Bloquear aqui faz
 * o link chegar sem imagem nem descrição — no WhatsApp, inclusive.
 */
const previaDeLinks = [
  "facebookexternalhit", // Facebook e Instagram
  "WhatsApp",
  "Twitterbot",
  "LinkedInBot",
  "TelegramBot",
  "Slackbot-LinkExpanding",
  "Discordbot",
];

/**
 * Raspadores de SEO e de datasets: consomem banda do servidor e não
 * trazem uma única visita. Nenhum deles é buscador.
 */
const raspadores = [
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot", // Majestic
  "DotBot", // Moz
  "rogerbot", // Moz
  "BLEXBot",
  "DataForSeoBot",
  "SerpstatBot",
  "Bytespider", // ByteDance — ignora limites com frequência
  "ImagesiftBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: buscaEAssistentes, allow: "/" },
      { userAgent: treinamentoDeModelos, disallow: "/" },
      { userAgent: previaDeLinks, allow: "/" },
      { userAgent: raspadores, disallow: "/" },
      // Qualquer outro crawler, incluindo Googlebot e bingbot.
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
