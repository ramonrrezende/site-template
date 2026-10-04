/**
 * Dados do site usados em mais de um lugar: metadados, dados estruturados
 * (JSON-LD), robots, sitemap, llms.txt e o texto visível.
 *
 * Existe para que informação factual tenha uma única fonte. O Google exige
 * que o JSON-LD corresponda ao conteúdo visível, então endereço, telefone e
 * afins precisam sair do mesmo lugar que o texto da página — senão uma
 * alteração em um esquece o outro.
 *
 * Tudo abaixo é exemplo: troque pelos dados do projeto.
 */

export type Endereco = {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  /** Sigla da UF, como "RJ". */
  estado: string;
  cep: string;
  /** Código ISO do país, como "BR". */
  pais: string;
};

export type SiteConfig = {
  /** URL pública, sem barra no final. */
  url: string;
  nome: string;
  /**
   * Usada na meta description, no Open Graph e no llms.txt.
   *
   * ⚠️ Manter em no máximo ~160 caracteres: acima disso o Google corta o
   * final no resultado de busca, e o corte costuma comer a chamada para ação.
   */
  descricao: string;
  /** Atributo `lang` do HTML. */
  idioma: string;
  /** Locale do Open Graph. */
  locale: string;
  /**
   * Data da última alteração de conteúdo, usada no `lastmod` do sitemap.
   *
   * É fixa de propósito. Com `new Date()`, cada build diria aos buscadores
   * que a página mudou mesmo sem mudança de conteúdo — sinal ruidoso, que a
   * médio prazo faz o crawler confiar menos na informação.
   *
   * Atualize ao mexer em texto, preço, endereço ou qualquer coisa que o
   * visitante veja — não ao ajustar build, dependências ou estilo.
   */
  ultimaAtualizacaoConteudo: string;
  /**
   * Tipo schema.org da organização. "Organization" serve para qualquer
   * site; "LocalBusiness" ou um subtipo dele ("Psychologist", "Dentist",
   * "LegalService"...) habilita a aparição em busca local e no mapa.
   */
  tipoOrganizacao: string;
  /** Caminho de um logotipo em `public/`, para o JSON-LD. Opcional. */
  logo?: string;
  contato?: {
    telefone?: {
      /** Como aparece para quem lê. */
      exibicao: string;
      /** Formato E.164, para o link `tel:` e para o schema. */
      e164: string;
    };
    email?: string;
  };
  /**
   * Endereço físico, se houver atendimento presencial.
   *
   * Manter idêntico ao cadastrado no Google Business Profile: o Google
   * associa a ficha ao site comparando nome, endereço e telefone, e
   * divergência enfraquece a associação.
   */
  endereco?: Endereco;
  /** Perfis oficiais (Instagram, LinkedIn...), para o `sameAs` do JSON-LD. */
  redes: string[];
  google: {
    /** Conteúdo da meta tag google-site-verification. Vazio omite a tag. */
    verificacao: string;
    /** ID do GA4 (G-XXXXXXXXXX). Vazio desativa. */
    analyticsId: string;
    /** ID do Google Ads (AW-XXXXXXXXXX). Vazio desativa. */
    adsId: string;
  };
};

export const site: SiteConfig = {
  url: "https://www.exemplo.com.br",
  nome: "Nome do Site",
  descricao:
    "Uma frase sobre o que você oferece e para quem, com a cidade se o atendimento for local. Até ~160 caracteres.",
  idioma: "pt-BR",
  locale: "pt_BR",
  ultimaAtualizacaoConteudo: "2026-10-04",
  tipoOrganizacao: "Organization",
  redes: [],
  google: {
    verificacao: "",
    analyticsId: "",
    adsId: "",
  },
};

/**
 * Logradouro, número e complemento. É o que vai no `streetAddress` do
 * schema, que não tem campo próprio para sala ou conjunto.
 */
export function enderecoLinha(e: Endereco) {
  return [e.logradouro, e.numero, e.complemento].filter(Boolean).join(", ");
}

/** Endereço completo como frase, do jeito que aparece no texto. */
export function enderecoTexto(e: Endereco) {
  return `${enderecoLinha(e)}, ${e.bairro}, ${e.cidade} - ${e.estado}, CEP ${e.cep}`;
}
