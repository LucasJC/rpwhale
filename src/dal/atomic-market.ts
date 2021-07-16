export type { ListingAsset } from "atomicmarket/build/API/Explorer/Types";
import { ExplorerApi } from "atomicmarket";

//const ATOMIC_ASSETS_HOST = "https://wax.api.atomicassets.io";
// EOS Amsterdam mirror
const ATOMIC_ASSETS_HOST = "https://wax-aa.eu.eosamsterdam.net";

export function atomicMarket(): ExplorerApi {
  if (window) {
    (window as any).global = window;
  }
  return new ExplorerApi(ATOMIC_ASSETS_HOST, "atomicassets", {});
}
