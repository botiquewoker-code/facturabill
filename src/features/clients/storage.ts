import { createJsonLocalStore } from "@/features/storage/local";

export const CLIENTS_STORAGE_KEY = "clientes";

export type ClientDraft = {
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
};

export type ClientRecord = ClientDraft & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export function createEmptyClientDraft(): ClientDraft {
  return {
    nombre: "",
    nif: "",
    email: "",
    telefono: "",
    direccion: "",
    codigoPostal: "",
    ciudad: "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function createClientId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createClientRecord(
  value: Partial<ClientDraft>,
  seed?: Partial<ClientRecord>,
  options?: {
    preserveUpdatedAt?: boolean;
  },
): ClientRecord {
  const now = new Date().toISOString();

  return {
    id: sanitizeString(seed?.id) || createClientId(),
    nombre: sanitizeString(value.nombre).trim(),
    nif: sanitizeString(value.nif).trim(),
    email: sanitizeString(value.email).trim(),
    telefono: sanitizeString(value.telefono).trim(),
    direccion: sanitizeString(value.direccion).trim(),
    codigoPostal: sanitizeString(value.codigoPostal).trim(),
    ciudad: sanitizeString(value.ciudad).trim(),
    createdAt: sanitizeString(seed?.createdAt) || now,
    updatedAt: options?.preserveUpdatedAt
      ? sanitizeString(seed?.updatedAt) || now
      : now,
  };
}

export function normalizeClient(value: unknown): ClientRecord {
  if (!isRecord(value)) {
    return createClientRecord(createEmptyClientDraft());
  }

  return createClientRecord(
    {
      nombre: sanitizeString(value.nombre),
      nif: sanitizeString(value.nif),
      email: sanitizeString(value.email),
      telefono: sanitizeString(value.telefono),
      direccion: sanitizeString(value.direccion),
      codigoPostal: sanitizeString(value.codigoPostal),
      ciudad: sanitizeString(value.ciudad),
    },
    {
      id: sanitizeString(value.id),
      createdAt: sanitizeString(value.createdAt),
      updatedAt: sanitizeString(value.updatedAt),
    },
    {
      preserveUpdatedAt: true,
    },
  );
}

const clientsStore = createJsonLocalStore<ClientRecord[]>(CLIENTS_STORAGE_KEY, {
  fallback: [],
  migrate(value) {
    return Array.isArray(value) ? value.map(normalizeClient) : [];
  },
});

export function writeClients(clients: ClientRecord[]) {
  clientsStore.write(clients.map(normalizeClient));
}

export function readClients(): ClientRecord[] {
  return clientsStore.read();
}

export function normalizeRouteParam(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

export function findClientById(
  clients: ClientRecord[],
  clientId: string,
): { client: ClientRecord | null; index: number } {
  const exactMatchIndex = clients.findIndex((client) => client.id === clientId);

  if (exactMatchIndex >= 0) {
    return { client: clients[exactMatchIndex], index: exactMatchIndex };
  }

  if (/^\d+$/.test(clientId)) {
    const legacyIndex = Number.parseInt(clientId, 10);
    const legacyClient = clients[legacyIndex];

    if (legacyClient) {
      return { client: legacyClient, index: legacyIndex };
    }
  }

  return { client: null, index: -1 };
}

export function hasDuplicateTaxId(
  clients: ClientRecord[],
  nif: string,
  excludeId?: string,
): boolean {
  const normalizedNif = nif.trim().toLowerCase();

  if (!normalizedNif) {
    return false;
  }

  return clients.some(
    (client) =>
      client.id !== excludeId &&
      client.nif.trim().toLowerCase() === normalizedNif,
  );
}

export function toClientDraft(client: ClientRecord | ClientDraft): ClientDraft {
  return {
    nombre: client.nombre,
    nif: client.nif,
    email: client.email,
    telefono: client.telefono,
    direccion: client.direccion,
    codigoPostal: client.codigoPostal,
    ciudad: client.ciudad,
  };
}
