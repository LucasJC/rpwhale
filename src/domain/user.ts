import { writable } from "svelte/store";
import * as waxjs from "@waxio/waxjs/dist";

export const wcw = new waxjs.WaxJS(
  "https://wax.greymass.com",
  undefined,
  undefined,
  false
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

async function start(): Promise<void> {
  console.log(userStore);
  try {
    userStore.internal.update((state) => ({ ...state, loading: true }));
    const account = await autoLogin();
    setToSearch(account);
    userStore.internal.update((state) => ({
      ...state,
      account,
      isLoggedIn: true,
    }));
  } catch (err) {
    console.warn(err);
  } finally {
    userStore.internal.update((state) => ({ ...state, loading: false }));
  }
}

function createUserStore() {
  const internalStore = writable<IAccountStore>({
    account: "",
    loading: false,
    client: wcw,
    isLoggedIn: false,
  });
  return {
    subscribe: internalStore.subscribe,
    setAccount: (account: string) => {
      internalStore.update((state) => ({ ...state, account }));
    },
    internal: internalStore,
  };
}

export const userStore = createUserStore();

//TODO logout???

//checks if autologin is available and calls the normal login function if it is
async function autoLogin(): Promise<string> {
  const isAutoLoginAvailable = await wcw.isAutoLoginAvailable();
  if (!isAutoLoginAvailable) {
    throw new Error("cannot autologin");
  }
  const account = await wcw.login();
  console.log("autologin worked", account);
  return account as string;
}

//normal login. Triggers a popup for non-whitelisted dapps
export async function wcwLogin(): Promise<void> {
  try {
    userStore.internal.update((state) => ({ ...state, loading: true }));
    const account = (await wcw.login()) as string;
    userStore.internal.update((state) => ({
      ...state,
      account,
      isLoggedIn: true,
    }));
    setToSearch(account);
  } catch (err) {
    console.log(err);
    userStore.internal.update((state) => ({
      ...state,
      error: err,
      loading: false,
    }));
  } finally {
    userStore.internal.update((state) => ({ ...state, loading: false }));
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
  if (account) {
    search.set("account", account);
    history.pushState(null, document.title, "?" + search.toString());
  } else {
    search.delete("account");
    history.pushState(null, document.title, "/");
  }
}
