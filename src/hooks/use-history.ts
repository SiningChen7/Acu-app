"use client";

import { useState, useEffect } from 'react';

export interface HistoryItem {
    id: string;
    timestamp: number;
    originalPrompt: string;
    targetModel: string;
    optimizedPrompt: string; // Storing the full result text for simplicity
}

const HISTORY_KEY = 'acu_history';

export function useHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                // ignore
            }
        }
    }, []);

    const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
        const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        const updated = [newItem, ...history]; // Prepend
        setHistory(updated);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    };

    const removeItem = (id: string) => {
        const updated = history.filter((item) => item.id !== id);
        setHistory(updated);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    };

    return { history, addToHistory, clearHistory, removeItem };
}
