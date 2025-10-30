import { dbConnect } from "@/lib/mongodb";
import { Stopper} from '@/lib/models/Stopper.model';



export async function GET() {
  try {
    await dbConnect();
    let stoppers = await Stopper.find().lean();
    
    // If no stopper exists, create a default one
    if (stoppers.length === 0) {
      const newStopper = await Stopper.create({ x: false });
      stoppers = [newStopper.toObject()];
    }
    
    return Response.json(stoppers);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { x } = body;
    
    const stopper = await Stopper.create({ x: x ?? false });
    return Response.json(stopper, { status: 201 });
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