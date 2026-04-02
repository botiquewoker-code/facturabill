import {
  readCatalogItems,
  writeCatalogItems,
  type CatalogItem,
} from "@/features/catalog/storage";

export type CatalogRepository = {
  readAll(): CatalogItem[];
  saveAll(items: CatalogItem[]): void;
};

export const localCatalogRepository: CatalogRepository = {
  readAll: readCatalogItems,
  saveAll: writeCatalogItems,
};
