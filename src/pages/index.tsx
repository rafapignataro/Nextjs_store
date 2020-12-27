import { useEffect, useState } from "react";
import Link from "next/link";
import { Title } from "@/styles/pages/Home";
import SEO from "@/components/SEO";
import { GetServerSideProps } from "next";
import { client } from "@/libs/prismic";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";

interface HomeProps {
  recommendedProducts: Document[];
}

// CSR - CLIENT SIDE RENDERING EXAMPLE

export default function Home({ recommendedProducts }: HomeProps) {
  return (
    <div>
      <section>
        <SEO
          title="DevCommerce, your best e-commerce!"
          image="banner.jpg"
          shouldExcludeTitleSuffix
        />
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", "product"),
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
