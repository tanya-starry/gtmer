import { useState, useEffect, useCallback } from "react";

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "gtm_documents";

function loadDocuments(): Document[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveDocuments(docs: Document[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function countChars(content: string): number {
  return content.replace(/\s/g, "").length;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(loadDocuments);

  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  const createDocument = useCallback((title: string, content: string) => {
    const now = new Date().toISOString();
    const newDoc: Document = {
      id: generateId(),
      title: title.trim() || "未命名文档",
      content,
      createdAt: now,
      updatedAt: now,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc.id;
  }, []);

  const updateDocument = useCallback((id: string, title: string, content: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, title: title.trim() || doc.title, content, updatedAt: new Date().toISOString() }
          : doc
      )
    );
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  const getDocument = useCallback(
    (id: string) => documents.find((doc) => doc.id === id),
    [documents]
  );

  return {
    documents,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    countChars,
    formatDate,
  };
}
