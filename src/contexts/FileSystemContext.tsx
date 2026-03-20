"use client";

import React, { createContext, useContext, useRef } from 'react';
import { createFileSystem, type FileSystemInstance } from '../hooks/useFileSystem';

const FileSystemContext = createContext<FileSystemInstance | null>(null);

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
    const fsRef = useRef<FileSystemInstance | null>(null);
    if (!fsRef.current) {
        fsRef.current = createFileSystem();
    }

    return (
        <FileSystemContext.Provider value={fsRef.current}>
            {children}
        </FileSystemContext.Provider>
    );
}

export function useFS(): FileSystemInstance {
    const ctx = useContext(FileSystemContext);
    if (!ctx) throw new Error('useFS must be used within FileSystemProvider');
    return ctx;
}
