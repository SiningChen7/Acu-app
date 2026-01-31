"use client";

import { useState, useEffect, useCallback } from 'react';

export interface ApiKeys {
  anthropic: string;
  openai: string;
  google: string;
  openrouter: string;
  optimizerModel: string; // 'auto', 'claude', 'openai', 'gemini', 'openrouter'
}

const STORAGE_KEY = 'acu_api_keys';
const EVENT_KEY = 'acu_settings_updated';

export function useSettings() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    anthropic: '',
    openai: '',
    google: '',
    openrouter: '',
    optimizerModel: 'auto',
  });
  const [loading, setLoading] = useState(true);

  const loadKeys = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setApiKeys({
          anthropic: parsed.anthropic || '',
          openai: parsed.openai || '',
          google: parsed.google || '',
          openrouter: parsed.openrouter || '',
          optimizerModel: parsed.optimizerModel || 'auto',
        });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadKeys();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadKeys();
    };

    const handleCustomEvent = () => loadKeys();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(EVENT_KEY, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(EVENT_KEY, handleCustomEvent);
    };
  }, [loadKeys]);

  const saveKeys = (newKeys: ApiKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newKeys));
    window.dispatchEvent(new Event(EVENT_KEY));
  };

  const hasAnyKey = !!(apiKeys.anthropic || apiKeys.openai || apiKeys.google || apiKeys.openrouter);

  return { apiKeys, saveKeys, hasAnyKey, loading };
}
