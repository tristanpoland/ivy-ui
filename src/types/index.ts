export type DriveCategory = 'local' | 'remote' | 'cloud';

export type DriveStatus = 'active' | 'inactive' | 'error';

export type DriveType = 'Local Machine' | 'Remote Storage' | 'Cloud Storage';

export type DriveColor = 'blue' | 'purple' | 'emerald' | 'rose';

export type DriveIcon = 'Laptop' | 'Server' | 'Cloud';

export interface Drive {
  id: string;
  name: string;
  type: DriveType;
  used: number;
  total: number;
  icon: DriveIcon;
  lastSync: string;
  color: DriveColor;
  status: DriveStatus;
}

export interface DriveStats {
  used: number;
  total: number;
  available: number;
  lastSync: string;
}