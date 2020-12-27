import { client } from "@/libs/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";

interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Category({ products, category }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    // Se ela esta em processo de renderização estática (para novas rotas geradas dinamicamente)
    // Mostra loading
    return <p>Carregando ...</p>;
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>
      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// QUAIS SAO AS POSSIBILIDADES DA ROTA DINAMICA
export const getStaticPaths: GetStaticPaths = async () => {
  // Se a rota for dinamica não fazer um query grande pois o processo de build irá demorar
  // Solução: Top 50, mais acessados ou remover paths e deixar toda pagina ser gerada em seu primeiro acesso
  const categories = await client().query([
    Prismic.Predicates.at("document.type", "category"),
  ]);

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid },
    };
  });

  return {
    paths,
    // Se true toda vez q um usuário acessar nova pagina primeira vez, ela é gerada
    fallback: true,
  };
};

// QUAIS PROPRIEDAS PASSADAS PARA A PAGINA
export const getStaticProps: GetStaticProps<CategoryProps> = async context => {
  const { slug } = context.params;

  const category = await client().getByUID("category", String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.at("my.product.category", category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    // tempo a ser gerada cada nova pagina estatica
    revalidate: 60,
  };
};
