import { dbConnect } from "@/lib/mongodb";
import { Rate} from '@/lib/models/Rate.model';



export async function GET() {
  try {
    await dbConnect();
    const products = await Rate.find().lean();
    return Response.json(products);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}