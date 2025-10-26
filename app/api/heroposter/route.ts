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

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { poster_no, url } = body;
    if (typeof poster_no !== 'number' || !url) {
      return Response.json({ error: 'poster_no (number) and url are required' }, { status: 400 });
    }
    const hero = new Hero({ poster_no, url });
    await hero.save();
    return Response.json(hero, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = body;
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    await Hero.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}