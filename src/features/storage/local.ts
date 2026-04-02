export type LocalStoreAdapter<T> = {
  read(): T;
  write(value: T): void;
  clear(): void;
};

type JsonOptions<T> = {
  fallback: T;
  migrate?: (value: unknown) => T;
  onWrite?: (value: T) => void;
  onClear?: () => void;
};

const STORAGE_EVENT_PREFIX = "facturabill:storage:";

function isBrowser() {
  return typeof window !== "undefined";
}

function dispatchStorageEvent(key: string) {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(`${STORAGE_EVENT_PREFIX}${key}`));
}

export function getStorageEventName(key: string) {
  return `${STORAGE_EVENT_PREFIX}${key}`;
}

export function createJsonLocalStore<T>(
  key: string,
  options: JsonOptions<T>,
): LocalStoreAdapter<T> {
  const { fallback, migrate, onWrite, onClear } = options;

  return {
    read() {
      if (!isBrowser()) {
        return fallback;
      }

      const raw = window.localStorage.getItem(key);

      if (!raw) {
        return fallback;
      }

      try {
        const parsed: unknown = JSON.parse(raw);
        const nextValue = migrate ? migrate(parsed) : (parsed as T);

        if (JSON.stringify(nextValue) !== raw) {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        }

        return nextValue;
      } catch {
        return fallback;
      }
    },
    write(value) {
      if (!isBrowser()) {
        return;
      }

      window.localStorage.setItem(key, JSON.stringify(value));
      onWrite?.(value);
      dispatchStorageEvent(key);
    },
    clear() {
      if (!isBrowser()) {
        return;
      }

      window.localStorage.removeItem(key);
      onClear?.();
      dispatchStorageEvent(key);
    },
  };
}

export function createStringLocalStore(
  key: string,
  fallback = "",
): LocalStoreAdapter<string> {
  return {
    read() {
      if (!isBrowser()) {
        return fallback;
      }

      return window.localStorage.getItem(key) ?? fallback;
    },
    write(value) {
      if (!isBrowser()) {
        return;
      }

      window.localStorage.setItem(key, value);
      dispatchStorageEvent(key);
    },
    clear() {
      if (!isBrowser()) {
        return;
      }

      window.localStorage.removeItem(key);
      dispatchStorageEvent(key);
    },
  };
}

export function readLegacyJson<T>(keys: readonly string[], fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  for (const key of keys) {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      continue;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      continue;
    }
  }

  return fallback;
}

export function readLegacyString(keys: readonly string[], fallback = "") {
  if (!isBrowser()) {
    return fallback;
  }

  for (const key of keys) {
    const raw = window.localStorage.getItem(key);

    if (typeof raw === "string" && raw.length > 0) {
      return raw;
    }
  }

  return fallback;
}

export function clearLegacyKeys(keys: readonly string[]) {
  if (!isBrowser()) {
    return;
  }

  keys.forEach((key) => window.localStorage.removeItem(key));
}
