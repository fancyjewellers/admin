import { dbConnect } from "@/lib/mongodb";
import { Hero } from "@/lib/models/Hero.model";



export async function GET() {
  try {
    await dbConnect();
    const products = await Hero.find().lean();
    return Response.json(products);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}