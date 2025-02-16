'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield,
  HardDrive, 
  FolderOpen,
  Settings, 
  Users, 
  LayoutGrid,
  List,
  Search,
  Menu,
  Plus,
  MoreVertical,
  Laptop,
  Server,
  Cloud
} from 'lucide-react';
import { DriveProvider, useDriveContext } from '../context/DriveContext';
import { formatBytes, formatRelativeTime, clsx } from '../lib/utils';
import type { Drive, DriveCategory } from '../types';

const DriveCard = ({ 
  id, 
  name, 
  used, 
  total, 
  icon, 
  type, 
  lastSync, 
  color = "blue",
  category
}: Drive & { category: DriveCategory }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { actions } = useDriveContext();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenu) setShowMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const IconComponent = (() => {
    switch (icon) {
      case 'Laptop': return Laptop;
      case 'Server': return Server;
      case 'Cloud': return Cloud;
      default: return HardDrive;
    }
  })();

  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-lg border border-neutral-700/50 p-4 hover:bg-neutral-800/60 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-md bg-${color}-500/10 text-${color}-400`}>
            <IconComponent size={20} />
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
                  actions.refreshDrives();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 text-left"
              >
                Refresh
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actions.removeDrive(category, id);
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
        Last synced {formatRelativeTime(lastSync)}
      </div>
    </div>
  );
};

const LocationSection = ({ category, title }: { category: DriveCategory; title: string }) => {
  const { state } = useDriveContext();
  const drives = state.drives[category];

  if (!drives?.length) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg text-white font-medium ml-1">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drives.map(drive => (
          <DriveCard key={drive.id} {...drive} category={category} />
        ))}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { state, dispatch } = useDriveContext();
  
  const tabs = [
    { id: 'drives', icon: HardDrive, label: 'Drives' },
    { id: 'files', icon: FolderOpen, label: 'Files' },
    { id: 'shared', icon: Users, label: 'Shared' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const quickAccessItems = [
    { id: 'documents', label: 'Documents', path: '/documents' },
    { id: 'images', label: 'Images', path: '/images' },
    { id: 'downloads', label: 'Downloads', path: '/downloads' },
  ];

  return (
    <div className={clsx(
      "fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800",
      "transform transition-transform duration-300 ease-in-out z-40",
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    )}>
      <div className="p-4 space-y-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-emerald-500" />
          <span className="text-xl font-semibold text-white">Ivy Vault</span>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button 
              key={id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: id })}
              className={clsx(
                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                state.activeTab === id 
                  ? 'text-white bg-neutral-800' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>

        {/* Quick Access Section */}
        <div>
          <h3 className="text-neutral-400 text-sm font-medium px-3 mb-2">
            Quick Access
          </h3>
          <div className="space-y-1">
            {quickAccessItems.map(({ id, label, path }) => (
              <button 
                key={id}
                onClick={() => {
                  dispatch({ type: 'SET_ACTIVE_TAB', payload: 'files' });
                  // You could also dispatch a SET_CURRENT_PATH action here if needed
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-neutral-400 
                  hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile close button - only shown on small screens */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-neutral-400 
            hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { state, dispatch } = useDriveContext();

  return (
    <div className="sticky top-0 z-30 bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="flex items-center h-16 px-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-neutral-400 hover:text-white p-2 rounded-lg 
            hover:bg-neutral-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex-1 px-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search files..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 pl-10 pr-4 
                text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-2 
                focus:ring-emerald-500/50 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })}
            className={clsx(
              "text-neutral-400 hover:text-white p-2 rounded-lg transition-colors",
              state.viewMode === 'grid' ? 'bg-neutral-800' : 'hover:bg-neutral-800'
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })}
            className={clsx(
              "text-neutral-400 hover:text-white p-2 rounded-lg transition-colors",
              state.viewMode === 'list' ? 'bg-neutral-800' : 'hover:bg-neutral-800'
            )}
          >
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
};

import { FilesTab } from './tabs/FilesTab';
import { SharedTab } from './tabs/SharedTab';
import { SettingsTab } from './tabs/SettingsTab';
import { DrivesTab } from './tabs/DrivesTab';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state } = useDriveContext();

  const renderContent = () => {
    switch (state.activeTab) {
      case 'drives':
        return <DrivesTab />;
      case 'files':
        return <FilesTab />;
      case 'shared':
        return <SharedTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return (
          <div className="space-y-6">
            No such tab found: {state.activeTab}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;