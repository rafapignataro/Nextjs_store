import { GetServerSideProps } from "next";
import { Title } from "@/styles/pages/Home";

interface IProduct {
  id: string;
  title: string;
}

interface ProductsProps {
  recommendedProducts: IProduct[];
}

// SSR - SERVER SIDE RENDERING EXAMPLE

export default function Products({ recommendedProducts }: ProductsProps) {
  return (
    <div>
      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>{recommendedProduct.title}</li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

// TTFB - Time To First Byte (Tempo que demora para o browser carregar primeira visualização)

export const getServerSideProps: GetServerSideProps<ProductsProps> = async () => {
  const response = await fetch(process.env.API_URL + `/recommended`);

  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts,
    },
  };
};
