import { enderecoTexto, site } from "@/config/site";

export const dynamic = "force-static";

/**
 * /llms.txt: resumo do site em Markdown para assistentes de IA
 * (https://llmstxt.org).
 *
 * É gerado no build a partir do config, em vez de ser um arquivo em
 * `public/`: uma cópia escrita à mão repete dados que já existem no código e
 * fica desatualizada na primeira mudança de endereço ou preço. Ao criar
 * conteúdo que valha a pena resumir (serviços, perguntas frequentes),
 * acrescente aqui a partir da mesma fonte que a página usa.
 */
export function GET() {
  const telefone = site.contato?.telefone;
  const email = site.contato?.email;

  const contato = [
    ...(telefone ? [`- **Telefone**: ${telefone.exibicao}`] : []),
    ...(email ? [`- **E-mail**: ${email}`] : []),
    ...(site.endereco ? [`- **Endereço**: ${enderecoTexto(site.endereco)}`] : []),
  ];

  const linhas = [
    `# ${site.nome}`,
    "",
    `> ${site.descricao}`,
    "",
    ...(contato.length > 0 ? ["## Contato", "", ...contato, ""] : []),
    "## Links",
    "",
    `- [Página principal](${site.url}/)`,
    `- [Sitemap](${site.url}/sitemap.xml)`,
    "",
  ];

  return new Response(linhas.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
