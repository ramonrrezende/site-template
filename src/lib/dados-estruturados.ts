import { enderecoLinha, site } from "@/config/site";

/**
 * Organização dona do site, a partir de `config/site.ts`. Os campos
 * opcionais só entram quando existem no config.
 */
export function organizacao() {
  const telefone = site.contato?.telefone;
  const email = site.contato?.email;
  const e = site.endereco;

  return {
    "@context": "https://schema.org",
    "@type": site.tipoOrganizacao,
    "@id": `${site.url}/#organizacao`,
    name: site.nome,
    description: site.descricao,
    url: `${site.url}/`,
    ...(site.logo ? { logo: new URL(site.logo, site.url).href } : {}),
    ...(telefone ? { telephone: telefone.e164 } : {}),
    ...(email ? { email } : {}),
    ...(e
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: enderecoLinha(e),
            addressLocality: e.cidade,
            addressRegion: e.estado,
            postalCode: e.cep,
            addressCountry: e.pais,
          },
        }
      : {}),
    ...(site.redes.length > 0 ? { sameAs: site.redes } : {}),
  };
}
