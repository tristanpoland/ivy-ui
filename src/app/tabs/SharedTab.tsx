// src/components/tabs/SharedTab.tsx
import React, { useState } from 'react';
import { User, Clock, Share2, MoreVertical } from 'lucide-react';
import { formatRelativeTime, clsx } from '../../lib/utils';

interface SharedItem {
  id: string;
  name: string;
  sharedBy: string;
  sharedAt: string;
  access: 'read' | 'write';
}

export function SharedTab() {
  const [sharedItems] = useState<SharedItem[]>([
    {
      id: '1',
      name: 'Team Project Files',
      sharedBy: 'Sarah Connor',
      sharedAt: new Date().toISOString(),
      access: 'write'
    },
    {
      id: '2',
      name: 'Marketing Assets',
      sharedBy: 'John Smith',
      sharedAt: new Date(Date.now() - 3600000).toISOString(),
      access: 'read'
    }
  ]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Shared with me</h2>
        <button className="px-4 py-2 text-sm text-neutral-400 hover:text-white 
          hover:bg-neutral-800 rounded-lg transition-colors">
          <Share2 className="w-4 h-4 inline-block mr-2" />
          Share New
        </button>
      </div>
      
      <div className="grid gap-4">
        {sharedItems.map((item) => (
          <div key={item.id} className="bg-neutral-800/40 rounded-lg border border-neutral-700/50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium">{item.name}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {item.sharedBy}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatRelativeTime(item.sharedAt)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={clsx(
                  'px-2 py-1 rounded text-xs font-medium',
                  item.access === 'write' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-blue-500/10 text-blue-400'
                )}>
                  {item.access === 'write' ? 'Can Edit' : 'Can View'}
                </span>
                <button className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-700/50">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}