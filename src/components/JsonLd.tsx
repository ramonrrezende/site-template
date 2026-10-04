/**
 * Dados estruturados (schema.org) em JSON-LD.
 *
 * O `<` vira `<` porque JSON.stringify não escapa `</script>`: um texto
 * com essa sequência fecharia a tag antes da hora e o resto viraria HTML.
 * É o tratamento recomendado na documentação do Next.
 */
export default function JsonLd({ dados }: { dados: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(dados).replace(/</g, "\\u003c"),
      }}
    />
  );
}
