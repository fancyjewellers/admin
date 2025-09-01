import { dbConnect } from "@/lib/mongodb";
import { Quality } from "@/lib/models/Quality.model";



export async function GET() {
  try {
    await dbConnect();
    const products = await Quality.find().lean();
    return Response.json(products);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}