"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type QualityItem = {
  _id: string;
  quality: string;
  price: number;
};

export default function QualityManager() {
  const [items, setItems] = useState<QualityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [qValue, setQValue] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/quality');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      console.error(e);
      setError('Failed to load qualities');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleAdd() {
    setError(null);
    if (!qValue) return setError('Enter quality name');
    try {
      const res = await fetch('/api/quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quality: qValue, price: Number(price || 0) }),
      });
      if (!res.ok) throw new Error('Add failed');
      await fetchItems();
      setQValue(''); setPrice('');
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e ?? 'Add failed');
      setError(msg);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this quality?')) return;
    try {
      const res = await fetch('/api/quality', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error('Delete failed');
      setItems(prev => prev.filter(p => p._id !== id));
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e ?? 'Delete failed');
      setError(msg);
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="grid gap-2 md:grid-cols-3">
        <Input placeholder="Quality name" value={qValue} onChange={(e) => setQValue(e.target.value)} />
        <Input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Button onClick={handleAdd} className="w-full">Add</Button>
      </div>

      {loading ? <div>Loading…</div> : (
        <div className="grid gap-2">
          {items.map(it => (
            <div key={it._id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{it.quality}</div>
                <div className="text-sm text-gray-500">Price: {it.price}</div>
              </div>
              <Button variant="destructive" onClick={() => handleDelete(it._id)}>Delete</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
