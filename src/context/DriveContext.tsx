// src/context/DriveContext.tsx
'use client';

import React, { createContext, useContext, useReducer } from 'react';
import type { Drive, DriveCategory } from '../types';

type TabId = 'drives' | 'files' | 'shared' | 'settings';

interface DriveState {
  drives: Record<DriveCategory, Drive[]>;
  loading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  activeTab: TabId;
}

type DriveAction =
  | { type: 'SET_DRIVES'; payload: Record<DriveCategory, Drive[]> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: TabId }
  | { type: 'UPDATE_DRIVE'; payload: { category: DriveCategory; driveId: string; updates: Partial<Drive> } }
  | { type: 'REMOVE_DRIVE'; payload: { category: DriveCategory; driveId: string } };

const initialState: DriveState = {
  drives: {
    local: [],
    remote: [],
    cloud: []
  },
  loading: false,
  error: null,
  viewMode: 'grid',
  searchQuery: '',
  activeTab: 'drives'
};

function driveReducer(state: DriveState, action: DriveAction): DriveState {
  switch (action.type) {
    case 'SET_DRIVES':
      return { ...state, drives: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_ACTIVE_TAB':
      console.log('Switching to tab:', action.payload); // Debug log
      return { ...state, activeTab: action.payload };
    case 'UPDATE_DRIVE':
      return {
        ...state,
        drives: {
          ...state.drives,
          [action.payload.category]: state.drives[action.payload.category].map(drive =>
            drive.id === action.payload.updates.id
              ? { ...drive, ...action.payload.updates }
              : drive
          )
        }
      };
    case 'REMOVE_DRIVE':
      return {
        ...state,
        drives: {
          ...state.drives,
          [action.payload.category]: state.drives[action.payload.category].filter(
            drive => drive.id !== action.payload.driveId
          )
        }
      };
    default:
      return state;
  }
}

const DriveContext = createContext<{
  state: DriveState;
  dispatch: React.Dispatch<DriveAction>;
} | null>(null);

export function DriveProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(driveReducer, initialState);

  return (
    <DriveContext.Provider value={{ state, dispatch }}>
      {children}
    </DriveContext.Provider>
  );
}

export function useDriveContext() {
  const context = useContext(DriveContext);
  if (!context) {
    throw new Error('useDriveContext must be used within a DriveProvider');
  }
  return context;
}