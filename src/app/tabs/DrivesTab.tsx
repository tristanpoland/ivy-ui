import React, { useEffect } from 'react';
import { 
  HardDrive, 
  Laptop,
  Server,
  Cloud,
  MoreVertical,
} from 'lucide-react';
import { useDriveContext } from '@/context/DriveContext';
import { formatBytes, formatRelativeTime, clsx } from '@/lib/utils';
import type { Drive, DriveCategory } from '@/types';
import { api } from '@/lib/api';

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
  const [showMenu, setShowMenu] = React.useState(false);
  const { dispatch } = useDriveContext();
  
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

  const handleRefresh = async () => {
    try {
      const { data } = await api.drives.getStats(category, id);
      dispatch({
        type: 'UPDATE_DRIVE',
        payload: {
          category,
          driveId: id,
          updates: data
        }
      });
    } catch (error) {
      console.error('Error refreshing drive:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await api.drives.remove(category, id);
      dispatch({
        type: 'REMOVE_DRIVE',
        payload: {
          category,
          driveId: id
        }
      });
    } catch (error) {
      console.error('Error removing drive:', error);
    }
  };

  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-lg border border-neutral-700/50 p-4 hover:bg-neutral-800/60 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={
            color === 'blue' ? 'p-2.5 rounded-md bg-blue-500/10 text-blue-400' :
            color === 'purple' ? 'p-2.5 rounded-md bg-purple-500/10 text-purple-400' :
            color === 'emerald' ? 'p-2.5 rounded-md bg-emerald-500/10 text-emerald-400' :
            'p-2.5 rounded-md bg-rose-500/10 text-rose-400'
          }>
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
                  handleRefresh();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 text-left"
              >
                Refresh
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
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
            className={
              color === 'blue' ? 'h-full rounded-full transition-all duration-300 bg-blue-500' :
              color === 'purple' ? 'h-full rounded-full transition-all duration-300 bg-purple-500' :
              color === 'emerald' ? 'h-full rounded-full transition-all duration-300 bg-emerald-500' :
              'h-full rounded-full transition-all duration-300 bg-rose-500'
            }
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

export function DrivesTab() {
  const { state, dispatch } = useDriveContext();

  useEffect(() => {
    const fetchDrives = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [localDrives, remoteDrives, cloudDrives] = await Promise.all([
          api.drives.list('local'),
          api.drives.list('remote'),
          api.drives.list('cloud')
        ]);

        dispatch({
          type: 'SET_DRIVES',
          payload: {
            local: localDrives.data,
            remote: remoteDrives.data,
            cloud: cloudDrives.data
          }
        });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch drives' });
      }
    };

    fetchDrives();
  }, [dispatch]);

  if (state.loading) {
    return <div className="text-white">Loading drives...</div>;
  }

  if (state.error) {
    return <div className="text-red-500">{state.error}</div>;
  }

  return (
    <div className="space-y-6">
      <LocationSection category="local" title="Local Drives" />
      <LocationSection category="remote" title="Remote Storage" />
      <LocationSection category="cloud" title="Cloud Storage" />
    </div>
  );
}