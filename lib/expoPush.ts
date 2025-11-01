// server/libs/expoPush.ts
// Use the built-in fetch available in Node 18+ / Next.js runtime

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const EXPO_BATCH_SIZE = 100;

export async function sendExpoMessages(messages: Array<{ to: string; title?: string; body?: string; data?: Record<string, unknown> }>) {
  const batches: Array<Array<{ to: string; title?: string; body?: string; data?: Record<string, unknown> }>> = [];
  for (let i = 0; i < messages.length; i += EXPO_BATCH_SIZE) {
    batches.push(messages.slice(i, i + EXPO_BATCH_SIZE));
  }

  const results: unknown[] = [];
  for (const batch of batches) {
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      // If parsing fails, push raw text
      try {
        json = await res.text();
      } catch {
        json = { error: 'Failed to parse response' };
      }
    }
    results.push(json);
  }

  return results;
}