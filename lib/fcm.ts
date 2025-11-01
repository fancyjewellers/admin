// server/libs/fcm.ts
// Use global fetch provided by Node/Next runtime
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID!; // e.g. "fancy-jewellers"
const FCM_ENDPOINT = `https://fcm.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/messages:send`;

async function getAccessToken(): Promise<string> {
  // Provide service account JSON as env var GOOGLE_SERVICE_ACCOUNT_JSON (stringified)
    // We import google-auth-library dynamically so the package is optional at build time.
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set - cannot obtain access token');
    }

    let GoogleAuthModule: any;
    try {
      // Dynamically require to avoid TypeScript/tsc resolving this module at build time when it's not installed.
      // Using eval('require') prevents bundlers/typecheckers from statically resolving the import.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    GoogleAuthModule = eval("require")('google-auth-library');
    } catch {
      throw new Error('google-auth-library is not installed. Install it or set GOOGLE_SERVICE_ACCOUNT_JSON to use service account auth.');
    }

    const GoogleAuth = GoogleAuthModule.GoogleAuth as any;
    const auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token!;
}

export async function sendFcmMessage(
  token: string,
  title?: string,
  body?: string,
  data?: Record<string, string>
) {
  const accessToken = await getAccessToken();
  const messageBody = {
    message: {
      token,
      notification: title || body ? { title: title ?? '', body: body ?? '' } : undefined,
      data: data ?? undefined,
      android: { priority: 'HIGH' },
      apns: { headers: { 'apns-priority': '10' } },
    },
  };

  const res = await fetch(FCM_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageBody),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`FCM send failed (${res.status}): ${text}`);
  }

  return res.json();
}