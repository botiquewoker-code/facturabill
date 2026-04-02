import { createJsonLocalStore } from "@/features/storage/local";

export const HOME_VISIBILITY_STORAGE_KEY = "facturabill-home-visibility";
export const HOME_VISIBILITY_COOKIE_KEY = "facturabill-home-visibility";

export type HomeVisibilityKey =
  | "search"
  | "heroVisual"
  | "insights"
  | "quickActions";

export type HomeVisibility = Record<HomeVisibilityKey, boolean>;

export const DEFAULT_HOME_VISIBILITY: HomeVisibility = {
  search: true,
  heroVisual: true,
  insights: true,
  quickActions: true,
};

function normalizeHomeVisibility(
  value: Partial<HomeVisibility> | null | undefined,
): HomeVisibility {
  if (!value) {
    return DEFAULT_HOME_VISIBILITY;
  }

  return {
    search:
      typeof value.search === "boolean"
        ? value.search
        : DEFAULT_HOME_VISIBILITY.search,
    heroVisual:
      typeof value.heroVisual === "boolean"
        ? value.heroVisual
        : DEFAULT_HOME_VISIBILITY.heroVisual,
    insights:
      typeof value.insights === "boolean"
        ? value.insights
        : DEFAULT_HOME_VISIBILITY.insights,
    quickActions:
      typeof value.quickActions === "boolean"
        ? value.quickActions
        : DEFAULT_HOME_VISIBILITY.quickActions,
  };
}

export function parseHomeVisibility(raw?: string | null): HomeVisibility {
  if (!raw?.trim()) {
    return DEFAULT_HOME_VISIBILITY;
  }

  try {
    return normalizeHomeVisibility(JSON.parse(raw));
  } catch {
    return DEFAULT_HOME_VISIBILITY;
  }
}

export function parseHomeVisibilityCookie(raw?: string | null) {
  if (!raw?.trim()) {
    return DEFAULT_HOME_VISIBILITY;
  }

  try {
    return parseHomeVisibility(decodeURIComponent(raw));
  } catch {
    return DEFAULT_HOME_VISIBILITY;
  }
}

export function serializeHomeVisibility(value: HomeVisibility) {
  return JSON.stringify(normalizeHomeVisibility(value));
}

const homeVisibilityStore = createJsonLocalStore<HomeVisibility>(
  HOME_VISIBILITY_STORAGE_KEY,
  {
    fallback: DEFAULT_HOME_VISIBILITY,
    migrate(value) {
      return normalizeHomeVisibility(
        value && typeof value === "object"
          ? (value as Partial<HomeVisibility>)
          : null,
      );
    },
    onWrite(value) {
      const serializedValue = encodeURIComponent(serializeHomeVisibility(value));
      document.cookie = `${HOME_VISIBILITY_COOKIE_KEY}=${serializedValue}; path=/; max-age=31536000; samesite=lax`;
    },
  },
);

export function readStoredHomeVisibility() {
  return homeVisibilityStore.read();
}

export function writeStoredHomeVisibility(value: HomeVisibility) {
  homeVisibilityStore.write(normalizeHomeVisibility(value));
}
