// context/IvyContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../api';

const IvyContext = createContext();

// Action Types
export const ACTIONS = {
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_DRIVES: 'SET_DRIVES',
  UPDATE_DRIVE: 'UPDATE_DRIVE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_ITEMS: 'SET_SELECTED_ITEMS',
  SET_CURRENT_PATH: 'SET_CURRENT_PATH',
};

const initialState = {
  viewMode: 'grid',
  searchQuery: '',
  drives: {
    local: [],
    remote: [],
    cloud: []
  },
  loading: true,
  error: null,
  selectedItems: [],
  currentPath: '/',
};

function ivyReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ACTIONS.SET_DRIVES:
      return { ...state, drives: action.payload, loading: false };
    case ACTIONS.UPDATE_DRIVE:
      const { category, driveId, data } = action.payload;
      return {
        ...state,
        drives: {
          ...state.drives,
          [category]: state.drives[category].map(drive =>
            drive.id === driveId ? { ...drive, ...data } : drive
          )
        }
      };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_SELECTED_ITEMS:
      return { ...state, selectedItems: action.payload };
    case ACTIONS.SET_CURRENT_PATH:
      return { ...state, currentPath: action.payload };
    default:
      return state;
  }
}

export function IvyProvider({ children }) {
  const [state, dispatch] = useReducer(ivyReducer, initialState);

  // Initial data fetch
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const { data: localDrives } = await api.drives.list('local');
        const { data: remoteDrives } = await api.drives.list('remote');
        const { data: cloudDrives } = await api.drives.list('cloud');

        dispatch({
          type: ACTIONS.SET_DRIVES,
          payload: {
            local: localDrives,
            remote: remoteDrives,
            cloud: cloudDrives
          }
        });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    };

    fetchDrives();
  }, []);

  // Actions
  const actions = {
    setViewMode: (mode) => dispatch({ type: ACTIONS.SET_VIEW_MODE, payload: mode }),
    setSearchQuery: (query) => dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query }),
    updateDrive: (category, driveId, data) => 
      dispatch({ type: ACTIONS.UPDATE_DRIVE, payload: { category, driveId, data } }),
    selectItems: (items) => dispatch({ type: ACTIONS.SET_SELECTED_ITEMS, payload: items }),
    setCurrentPath: (path) => dispatch({ type: ACTIONS.SET_CURRENT_PATH, payload: path }),
    refreshDrives: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const { data: localDrives } = await api.drives.list('local');
        const { data: remoteDrives } = await api.drives.list('remote');
        const { data: cloudDrives } = await api.drives.list('cloud');

        dispatch({
          type: ACTIONS.SET_DRIVES,
          payload: {
            local: localDrives,
            remote: remoteDrives,
            cloud: cloudDrives
          }
        });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    }
  };

  return (
    <IvyContext.Provider value={{ state, actions }}>
      {children}
    </IvyContext.Provider>
  );
}

export const useIvy = () => {
  const context = useContext(IvyContext);
  if (!context) {
    throw new Error('useIvy must be used within an IvyProvider');
  }
  return context;
};