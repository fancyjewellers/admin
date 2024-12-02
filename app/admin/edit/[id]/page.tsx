import { getProducts } from '@/lib/actions/actions';
import { ProductForm } from '@/app/components/ProductForm';
import { Product } from '@/lib/types';
// interface Product {
//   _id: string;
//   title: string;
//   category: string;
//   price: number;
//   images: string[];
// }

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const products = (await getProducts() as unknown) as Product[];
  const product = products.find((p) => p._id === params.id);

  if (!product) {
    return <div>Product not found
      
    </div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}

