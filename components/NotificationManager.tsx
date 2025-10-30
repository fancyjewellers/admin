"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Device = { _id: string; token: string; lastUpdated?: string };

export default function NotificationManager() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  
  // Notification form fields
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState('');

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

  async function handleSendToAll() {
    if (!title || !body) {
      setError('Please enter both title and message');
      return;
    }

    if (devices.length === 0) {
      setError('No devices to send notification to');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const tokens = devices.map(d => d.token);
      
      const res = await fetch('/api/notification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          title,
          body,
          data: data ? JSON.parse(data) : undefined,
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result?.message || 'Failed to send notifications');
      }

      alert(`✅ Notifications sent successfully!\nSuccess: ${result.successCount}\nFailed: ${result.failureCount}`);
      
      // Clear form
      setTitle('');
      setBody('');
      setData('');
      
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e ?? 'Send failed');
      setError(msg);
    } finally {
      setSending(false);
    }
  }

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
    <div className="space-y-6">
      {/* Send Notification Section */}
      <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
        <h3 className="font-semibold mb-3">Send Push Notification to All Devices</h3>
        <div className="space-y-3">
          <Input
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Notification Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
          />
          <Input
            placeholder='Optional JSON data: {"key": "value"}'
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <Button 
            onClick={handleSendToAll} 
            disabled={sending || devices.length === 0}
            className="w-full"
          >
            {sending ? 'Sending...' : `Send to ${devices.length} Device(s)`}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && <div className="text-sm text-red-600 p-3 bg-red-50 dark:bg-red-950 rounded">{error}</div>}

      {/* Devices List */}
      <div>
        <h3 className="font-semibold mb-3">Registered Devices ({devices.length})</h3>
        {loading ? <div>Loading…</div> : (
          <div className="grid gap-2">
            {devices.length === 0 ? (
              <div className="text-sm text-gray-500 p-3 border rounded">No devices registered</div>
            ) : (
              devices.map(d => (
                <div key={d._id} className="flex items-center justify-between p-3 border rounded">
                  <div className="truncate flex-1 mr-4">
                    <div className="font-mono text-sm">{d.token}</div>
                    {d.lastUpdated && (
                      <div className="text-xs text-gray-500 mt-1">
                        Last updated: {new Date(d.lastUpdated).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(d._id)}>Remove</Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
