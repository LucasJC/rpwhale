import { writable } from "svelte/store";

export interface IPoolFilters {
  collection: string;
  schema: string;
  rarity: string;
  minYield?: number;
}

export const defaultPoolFilters: IPoolFilters = {
  collection: "",
  schema: "",
  rarity: "",
};

export const poolFilters = writable<IPoolFilters>(
  { ...defaultPoolFilters },
  (set) => {
    set({
      ...defaultPoolFilters,
      collection: getFromSearch("collection") || defaultPoolFilters.collection,
      schema: getFromSearch("schema") || defaultPoolFilters.schema,
      rarity: getFromSearch("rarity") || defaultPoolFilters.rarity,
      minYield: Number(
        getFromSearch("minYield") || defaultPoolFilters.minYield
      ),
    });
  }
);

export function setPoolFilters(filters: Partial<IPoolFilters>): void {
  Object.entries(filters).forEach(([key, value]) => {
    updateSearch(key, value);
  });

  poolFilters.update((prev) => ({ ...prev, ...filters }));
}

/**
 * set value for given key, preserving current search
 */
export function updateSearch(key: string, value?: string | number): void {
  let currentSearch = document.location.search;
  const search = new URLSearchParams(currentSearch);
  if (!value || value === "") {
    search.delete(key);
  } else {
    search.set(key, value?.toString());
  }
  currentSearch = search.toString();
  if (!currentSearch || currentSearch === "") {
    clearSearch();
  } else {
    history.pushState(
      null,
      document.title,
      document.location.pathname + "?" + search.toString()
    );
  }
}

/**
 * clear current search
 */
export function clearSearch(): void {
  history.pushState(null, document.title, document.location.pathname);
}

/**
 * @param key
 * @returns value for given key
 */
export function getFromSearch(key: string): string | undefined {
  const currentSearch = document.location.search;
  const params = new URLSearchParams(currentSearch);
  const value = params.get(key);
  return null !== value ? value : undefined;
}
