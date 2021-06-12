import { ALCOR_MARKET, getAlcorPrice } from "../dal/alcor";
import { getWaxPriceInUSD } from "../dal/coingecko";
import { derived, Readable, readable, Subscriber } from "svelte/store";

const DEFAULT_INTERVAL_FREQ = 10000;

export const waxPrice = readable(0.0, function start(set) {
  getWaxPriceInUSD().then((wp) => set(wp.wax.usd));
  const interval = setInterval(() => {
    getWaxPriceInUSD().then((wp) => set(wp.wax.usd));
  }, DEFAULT_INTERVAL_FREQ);
  return function stop() {
    clearInterval(interval);
  };
});

/**
 * get price in wax for a given token,
 * we are pretty flexible with the key you pass in.
 */
export function getRPlanetPrice(
  prices: IPricesInWax,
  currency: string
): number {
  const cur = currency.toUpperCase();
  if (cur.includes("AETHER")) {
    return prices.AETHER;
  }
  if (cur.includes("CAPON")) {
    return prices.CAPON;
  }
  if (cur.includes("ENEFT")) {
    return prices.CAPON;
  }
  if (cur.includes("WAXON")) {
    return prices.WAXON;
  }
  if (cur.includes("WECAN")) {
    return prices.WECAN;
  }
  console.warn("Price not found", currency, prices);
  return 0;
}

export interface IPricesInWax {
  AETHER: number;
  CAPON: number;
  ENEFT: number;
  WAXON: number;
  WECAN: number;
}

export function format(input: any): string {
  let numberToFormat = 0;
  if (input && (typeof input === "number" || input instanceof Number)) {
    numberToFormat = input as number;
  } else if (input && (typeof input === "string" || input instanceof String)) {
    numberToFormat = Number.parseFloat(input as string);
  }
  const result = numberToFormat.toLocaleString("en-us", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  console.log({
    message: "format",
    input,
    result,
  });
  return result;
}

const aetherPrice = readable(0.0, function start(set) {
  return _setAlcorPriceWithInterval(ALCOR_MARKET.AETHER, set);
});

const wecanPrice = readable(0.0, function start(set) {
  return _setAlcorPriceWithInterval(ALCOR_MARKET.WECAN, set);
});

const caponPrice = readable(0.0, function start(set) {
  return _setAlcorPriceWithInterval(ALCOR_MARKET.CAPON, set);
});

const waxonPrice = readable(0.0, function start(set) {
  return _setAlcorPriceWithInterval(ALCOR_MARKET.WAXON, set);
});

const eneftPrice = readable(0.0, function start(set) {
  return _setAlcorPriceWithInterval(ALCOR_MARKET.ENEFT, set);
});

function _setAlcorPriceWithInterval(
  market: ALCOR_MARKET,
  set: Subscriber<number>,
  frequence = DEFAULT_INTERVAL_FREQ
) {
  getAlcorPrice(market).then((ap) => set(ap.last_price));
  const interval = setInterval(() => {
    getAlcorPrice(market).then((ap) => set(ap.last_price));
  }, frequence);
  return function stop() {
    clearInterval(interval);
  };
}

export const rplanetPrices: Readable<IPricesInWax> = derived(
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
