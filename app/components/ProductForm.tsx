'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImagePlus, X } from 'lucide-react';
import { addProduct, updateProduct } from '@/lib/actions/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface ProductFormProps {
  product?: {
    _id: string;
    title: string;
    category: string;
    price: number;
    primaryImage?: string;
    secondaryImage1?: string;
    secondaryImage2?: string;
    weight:number;
    quality:number;
    discount:number;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImage1, setSecondaryImage1] = useState<File | null>(null);
  const [secondaryImage2, setSecondaryImage2] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (primaryImage) formData.set('primaryImage', primaryImage);
    if (secondaryImage1) formData.set('secondaryImage1', secondaryImage1);
    if (secondaryImage2) formData.set('secondaryImage2', secondaryImage2);

    if (product) {
      await updateProduct(product._id, formData);
    } else {
      await addProduct(formData);
      setPrimaryImage(null);
      setSecondaryImage1(null);
      setSecondaryImage2(null);
      e.currentTarget.reset();
    }

    router.push('/admin');
  };

  const ImagePreview = ({
    file,
    existingUrl,
    onClear,
    alt
  }: {
    file: File | null,
    existingUrl?: string,
    onClear: () => void,
    alt: string
  }) => {
    if (!file && !existingUrl) return null;

    return (
      <div className="relative inline-block">
        <img
          src={file ? URL.createObjectURL(file) : existingUrl}
          alt={alt}
          className="w-32 h-32 object-cover rounded-lg shadow-md"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
          onClick={onClear}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const ImageUpload = ({
    id,
    label,
    file,
    setFile,
    existingUrl
  }: {
    id: string,
    label: string,
    file: File | null,
    setFile: (file: File | null) => void,
    existingUrl?: string
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="space-y-4">
        {(file || existingUrl) ? (
          <ImagePreview
            file={file}
            existingUrl={existingUrl}
            onClear={() => setFile(null)}
            alt={label}
          />
        ) : (
          <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
            onClick={() => document.getElementById(id)?.click()}>
            <div className="text-center">
              <ImagePlus className="w-8 h-8 mx-auto text-gray-400" />
              <span className="text-sm text-gray-500">Upload</span>
            </div>
          </div>
        )}
        <Input
          id={id}
          name={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setFile(file);
          }}
        />
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={product?.title}
                placeholder="Enter product title"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                defaultValue={product?.category}
                required >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Necklace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="necklace">Necklace</SelectItem>
                  <SelectItem value="earrings">Earrings</SelectItem>
                  <SelectItem value="ring">Ring</SelectItem>
                  <SelectItem value="bracelet">Bracelet</SelectItem>
                  <SelectItem value="pendant">Pendant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            

            <div className="space-y-2">
              <Label htmlFor="quality">Product Quality</Label>
              <Select
                name="quality"
                defaultValue={product?.quality?.toString()}
                required >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder='22k' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.9275">22K</SelectItem>
                  <SelectItem value="0.8475">20K</SelectItem>
                  <SelectItem value="0.7675">18K</SelectItem>
                  {/* <SelectItem value="bracelet">16K</SelectItem>
                  <SelectItem value="pendant">14K</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
            <Label htmlFor="price">Weight</Label>
            <div className="relative">
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.001"
                defaultValue={product?.weight}
                className="pl-8"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Making Charges in %</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">%</span>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product?.price}
                className="pl-8"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Making Charge Discount in %</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">%</span>
              <Input
                id="discount"
                name="discount"
                type="number"
                step="0.01"
                defaultValue={product?.discount}
                className="pl-8"
                placeholder="10%"
                required
              />
            </div>
          </div>
          </div>


          

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Images</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <ImageUpload
                id="primaryImage"
                label="Primary Image"
                file={primaryImage}
                setFile={setPrimaryImage}
                existingUrl={product?.primaryImage}
              />
              <ImageUpload
                id="secondaryImage1"
                label="Secondary Image 1"
                file={secondaryImage1}
                setFile={setSecondaryImage1}
                existingUrl={product?.secondaryImage1}
              />
              <ImageUpload
                id="secondaryImage2"
                label="Secondary Image 2"
                file={secondaryImage2}
                setFile={setSecondaryImage2}
                existingUrl={product?.secondaryImage2}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="w-full md:w-auto"
            >
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProductForm;



