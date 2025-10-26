import { dbConnect } from "@/lib/mongodb";
import { Stopper} from '@/lib/models/Stopper.model';



export async function GET() {
  try {
    await dbConnect();
    const products = await Stopper.find().lean();
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

    const updatedStopper = await Stopper.findByIdAndUpdate(id, { x }, { new: true });

    

    return Response.json(updatedStopper);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Ensure this file is treated as a module by TypeScript's module resolution
export {};