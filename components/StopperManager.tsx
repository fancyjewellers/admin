"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type StopperItem = {
  _id: string;
  x: boolean;
};

export default function StopperManager() {
  const [items, setItems] = useState<StopperItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/stopper')
      .then(res => res.json())
      .then((data) => {
        if (!mounted) return;
        // ensure array
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load stopper data');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  async function toggleItem(item: StopperItem) {
    setError(null);
    setUpdatingId(item._id);
    try {
      const res = await fetch('/api/stopper', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id, x: !item.x }),
      });
      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated?.error || 'Update failed');
      }
      setItems((prev) => prev.map(p => p._id === updated._id ? updated : p));
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err ?? 'Update failed');
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <div className="py-8 text-center">Loading…</div>;

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      {items.length === 0 ? (
        <div className="text-sm text-gray-600">No stopper entries found.</div>
      ) : (
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it._id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">ID: <span className="text-xs text-gray-500">{it._id}</span></div>
                <div className="text-sm text-gray-600">Value: {it.x ? 'Enabled' : 'Disabled'}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button disabled={updatingId === it._id} onClick={() => toggleItem(it)}>
                  {updatingId === it._id ? 'Updating…' : it.x ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
