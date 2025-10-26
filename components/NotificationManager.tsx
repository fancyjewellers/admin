"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Device = { _id: string; token: string; lastUpdated?: string };

export default function NotificationManager() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDevices() {
    setLoading(true);
    try {
      const res = await fetch('/api/notification');
      const json = await res.json();
      if (json?.success) setDevices(json.devices || []);
      else setDevices([]);
    } catch (e: unknown) {
      console.error(e);
      setError('Failed to load devices');
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchDevices(); }, []);

  async function handleDelete(id: string) {
    if (!confirm('Remove this device?')) return;
    try {
      const res = await fetch('/api/notification', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.message || 'Delete failed');
      setDevices(prev => prev.filter(d => d._id !== id));
    } catch (e: unknown) { const msg = e instanceof Error ? e.message : String(e ?? 'Delete failed'); setError(msg); }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading ? <div>Loading…</div> : (
        <div className="grid gap-2">
          {devices.map(d => (
            <div key={d._id} className="flex items-center justify-between p-3 border rounded">
              <div className="truncate">
                <div className="font-medium">{d.token}</div>
                <div className="text-sm text-gray-500">{d.lastUpdated}</div>
              </div>
              <Button variant="destructive" onClick={() => handleDelete(d._id)}>Remove</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
