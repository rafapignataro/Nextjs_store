// CSR - CLIENT SIDE RENDERING EXAMPLE

import { useRouter } from "next/router";
import { Title } from "@/styles/pages/Home";
import { GetStaticPaths, GetStaticProps } from "next";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";
import { client } from "@/libs/prismic";

// Qualquer página não encontrada sera redirecionada para ca.

interface ProductProps {
  product: Document;
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando ...</p>;
  }

  return (
    <div>
      <Title>{PrismicDOM.RichText.asText(product.data.title)}</Title>
      <img src={product.data.thumbnail.url} alt="" width="250" />
      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      ></div>
      <p>Price: ${product.data.price}</p>
    </div>
  );
}

// QUAIS SAO AS POSSIBILIDADES DA ROTA DINAMICA
export const getStaticPaths: GetStaticPaths = async () => {
  // Se a rota for dinamica não fazer um query grande pois o processo de build irá demorar
  // Solução: Top 50, mais acessados ou remover paths e deixar toda pagina ser gerada em seu primeiro acesso
  return {
    paths: [],
    // Se true toda vez q um usuário acessar nova pagina primeira vez, ela é gerada
    fallback: true,
  };
};

// QUAIS PROPRIEDAS PASSADAS PARA A PAGINA
export const getStaticProps: GetStaticProps<ProductProps> = async context => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    // tempo a ser gerada cada nova pagina estatica
    revalidate: 5,
  };
};
