import { NextRequest, NextResponse } from 'next/server';
import AppNotification from "@/lib/models/Notification.model";
import { dbConnect } from "@/lib/mongodb";
import { INotificationDevice, ApiResponse } from '@/types/notification';

interface DeviceRegistrationRequest {
  token: string;
  // optional metadata object or JSON string
  meta?: unknown;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<INotificationDevice>>> {
  try {
    await dbConnect();

  const body = await req.json() as DeviceRegistrationRequest;
  const { token, meta } = body;

    // Validate token
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Valid token is required' 
        },
        { status: 400 }
      );
    }

    // Normalize and parse meta: accept object or JSON string
    let parsedMeta: unknown = null;
    if (meta !== undefined && meta !== null) {
      if (typeof meta === 'string') {
        try { parsedMeta = JSON.parse(meta); } catch { parsedMeta = meta; }
      } else {
        parsedMeta = meta;
      }
    }

    // Update or create device token
    const device = await AppNotification.findOneAndUpdate(
      { token: token.trim() },
      {
        token: token.trim(),
        meta: parsedMeta,
        lastUpdated: new Date(), // track when token was last updated
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      device: device.toObject(),
      message: 'Device registered successfully'
    });
  } catch (error) {
    console.error('Error registering device:', error);
    
    // More specific error handling
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid JSON in request body' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error while registering device' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const devices = await AppNotification.find().lean();
    return NextResponse.json({ success: true, devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ success: false, message: 'id required' }, { status: 400 });
    await AppNotification.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting device:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}