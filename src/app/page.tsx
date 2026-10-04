import type { Metadata } from "next";
import { site } from "@/config/site";
import styles from "@/app/page.module.css";

// Cada página declara o próprio canonical. Declarado no layout, ele valeria
// para todas as páginas e apontaria todas para a home.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Página provisória: só confirma que o ambiente está rodando. Substitua. */
export default function Home() {
  return (
    <div className={styles.pagina}>
      <p className={styles.status}>
        <span className={styles.indicador} aria-hidden="true" />
        Funcionando
      </p>
      <h1>{site.nome}</h1>
      <p className={styles.descricao}>{site.descricao}</p>
      <ul className={styles.passos}>
        <li>
          Esta página fica em <code>src/app/page.tsx</code>.
        </li>
        <li>
          Nome, URL, descrição e contato ficam em <code>src/config/site.ts</code>.
        </li>
        <li>
          Cores, fonte e medidas ficam em <code>src/app/globals.css</code>.
        </li>
      </ul>
    </div>
  );
}
