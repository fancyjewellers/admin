import { NextRequest, NextResponse } from 'next/server';
import AppNotification from "@/lib/models/Notification.model";
import { dbConnect } from "@/lib/mongodb";
import { INotificationDevice, ApiResponse } from '@/types/notification';

interface Notification {
  token: string;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<INotificationDevice>>> {
  try {
    await dbConnect();

    const body = await req.json() as Notification;
    const { token} = body;

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Token is required' 
        },
        { status: 400 }
      );
    }

    // Update or create device token with new fields
    const device = await AppNotification.findOneAndUpdate(
      { token },
        { token },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      device: device.toObject()
    });
  } catch (error) {
    console.error('Error registering device:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error registering device' 
      },
      { status: 500 }
    );
  }
}