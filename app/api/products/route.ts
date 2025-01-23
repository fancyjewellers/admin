import { dbConnect } from "@/lib/mongodb";
import { Product,} from '@/lib/models/Product.model';



export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const filters: Record<string, string> = {};
    
    
    const category = searchParams.get('category');
    const quality = searchParams.get('subcategory');
    

    
    if (category) filters.category = category;
    if (quality) filters.subcategory = quality;
    

    const products = await Product.find(filters).lean();
    return Response.json(products);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}