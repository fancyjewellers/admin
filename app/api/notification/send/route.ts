import { NextRequest, NextResponse } from 'next/server';

interface SendNotificationRequest {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface SendResult {
  successCount: number;
  failureCount: number;
  errors: Array<{ token: string; error: string }>;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await req.json() as SendNotificationRequest;
    const { tokens, title, body, data } = requestBody;

    // Validate input
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Valid tokens array is required' },
        { status: 400 }
      );
    }

    if (!title || !body) {
      return NextResponse.json(
        { success: false, message: 'Title and body are required' },
        { status: 400 }
      );
    }

    // Prepare the notification payload
    const messages = tokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: data || {},
    }));

    const result: SendResult = {
      successCount: 0,
      failureCount: 0,
      errors: [],
    };

    // Send notifications using Expo Push Notification service
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        throw new Error(`Expo API returned status ${response.status}`);
      }

      const responseData = await response.json();
      
      // Process response data
      if (Array.isArray(responseData.data)) {
        responseData.data.forEach((item: { status: string; message?: string }, index: number) => {
          if (item.status === 'ok') {
            result.successCount++;
          } else {
            result.failureCount++;
            result.errors.push({
              token: tokens[index],
              error: item.message || 'Unknown error',
            });
          }
        });
      } else {
        // If single response
        if (responseData.data?.status === 'ok') {
          result.successCount = tokens.length;
        } else {
          result.failureCount = tokens.length;
        }
      }
    } catch (error) {
      console.error('Error sending push notifications:', error);
      result.failureCount = tokens.length;
      result.errors.push({
        token: 'all',
        error: error instanceof Error ? error.message : 'Failed to send notifications',
      });
    }

    return NextResponse.json({
      success: result.successCount > 0,
      message: `Sent ${result.successCount} notifications, ${result.failureCount} failed`,
      successCount: result.successCount,
      failureCount: result.failureCount,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Error in send notification endpoint:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
