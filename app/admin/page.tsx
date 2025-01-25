

import { getProducts, deleteProduct } from '@/lib/actions/actions';
import { Product } from '@/lib/types';
import { ProductForm } from '../components/ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Trash2 } from 'lucide-react';


export default async function AdminPage() {
  const products = (await getProducts() as unknown) as Product[];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Total Products: {products.length}
          </span>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Product List
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <ProductForm />
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">No products found</p>
                  <p className="text-sm text-gray-500">Get started by adding your first product</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product: Product) => (
                    <Card key={product._id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={product.primaryImage}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold truncate">{product.title}</h3>
                              <p className="text-sm text-gray-500">category:{product.category}</p>
                              <p className="text-sm text-gray-500">weight:{product.weight}gram</p>
                              <p className="text-sm text-gray-500">quality:{product.quality}</p>
                              <p className="text-sm text-gray-500">discount:{product.discount}</p>
                              
                            </div>
                            <p className="text-sm text-gray-500">
                              Making charges(%) {product.price}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            {product.secondaryImage1 && (
                              <img
                                src={product.secondaryImage1}
                                alt="Secondary 1"
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            {product.secondaryImage2 && (
                              <img
                                src={product.secondaryImage2}
                                alt="Secondary 2"
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                          </div>

                          <div className="flex gap-2 pt-2">
                            {/* <Link href={`/admin/edit/${product._id}`} className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full flex items-center gap-2"
                              >
                                <PenSquare className="w-4 h-4" />
                                Edit
                              </Button>
                            </Link> */}
                            <form action={deleteProduct.bind(null, product._id)} className="flex-1">
                              <Button
                                variant="destructive"
                                type="submit"
                                className="w-full flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            </form>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
