import { writable } from "svelte/store";
import * as waxjs from "@waxio/waxjs/dist";

export const store = writable<string>(getFromSearch(), (set) => {
  autoLogin().then((account) => {
    set(account);
    setToSearch(account);
  }, console.error);
});

export const wax = new waxjs.WaxJS(
  "https://wax.greymass.com",
  undefined,
  undefined,
  true
);

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
  const account = await wax.login();
  set(account as string);
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

export function set(account: string): void {
  store.set(account);
  setToSearch(account);
}
