

import { getProducts, deleteProduct } from '@/lib/actions/actions';
import { Product } from '@/lib/types';
// import { ProductForm } from '../components/ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Trash2 } from 'lucide-react';
import Image from 'next/image';
import StopperManager from '@/components/StopperManager';
import RateUpdate from '@/app/components/RateUpdate';
import QualityManager from '@/components/QualityManager';
import HeroPosterManager from '@/components/HeroPosterManager';
import NotificationManager from '@/components/NotificationManager';


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
  <TabsList className="grid w-full grid-cols-3 lg:w-[900px]">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Product List
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </TabsTrigger>
          <TabsTrigger value="stopper" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Stopper
          </TabsTrigger>
          <TabsTrigger value="rate" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Rate
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Quality
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16v12H4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Hero Posters
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          {/* <ProductForm /> */}
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
                      <div className="aspect-video w-full overflow-hidden relative">
                        {product.primaryImage ? (
                          <Image
                            src={product.primaryImage}
                            alt={product.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : null}
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
                              <Image
                                src={product.secondaryImage1}
                                alt="Secondary 1"
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            {product.secondaryImage2 && (
                              <Image
                                src={product.secondaryImage2}
                                alt="Secondary 2"
                                width={48}
                                height={48}
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
        <TabsContent value="stopper">
          <Card>
            <CardHeader>
              <CardTitle>Stopper Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <StopperManager />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rate">
          <Card>
            <CardHeader>
              <CardTitle>Rate Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <RateUpdate />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Qualities</CardTitle>
            </CardHeader>
            <CardContent>
              <QualityManager />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Posters</CardTitle>
            </CardHeader>
            <CardContent>
              <HeroPosterManager />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
