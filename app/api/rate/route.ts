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

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { id, x } = data;

    const updatedRate = await Rate.findByIdAndUpdate(id, { x }, { new: true });

    if (!updatedRate) {
      return Response.json({ error: 'Rate not found' }, { status: 404 });
    }

    return Response.json(updatedRate);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
