export type DeliveryDetails = {
  location: string;
  deliveredBy: string;
  receivedBy: string;
  receivedById: string;
  deliveryNotes: string;
};

export const EMPTY_DELIVERY_DETAILS: DeliveryDetails = {
  location: "",
  deliveredBy: "",
  receivedBy: "",
  receivedById: "",
  deliveryNotes: "",
};

function toStringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function normalizeDeliveryDetails(value: unknown): DeliveryDetails {
  const record =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    location: toStringValue(record.location),
    deliveredBy: toStringValue(record.deliveredBy),
    receivedBy: toStringValue(record.receivedBy),
    receivedById: toStringValue(record.receivedById),
    deliveryNotes: toStringValue(record.deliveryNotes),
  };
}

export function hasDeliveryDetailsContent(details: DeliveryDetails) {
  return Object.values(details).some((value) => value.trim());
}
