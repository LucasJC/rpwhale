import { readable, writable } from 'svelte/store';
import { getAlcorPrice, getWaxPriceInUSD } from './integration';
import { ALCOR_MARKET } from './types';

export const account = writable("");

export const miningPower = writable(0.0);

export const waxPrice = readable(0.0, function start(set) {
  getWaxPriceInUSD().then(wp => set(wp.wax.usd));
});

export const aetherPrice = readable(0.0, function start(set) {
  getAlcorPrice(ALCOR_MARKET.AETHER).then(ap => set(ap.last_price));
});

export const wecanPrice = readable(0.0, function start(set) {
  getAlcorPrice(ALCOR_MARKET.WECAN).then(ap => set(ap.last_price));
});

export const caponPrice = readable(0.0, function start(set) {
  getAlcorPrice(ALCOR_MARKET.CAPON).then(ap => set(ap.last_price));
});

export const waxonPrice = readable(0.0, function start(set) {
  getAlcorPrice(ALCOR_MARKET.WAXON).then(ap => set(ap.last_price));
});

export const eneftPrice = readable(0.0, function start(set) {
  getAlcorPrice(ALCOR_MARKET.ENEFT).then(ap => set(ap.last_price));
});