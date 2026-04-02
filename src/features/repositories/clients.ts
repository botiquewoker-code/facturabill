import {
  readClients,
  writeClients,
  type ClientRecord,
} from "@/features/clients/storage";

export type ClientRepository = {
  readAll(): ClientRecord[];
  saveAll(clients: ClientRecord[]): void;
};

export const localClientRepository: ClientRepository = {
  readAll: readClients,
  saveAll: writeClients,
};
