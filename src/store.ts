import {
  readable,
  Subscriber,
  writable,
  derived,
  Readable,
} from "svelte/store";
import type { ListingAsset } from "./dal/am";
import am from "./dal/am";
import { getCurrencyBalance } from "./dal/wax";
import * as Balance from "./domain/Balance";
import * as Asset from "./domain/Asset";
import {
  getAccountAssets,
  getAlcorPrice,
  getWaxPriceInUSD,
} from "./integration";
import { ALCOR_MARKET, AtomicAsset } from "./types";

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
    const search = new URLSearchParams(document.location.search);
    return search.get("account") || "";
  },

  /**
   * get account for query params
   */
  set(account: string): void {
    const search = new URLSearchParams(document.location.search);
    search.set("account", account);
    history.pushState(null, document.title, "?" + search.toString());
  },
};

export const account = writable<string>(accountQueryParams.get());

export const currencyBalance: Readable<Array<Balance.CalculatedBalance>> =
  derived(
    account,
    ($account, set) => {
      getCurrencyBalance($account).then((balance) =>
        set(Balance.calcBalances(balance || []))
      );
    },
    [] as Array<Balance.CalculatedBalance>
  );

export const accountAssets: Readable<Array<AtomicAsset>> = derived(
  account,
  ($account, set) => {
    getAccountAssets($account).then((assets) => set(assets || []));
  },
  [] as Array<AtomicAsset>
);

export const accountLands: Readable<Array<ListingAsset>> = derived(
  accountAssets,
  ($accountAssets, set) => {
    async function doWork(): Promise<void> {
      const lands = Asset.getLands($accountAssets);
      const landAssets = await Promise.all(
        lands.map((land) => am.getAsset(land.asset_id))
      );
      set(landAssets || []);
    }

    doWork();
  },
  [] as Array<ListingAsset>
);

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
    },
  };
}
export const nightMode = createNightMode();

export const waxPrice = readable(0.0, function start(set) {
  getWaxPriceInUSD().then((wp) => set(wp.wax.usd));
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

function setAlcorPriceWithInterval(
  market: ALCOR_MARKET,
  set: Subscriber<number>,
  frequence: number = 10000
) {
  getAlcorPrice(market).then((ap) => set(ap.last_price));
  const interval = setInterval(() => {
    getAlcorPrice(market).then((ap) => set(ap.last_price));
  }, frequence);
  return function stop() {
    clearInterval(interval);
  };
}

export interface IPricesInWax {
  AETHER: number;
  CAPON: number;
  ENEFT: number;
  WAXON: number;
  WECAN: number;
}

export const pricesInWax: Readable<IPricesInWax> = derived(
  [aetherPrice, caponPrice, eneftPrice, waxonPrice, wecanPrice],
  ([$aetherPrice, $caponPrice, $eneftPrice, $waxonPrice, $wecanPrice]) => {
    return {
      AETHER: $aetherPrice,
      CAPON: $caponPrice,
      ENEFT: $eneftPrice,
      WAXON: $waxonPrice,
      WECAN: $wecanPrice,
    };
  }
);
