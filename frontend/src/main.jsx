import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Prefeitura de Betim</p>
          <h1>Portal Esporte Betim</h1>
          <p className="intro">
            Acompanhe noticias, eventos, modalidades, locais esportivos e inscricoes dos programas de esporte.
          </p>
        </div>
      </section>

      <section className="dashboard">
        <article>
          <span>Noticias</span>
          <strong>/api/noticias</strong>
        </article>
        <article>
          <span>Eventos</span>
          <strong>/api/eventos</strong>
        </article>
        <article>
          <span>Modalidades</span>
          <strong>/api/modalidades</strong>
        </article>
        <article>
          <span>Inscricoes</span>
          <strong>/api/inscricoes</strong>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
