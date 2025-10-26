"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type HeroItem = { _id: string; poster_no: number; url: string };

export default function HeroPosterManager() {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [posterNo, setPosterNo] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/heroposter');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      console.error(e);
      setError('Failed to load hero posters');
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleAdd() {
    setError(null);
    const pn = Number(posterNo);
    if (!url || Number.isNaN(pn)) return setError('Provide poster number and url');
    try {
      const res = await fetch('/api/heroposter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ poster_no: pn, url }) });
      if (!res.ok) throw new Error('Add failed');
      setUrl(''); setPosterNo('');
      fetchItems();
    } catch (e: unknown) { console.error(e); setError(e instanceof Error ? e.message : String(e ?? 'Add failed')); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this poster?')) return;
    try {
      const res = await fetch('/api/heroposter', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error('Delete failed');
      setItems(prev => prev.filter(p => p._id !== id));
    } catch (e: unknown) { console.error(e); setError(e instanceof Error ? e.message : String(e ?? 'Delete failed')); }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="grid gap-2 md:grid-cols-3">
        <Input placeholder="Poster number" value={posterNo} onChange={(e) => setPosterNo(e.target.value)} />
        <Input placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button onClick={handleAdd} className="w-full">Add Poster</Button>
      </div>

      {loading ? <div>Loading…</div> : (
        <div className="grid gap-2">
          {items.map(it => (
            <div key={it._id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Poster #{it.poster_no}</div>
                <div className="text-sm text-gray-500 truncate">{it.url}</div>
              </div>
              <div className="flex items-center gap-2">
                <a href={it.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600">View</a>
                <Button variant="destructive" onClick={() => handleDelete(it._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
