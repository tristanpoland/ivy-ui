// config.js
export const API_CONFIG = {
    BASE_URL: 'https://api.ivybackup.com/v1',
    ENDPOINTS: {
      BACKUPS: '/backups',
      DEVICES: '/devices',
      STORAGE: '/storage',
      HEALTH: '/health',
      NOTIFICATIONS: '/notifications'
    },
    POLLING_INTERVAL: 30000, // 30 seconds
  };
  
  // Mock data for development
  export const MOCK_DATA = {
    backups: [
      {
        id: 'bkp-001',
        timestamp: new Date().toISOString(),
        status: 'in_progress',
        department: 'Marketing',
        size: 242000000000,
        type: 'full',
        deviceId: 'dev-001'
      },
      {
        id: 'bkp-002',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'completed',
        department: 'Design',
        size: 156000000000,
        type: 'incremental',
        deviceId: 'dev-002'
      }
    ],
    devices: [
      { id: 'dev-001', name: 'Marketing-MBP-1', status: 'active', lastSeen: new Date().toISOString() },
      { id: 'dev-002', name: 'Design-MBP-2', status: 'active', lastSeen: new Date().toISOString() },
      { id: 'dev-003', name: 'Dev-PC-1', status: 'inactive', lastSeen: new Date(Date.now() - 86400000).toISOString() }
    ],
    notifications: [
      { id: 'not-001', title: 'Backup Complete', message: 'Marketing assets successfully backed up', timestamp: new Date(Date.now() - 120000).toISOString(), read: false },
      { id: 'not-002', title: 'Storage Alert', message: 'Approaching 85% capacity', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
      { id: 'not-003', title: 'New Device', message: 'Design-MBP-2 connected to vault', timestamp: new Date(Date.now() - 10800000).toISOString(), read: true }
    ],
    storage: {
      total: 2199023255552, // 2 TB
      used: 1099511627776,  // 1 TB
      reserved: 109951162777 // 100 GB
    },
    health: {
      score: 98,
      lastCheck: new Date().toISOString(),
      issues: []
    }
  };