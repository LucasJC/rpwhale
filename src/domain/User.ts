import { writable } from "svelte/store";
import * as waxjs from "@waxio/waxjs/dist";

export const wax = new waxjs.WaxJS(
  "https://wax.greymass.com",
  undefined,
  undefined,
  true
);

export interface IAccountStore {
  account: string;
  loading: boolean;
  error?: string;
  /* this indicates if the user manually inputed the account
   * or if she actually logged in
   */
  isLoggedIn: boolean;
  client: waxjs.WaxJS;
}

const initial: IAccountStore = {
  account: getFromSearch() || "",
  loading: true,
  client: wax,
  isLoggedIn: false,
};

async function start(): Promise<void> {
  console.log(store);
  try {
    store.update((state) => ({ ...state, loading: true }));
    const account = await autoLogin();
    setToSearch(account);
    store.update((state) => ({ ...state, account, isLoggedIn: true }));
  } catch (err) {
    console.error(err);
  } finally {
    store.update((state) => ({ ...state, loading: false }));
  }
}

export const store = writable<IAccountStore>(initial, (_set) => {
  start();
});

//TODO logout???

//checks if autologin is available and calls the normal login function if it is
async function autoLogin(): Promise<string> {
  const isAutoLoginAvailable = await wax.isAutoLoginAvailable();
  if (!isAutoLoginAvailable) {
    throw new Error("cannot autologin");
  }
  const account = await wax.login();
  console.log("autologin worked", account);
  return account as string;
}

//normal login. Triggers a popup for non-whitelisted dapps
export async function login(): Promise<void> {
  try {
    store.update((state) => ({ ...state, loading: true }));
    const account = (await wax.login()) as string;
    store.update((state) => ({ ...state, account, isLoggedIn: true }));
    setToSearch(account);
  } catch (err) {
    console.log(err);
    store.update((state) => ({ ...state, error: err }));
  } finally {
    store.update((state) => ({ ...state, loading: false }));
  }
}

/**
 * get account for query params
 */
export function getFromSearch(): string {
  const search = new URLSearchParams(document.location.search);
  return search.get("account") || "";
}

/**
 * get account for query params
 */
export function setToSearch(account: string): void {
  const search = new URLSearchParams(document.location.search);
  search.set("account", account);
  history.pushState(null, document.title, "?" + search.toString());
}

export function setAccount(account: string): void {
  store.update((state) => ({ ...state, account }));
  setToSearch(account);
}
