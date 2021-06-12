/**
 * set value for given key, preserving current search
 */
export function updateSearch(key: string, value?: string): void {
  const currentSearch = document.location.search;
  const search = new URLSearchParams(currentSearch);
  if (!value && !currentSearch) {
    search.delete(key);
    clearSearch();
  } else {
    if (value) {
      search.set(key, value);
    }
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
