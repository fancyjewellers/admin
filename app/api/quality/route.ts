import { dbConnect } from "@/lib/mongodb";
import { Quality } from "@/lib/models/Quality.model";



export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set - /api/quality GET returning empty array');
      return Response.json([]);
    }
    await dbConnect();
    const products = await Quality.find().lean();
    return Response.json(products);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return Response.json({ error: 'MONGODB not configured' }, { status: 500 });
    }
    await dbConnect();
    const body = await request.json();
    const { quality, price } = body;
    if (!quality || typeof quality !== 'string' || !price) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const created = await Quality.create({ quality: quality.trim(), price: Number(price) });
    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return Response.json({ error: 'MONGODB not configured' }, { status: 500 });
    }
    await dbConnect();
    const body = await request.json();
    const { id, price } = body;
    if (!id || price === undefined) {
      return Response.json({ error: 'id and price required' }, { status: 400 });
    }
    const updated = await Quality.findByIdAndUpdate(
      id,
      { price: Number(price) },
      { new: true }
    );
    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(updated);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return Response.json({ error: 'MONGODB not configured' }, { status: 500 });
    }
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    const deleted = await Quality.findByIdAndDelete(id);
    if (!deleted) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Ensure module
export {};
// end