"use client";

import styles from "@/app/estados.module.css";

/**
 * Falha ao renderizar no navegador. O HTML do site estático já vem pronto
 * do build, então isto cobre erros em componentes client.
 */
export default function Erro({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className={styles.estado}>
      <h1>Algo deu errado</h1>
      <p>Tente de novo. Se o problema continuar, recarregue a página.</p>
      <button type="button" className={styles.botao} onClick={() => reset()}>
        Tentar de novo
      </button>
    </section>
  );
}
