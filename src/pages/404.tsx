// CSR - CLIENT SIDE RENDERING EXAMPLE

import { Title } from "@/styles/pages/Home";

// Qualquer página não encontrada sera redirecionada para ca.

export default function NotFound() {
  return (
    <div>
      <section>
        <Title>404 - NOT FOUND</Title>
        <h2>Are you lost?</h2>
      </section>
    </div>
  );
}
