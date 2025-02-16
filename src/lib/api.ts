// src/lib/api.ts
import { Drive, DriveCategory } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => `drive-${Math.random().toString(36).substr(2, 9)}`;

// Mock database
let drives: Record<DriveCategory, Drive[]> = {
  local: [
    {
      id: generateId(),
      name: "MacBook Pro",
      type: "Local Machine",
      used: 256 * 1024 * 1024 * 1024,
      total: 512 * 1024 * 1024 * 1024,
      icon: 'Laptop',
      lastSync: new Date().toISOString(),
      color: "blue",
      status: "active"
    },
    {
      id: generateId(),
      name: "Windows Workstation",
      type: "Local Machine",
      used: 1.2 * 1024 * 1024 * 1024 * 1024,
      total: 2 * 1024 * 1024 * 1024 * 1024,
      icon: 'Laptop',
      lastSync: new Date().toISOString(),
      color: "purple",
      status: "active"
    }
  ],
  remote: [
    {
      id: generateId(),
      name: "Primary Vault",
      type: "Remote Storage",
      used: 3.5 * 1024 * 1024 * 1024 * 1024,
      total: 8 * 1024 * 1024 * 1024 * 1024,
      icon: 'Server',
      lastSync: new Date().toISOString(),
      color: "emerald",
      status: "active"
    }
  ],
  cloud: [
    {
      id: generateId(),
      name: "Cloud Backup",
      type: "Cloud Storage",
      used: 500 * 1024 * 1024 * 1024,
      total: 2 * 1024 * 1024 * 1024 * 1024,
      icon: 'Cloud',
      lastSync: new Date().toISOString(),
      color: "rose",
      status: "active"
    }
  ]
};

export const api = {
  drives: {
    list: async (category: DriveCategory) => {
      await delay(500);
      return { data: drives[category] || [] };
    },

    add: async (category: DriveCategory, driveData: Partial<Drive>) => {
      await delay(1000);
      const newDrive = {
        id: generateId(),
        lastSync: new Date().toISOString(),
        status: "active",
        ...driveData
      } as Drive;
      drives[category].push(newDrive);
      return { data: newDrive };
    },

    update: async (category: DriveCategory, driveId: string, updates: Partial<Drive>) => {
      await delay(500);
      drives[category] = drives[category].map(drive =>
        drive.id === driveId ? { ...drive, ...updates } : drive
      );
      return { data: drives[category].find(d => d.id === driveId) };
    },

    remove: async (category: DriveCategory, driveId: string) => {
      await delay(1000);
      drives[category] = drives[category].filter(d => d.id !== driveId);
      return { success: true };
    },

    getStats: async (category: DriveCategory, driveId: string) => {
      await delay(300);
      const drive = drives[category].find(d => d.id === driveId);
      if (!drive) throw new Error('Drive not found');
      
      return {
        data: {
          used: drive.used,
          total: drive.total,
          available: drive.total - drive.used,
          lastSync: drive.lastSync
        }
      };
    }
  }
};