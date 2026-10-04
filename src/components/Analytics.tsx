import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { site } from "@/config/site";

/**
 * Tag do Google: GA4 e/ou Google Ads. Sem IDs no config, não carrega nada.
 *
 * O primeiro ID carrega o gtag.js; o Ads entra como destino adicional do
 * mesmo gtag. Não dá para repetir <GoogleAnalytics/>: ele usa ids de script
 * fixos (_next-ga-init / _next-ga) e o next/script descartaria o segundo.
 * Redeclarar o gtag aqui é inofensivo e torna este script independente da
 * ordem de carregamento.
 */
export default function Analytics() {
  const { analyticsId, adsId } = site.google;
  const principal = analyticsId || adsId;
  if (!principal) return null;

  return (
    <>
      <GoogleAnalytics gaId={principal} />
      {analyticsId && adsId && (
        <Script id="gtag-google-ads">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('config', '${adsId}');`}
        </Script>
      )}
    </>
  );
}
