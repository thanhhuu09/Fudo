import ProductsPage from "@/components/ProductsPage";
import axios from "axios";

export default async function Page() {
  const products = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/menu-items`)
    .then((response) => response.data);
  return <ProductsPage products={products} />;
}
