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

export function readStoredHomeVisibility() {
  if (typeof window === "undefined") {
    return DEFAULT_HOME_VISIBILITY;
  }

  return parseHomeVisibility(
    window.localStorage.getItem(HOME_VISIBILITY_STORAGE_KEY),
  );
}

export function writeStoredHomeVisibility(value: HomeVisibility) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedValue = normalizeHomeVisibility(value);
  const serializedValue = serializeHomeVisibility(normalizedValue);

  window.localStorage.setItem(HOME_VISIBILITY_STORAGE_KEY, serializedValue);
  document.cookie = `${HOME_VISIBILITY_COOKIE_KEY}=${encodeURIComponent(serializedValue)}; path=/; max-age=31536000; samesite=lax`;
}
