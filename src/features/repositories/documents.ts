import {
  findEditableDocumentById,
  readEditableDocuments,
  upsertEditableDocument,
  writeEditableDocuments,
  type EditableDocumentRecord,
} from "@/features/documents/storage";

export type DocumentRepository = {
  readAll(): EditableDocumentRecord[];
  readById(documentId: string): EditableDocumentRecord | null;
  saveAll(records: EditableDocumentRecord[]): void;
  upsert(record: EditableDocumentRecord): EditableDocumentRecord;
};

export const localDocumentRepository: DocumentRepository = {
  readAll: readEditableDocuments,
  readById: findEditableDocumentById,
  saveAll: writeEditableDocuments,
  upsert: upsertEditableDocument,
};
