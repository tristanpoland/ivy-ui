import React, { useState } from 'react';
import { 
  File, 
  Folder, 
  MoreVertical, 
  Download, 
  Trash, 
  Share2 
} from 'lucide-react';
import { formatBytes, formatRelativeTime } from '../../lib/utils';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  shared?: boolean;
}

export function FilesTab() {
  const [files] = useState<FileItem[]>([
    { 
      id: '1', 
      name: 'Documents', 
      type: 'folder', 
      modified: new Date().toISOString(),
      shared: true
    },
    { 
      id: '2', 
      name: 'project-proposal.pdf', 
      type: 'file', 
      size: 2.5 * 1024 * 1024, 
      modified: new Date().toISOString() 
    },
    { 
      id: '3', 
      name: 'Images', 
      type: 'folder', 
      modified: new Date().toISOString() 
    }
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Files</h2>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
          Upload Files
        </button>
      </div>

      <div className="bg-neutral-800/40 rounded-lg border border-neutral-700/50">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 text-sm text-neutral-400 border-b border-neutral-700/50">
          <div className="w-8"></div>
          <div>Name</div>
          <div>Modified</div>
          <div>Size</div>
        </div>

        {files.map((file) => (
          <div key={file.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 hover:bg-neutral-700/20 items-center group">
            <div className="w-8">
              {file.type === 'folder' ? (
                <Folder className="w-5 h-5 text-blue-400" />
              ) : (
                <File className="w-5 h-5 text-neutral-400" />
              )}
            </div>
            <div className="flex items-center text-white">
              {file.name}
              {file.shared && (
                <Share2 className="w-4 h-4 ml-2 text-neutral-400" />
              )}
            </div>
            <div className="text-sm text-neutral-400">
              {formatRelativeTime(file.modified)}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-400">
                {file.size ? formatBytes(file.size) : '--'}
              </span>
              <div className="relative">
                <button className="text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}