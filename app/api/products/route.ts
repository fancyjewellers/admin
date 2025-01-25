import { dbConnect } from "@/lib/mongodb";
import { Product,} from '@/lib/models/Product.model';



export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const filters: Record<string, string | number> = {};
    
    
    const category = searchParams.get('category');
    const quality = searchParams.get('quality');
    

    
    if (category) filters.category = category;
    if (quality) filters.quality = Number(quality);
    

    const products = await Product.find(filters).lean();
    const sortProducts=products.sort((a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf());
    return Response.json(sortProducts);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}