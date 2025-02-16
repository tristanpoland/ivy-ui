"use client";
import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { API_CONFIG } from './config';

export const useBackups = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBackups = useCallback(async () => {
    try {
      const { data } = await api.backups.list();
      setBackups(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
    const interval = setInterval(fetchBackups, API_CONFIG.POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchBackups]);

  return { backups, loading, error, refetch: fetchBackups };
};

export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = useCallback(async () => {
    try {
      const { data } = await api.devices.list();
      setDevices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, API_CONFIG.POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  return { devices, loading, error, refetch: fetchDevices };
};

export const useStorage = () => {
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStorage = useCallback(async () => {
    try {
      const { data } = await api.storage.getStats();
      setStorage(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStorage();
    const interval = setInterval(fetchStorage, API_CONFIG.POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStorage]);

  return { storage, loading, error, refetch: fetchStorage };
};

export const useHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = useCallback(async () => {
    try {
      const { data } = await api.health.check();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, API_CONFIG.POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return { health, loading, error, refetch: fetchHealth };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.notifications.list();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.notifications.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.notifications.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, API_CONFIG.POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { 
    notifications, 
    loading, 
    error, 
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  };
};