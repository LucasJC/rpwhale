import { readable, Subscriber, writable } from 'svelte/store';
import { getAlcorPrice, getWaxPriceInUSD } from './integration';
import { ALCOR_MARKET } from './types';


/**
 * account will be extracted from query params,
 * I didn't found a svelte/store mechanism to introduce these
 * side effects in it
 */
export const accountQueryParams = {
  /**
  * get account for query params
  */
  get(): string {
    const search = new URLSearchParams(document.location.search)
    return search.get("account")
  },

  /**
  * get account for query params
  */
  set(account: string): void {
    const search = new URLSearchParams(document.location.search)
    search.set("account", account)
    history.pushState(null, null, "?" + search.toString());
  }
}

export const account = writable<string>(accountQueryParams.get());

export const miningPower = writable(0.0);

function createNightMode() {
  const enabled = localStorage.getItem("dark-mode") || "false";
  const { subscribe, set } = writable(enabled === "true");
  return {
    subscribe,
    toggle: () => {
      const on = localStorage.getItem("dark-mode") || "false";
      if (on == "true") {
        localStorage.setItem("dark-mode", "false"); 
        set(false);
      } else {
        localStorage.setItem("dark-mode", "true");
        set(true);
      }
    }
  };
}
export const nightMode = createNightMode();

export const waxPrice = readable(0.0, function start(set) {
  getWaxPriceInUSD().then(wp => set(wp.wax.usd));
});

export const aetherPrice = readable(0.0, function start(set) {
  return setAlcorPriceWithInterval(ALCOR_MARKET.AETHER, set);
});

export const wecanPrice = readable(0.0, function start(set) {
  return setAlcorPriceWithInterval(ALCOR_MARKET.WECAN, set);
});

export const caponPrice = readable(0.0, function start(set) {
  return setAlcorPriceWithInterval(ALCOR_MARKET.CAPON, set);
});

export const waxonPrice = readable(0.0, function start(set) {
  return setAlcorPriceWithInterval(ALCOR_MARKET.WAXON, set);
});

export const eneftPrice = readable(0.0, function start(set) {
  return setAlcorPriceWithInterval(ALCOR_MARKET.ENEFT, set);
});

function setAlcorPriceWithInterval(market: ALCOR_MARKET, set: Subscriber<number>, frequence: number = 10000)  {
  getAlcorPrice(market).then(ap => set(ap.last_price));
  const interval = setInterval(() => {
    getAlcorPrice(market).then(ap => set(ap.last_price));
  }, frequence);
  return function stop() {
    clearInterval(interval);
  };
}
