import Link from "next/link";
import styles from "@/app/estados.module.css";

export default function NotFound() {
  return (
    <section className={styles.estado}>
      <h1>Página não encontrada</h1>
      <p>O endereço pode ter mudado ou estar digitado errado.</p>
      <Link href="/">Voltar para o início</Link>
    </section>
  );
}
