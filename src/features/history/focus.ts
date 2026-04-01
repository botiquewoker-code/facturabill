export type HistoryFocusDocument = {
  id?: string;
  numero?: string;
  fecha?: string;
  fechaVencimiento?: string;
};

function normalizeSegment(value: unknown) {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : "none";
}

export function getHistoryDocumentFocusKey(
  document: HistoryFocusDocument,
) {
  return [
    normalizeSegment(document.id),
    normalizeSegment(document.numero),
    normalizeSegment(document.fecha),
    normalizeSegment(document.fechaVencimiento),
  ].join("::");
}
