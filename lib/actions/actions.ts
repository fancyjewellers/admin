'use server'

import { dbConnect } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product.model';
import { uploadImage } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { Rate as RateModel } from '../models/Rate.model';


export async function addProduct(formData: FormData) {
    await dbConnect();
  
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    const gender = parseFloat(formData.get('gender') as string);
    const weight = parseFloat(formData.get('weight') as string);
    const quality = parseFloat(formData.get('quality') as string);
    const discount = parseFloat(formData.get('discount') as string);
    
    
  
    // Upload all images to Cloudinary
    const primaryImage = formData.get('primaryImage') as File;
    const secondaryImage1 = formData.get('secondaryImage1') as File;
    const secondaryImage2 = formData.get('secondaryImage2') as File;
  
    const primaryImageUrl = primaryImage ? await uploadImage(primaryImage) : null;
    const secondaryImage1Url = secondaryImage1 ? await uploadImage(secondaryImage1) : null;
    const secondaryImage2Url = secondaryImage2 ? await uploadImage(secondaryImage2) : null;
  
    const newProduct = new Product({
      title,
      category,
      price,
      primaryImage: primaryImageUrl,
      secondaryImage1: secondaryImage1Url,
      secondaryImage2: secondaryImage2Url,
      gender,
      weight,
      quality,
      discount,
    });
  
   
    await newProduct.save();
    revalidatePath('/admin');
  }
  
  export async function updateProduct(id: string, formData: FormData) {
    await dbConnect();
  
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    
  
    const existingProduct = await Product.findById(id);
    const primaryImage = formData.get('primaryImage') as File;
    const secondaryImage1 = formData.get('secondaryImage1') as File;
    const secondaryImage2 = formData.get('secondaryImage2') as File;
  
    
    
    const primaryImageUrl = primaryImage ? await uploadImage(primaryImage) : existingProduct.primaryImage;
    const secondaryImage1Url = secondaryImage1 ? await uploadImage(secondaryImage1) : existingProduct.secondaryImage1;
    const secondaryImage2Url = secondaryImage2 ? await uploadImage(secondaryImage2) : existingProduct.secondaryImage2;
  
    await Product.findByIdAndUpdate(id, {
      title,
      category,
      price,
      primaryImage: primaryImageUrl,
      secondaryImage1: secondaryImage1Url,
      secondaryImage2: secondaryImage2Url,
    });
  
    revalidatePath('/admin');
  }
  
  export async function deleteProduct(id: string) {
    await dbConnect();
    await Product.findByIdAndDelete(id);
    revalidatePath('/admin');
  }
  
  export async function getProducts() {
    await dbConnect();
    try {
      const products = await Product.find({}).lean();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
  

  export async function getRate() {
    try {
      await dbConnect();
      
      const rates = await RateModel.find().lean();
      return rates;
      
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  }
  
  export async function updateX(_id: string, x: number) {
    try {
      await dbConnect();
  
      const updatedUser = await RateModel.findOneAndUpdate(
        { _id },
        { $set: { x } },
        { new: true }
      );
  
      return {
        _id: updatedUser?._id?.toString() || '',
        x: updatedUser?.x || x
      };
    } catch (error) {
      console.error('Update Error:', error);
      return { _id: '', x };
    }
  }