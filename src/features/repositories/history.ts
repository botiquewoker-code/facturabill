import {
  clearConversionDraft,
  readConversionDraft,
  readHistory,
  readLastDocumentNumber,
  writeConversionDraft,
  writeHistory,
  writeLastDocumentNumber,
} from "@/features/storage/history";

export type HistoryRepository = {
  readDocuments<T>(): T[];
  saveDocuments<T>(items: T[]): void;
  readConversionDraft<T>(): T | null;
  saveConversionDraft<T>(value: T): void;
  clearConversionDraft(): void;
  readLastNumber(key: string): string;
  saveLastNumber(key: string, value: string): void;
};

export const localHistoryRepository: HistoryRepository = {
  readDocuments: readHistory,
  saveDocuments: writeHistory,
  readConversionDraft,
  saveConversionDraft: writeConversionDraft,
  clearConversionDraft,
  readLastNumber: readLastDocumentNumber,
  saveLastNumber: writeLastDocumentNumber,
};
