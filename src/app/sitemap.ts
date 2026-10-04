import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/** Uma entrada por página. Ao criar uma página nova, acrescente aqui. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: site.ultimaAtualizacaoConteudo,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
