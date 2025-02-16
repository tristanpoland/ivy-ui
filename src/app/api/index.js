// api/index.js
import { MOCK_DATA } from '../config';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => `drive-${Math.random().toString(36).substr(2, 9)}`;

// Mock database
let drives = {
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

const files = {
  '/': {
    type: 'directory',
    contents: ['Documents', 'Images', 'Downloads']
  },
  '/Documents': {
    type: 'directory',
    contents: ['work', 'personal']
  },
  // Add more mock file structure as needed
};

export const api = {
  drives: {
    list: async (category) => {
      await delay(500);
      return { data: drives[category] || [] };
    },

    add: async (category, driveData) => {
      await delay(1000);
      const newDrive = {
        id: generateId(),
        lastSync: new Date().toISOString(),
        status: "active",
        ...driveData
      };
      drives[category].push(newDrive);
      return { data: newDrive };
    },

    update: async (category, driveId, updates) => {
      await delay(500);
      drives[category] = drives[category].map(drive =>
        drive.id === driveId ? { ...drive, ...updates } : drive
      );
      return { data: drives[category].find(d => d.id === driveId) };
    },

    remove: async (category, driveId) => {
      await delay(1000);
      drives[category] = drives[category].filter(d => d.id !== driveId);
      return { success: true };
    },

    getStats: async (category, driveId) => {
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
  },

  files: {
    list: async (path) => {
      await delay(300);
      const directory = files[path];
      if (!directory) throw new Error('Directory not found');
      return { data: directory.contents };
    },

    create: async (path, name, type = 'file') => {
      await delay(500);
      const parentDir = path.split('/').slice(0, -1).join('/') || '/';
      if (!files[parentDir]) throw new Error('Parent directory not found');
      
      if (type === 'directory') {
        files[`${path}/${name}`] = { type: 'directory', contents: [] };
      }
      
      files[parentDir].contents.push(name);
      return { success: true };
    },

    delete: async (path) => {
      await delay(500);
      const parentDir = path.split('/').slice(0, -1).join('/') || '/';
      const name = path.split('/').pop();
      
      if (!files[parentDir]) throw new Error('Parent directory not found');
      files[parentDir].contents = files[parentDir].contents.filter(f => f !== name);
      
      if (files[path]) {
        delete files[path];
      }
      
      return { success: true };
    }
  },

  search: async (query) => {
    await delay(700);
    const results = [];
    
    // Simple mock search through files
    Object.entries(files).forEach(([path, data]) => {
      if (data.type === 'directory') {
        data.contents.forEach(item => {
          if (item.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              name: item,
              path: `${path}/${item}`,
              type: files[`${path}/${item}`]?.type || 'file'
            });
          }
        });
      }
    });
    
    return { data: results };
  }
};