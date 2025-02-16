"use client";

import React, { useEffect, useState } from 'react';
import { 
  HardDrive, 
  FolderOpen,
  Settings, 
  Users, 
  LayoutGrid,
  List,
  ChevronRight,
  Search,
  Menu,
  Plus,
  MoreVertical,
  Laptop,
  Server,
  Cloud,
  Shield
} from 'lucide-react';
import { useBackups, useDevices, useStorage, useHealth } from './hooks';
import { formatBytes, formatRelativeTime } from './utils';

const DriveCard = ({ 
  id, 
  name, 
  used, 
  total, 
  icon: Icon, 
  type, 
  lastSync, 
  color = "blue",
  onRefresh,
  onRemove 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu) setShowMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  return (
  <div className="bg-neutral-800/40 backdrop-blur-sm rounded-lg border border-neutral-700/50 p-4 hover:bg-neutral-800/60 transition-all duration-200 group">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-md bg-${color}-500/10 text-${color}-400`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-white font-medium">{name}</h3>
          <p className="text-neutral-400 text-sm mt-0.5">{type}</p>
        </div>
      </div>
      <div className="relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical size={18} />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-lg py-1 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh(id);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 text-left"
            >
              Refresh
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 text-left"
            >
              Remove Drive
            </button>
          </div>
        )}
      </div>
    </div>
    
    {/* Storage bar */}
    <div className="mt-4 space-y-1">
      <div className="h-2 w-full bg-neutral-700/50 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-500 rounded-full transition-all duration-300`}
          style={{ width: `${(used / total) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-neutral-400">{formatBytes(used)} used</span>
        <span className="text-neutral-500">{formatBytes(total)}</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-neutral-700/50 text-sm text-neutral-400">
      Last synced {lastSync}
    </div>
  </div>
);
};

const LocationCard = ({ location, devices }) => (
  <div className="space-y-2">
    <h2 className="text-lg text-white font-medium ml-1">{location}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {devices}
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => (
  <div className={`fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800 
    transform transition-transform duration-300 ease-in-out z-40
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
    <div className="p-4 space-y-6">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Shield className="h-8 w-8 text-emerald-500" />
        <span className="text-xl font-semibold text-white">Ivy Vault</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {[
          { icon: HardDrive, label: 'Drives', active: true },
          { icon: FolderOpen, label: 'Files' },
          { icon: Users, label: 'Shared' },
          { icon: Settings, label: 'Settings' },
        ].map((item, i) => (
          <button 
            key={i} 
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg 
              transition-colors ${item.active 
                ? 'text-white bg-neutral-800' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Quick Access */}
      <div>
        <h3 className="text-neutral-400 text-sm font-medium px-3 mb-2">Quick Access</h3>
        <div className="space-y-1">
          {['Documents', 'Images', 'Downloads'].map((label, i) => (
            <button 
              key={i}
              className="w-full flex items-center px-3 py-2 text-sm text-neutral-400 
                hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TopBar = ({ onMenuClick }) => (
  <div className="sticky top-0 z-30 bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800">
    <div className="flex items-center h-16 px-4">
      <button 
        onClick={onMenuClick}
        className="lg:hidden text-neutral-400 hover:text-white p-2 rounded-lg 
          hover:bg-neutral-800 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
      
      {/* Search */}
      <div className="flex-1 px-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search files..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 pl-10 pr-4 
              text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-2 
              focus:ring-emerald-500/50 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button className="text-neutral-400 hover:text-white p-2 rounded-lg 
          hover:bg-neutral-800 transition-colors">
          <LayoutGrid className="h-5 w-5" />
        </button>
        <button className="text-neutral-400 hover:text-white p-2 rounded-lg 
          hover:bg-neutral-800 transition-colors">
          <List className="h-5 w-5" />
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 
          hover:bg-emerald-600 text-white rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">New Drive</span>
        </button>
      </div>
    </div>
  </div>
);

const IvyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { devices } = useDevices();
  const { storage } = useStorage();
  const { health } = useHealth();

  const handleRefreshDrive = async (driveId) => {
    try {
      const category = Object.keys(drives).find(cat => 
        drives[cat].some(drive => drive.id === driveId)
      );
      if (category) {
        const { data } = await api.drives.getStats(category, driveId);
        const updatedDrive = { ...drives[category].find(d => d.id === driveId), ...data };
        // Update the drive in state
        const newDrives = { ...drives };
        newDrives[category] = newDrives[category].map(d => 
          d.id === driveId ? updatedDrive : d
        );
        setDrives(newDrives);
      }
    } catch (error) {
      console.error('Error refreshing drive:', error);
      // You might want to show a toast notification here
    }
  };

  const handleRemoveDrive = async (driveId) => {
    try {
      const category = Object.keys(drives).find(cat => 
        drives[cat].some(drive => drive.id === driveId)
      );
      if (category) {
        await api.drives.remove(category, driveId);
        // Remove the drive from state
        const newDrives = { ...drives };
        newDrives[category] = newDrives[category].filter(d => d.id !== driveId);
        setDrives(newDrives);
      }
    } catch (error) {
      console.error('Error removing drive:', error);
      // You might want to show a toast notification here
    }
  };
  const drives = {
    local: [
      {
        name: "MacBook Pro",
        type: "Local Machine",
        used: 256 * 1024 * 1024 * 1024, // 256GB
        total: 512 * 1024 * 1024 * 1024, // 512GB
        icon: Laptop,
        lastSync: "2 minutes ago",
        color: "blue"
      },
      {
        name: "Windows Workstation",
        type: "Local Machine",
        used: 1.2 * 1024 * 1024 * 1024 * 1024, // 1.2TB
        total: 2 * 1024 * 1024 * 1024 * 1024, // 2TB
        icon: Laptop,
        lastSync: "5 minutes ago",
        color: "purple"
      }
    ],
    remote: [
      {
        name: "Primary Vault",
        type: "Remote Storage",
        used: 3.5 * 1024 * 1024 * 1024 * 1024, // 3.5TB
        total: 8 * 1024 * 1024 * 1024 * 1024, // 8TB
        icon: Server,
        lastSync: "1 minute ago",
        color: "emerald"
      }
    ],
    cloud: [
      {
        name: "Cloud Backup",
        type: "Cloud Storage",
        used: 500 * 1024 * 1024 * 1024, // 500GB
        total: 2 * 1024 * 1024 * 1024 * 1024, // 2TB
        icon: Cloud,
        lastSync: "30 seconds ago",
        color: "rose"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Local Drives */}
          <LocationCard 
            location="Local Drives"
            devices={drives.local.map((drive, i) => (
              <DriveCard 
                key={i} 
                {...drive} 
                onRefresh={handleRefreshDrive} 
                onRemove={handleRemoveDrive} 
              />
            ))}
          />

          {/* Remote Storage */}
          <LocationCard 
            location="Remote Storage"
            devices={drives.remote.map((drive, i) => (
              <DriveCard key={i} {...drive} />
            ))}
          />

          {/* Cloud Storage */}
          <LocationCard 
            location="Cloud Storage"
            devices={drives.cloud.map((drive, i) => (
              <DriveCard key={i} {...drive} />
            ))}
          />
        </main>
      </div>
    </div>
  );
};

export default IvyDashboard;