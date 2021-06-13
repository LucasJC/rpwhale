import type { ListingAsset } from "atomicmarket/build/API/Explorer/Types";
import { atomicMarket } from "../dal/atomic-market";
import { derived, Readable, writable } from "svelte/store";
import { getRPlanetPrice, IPricesInWax } from "./currencies";
import { userStore } from "./user";
import { RPLANET_COLLECTION } from "./asset-staking";

export const enum LAND_TYPE {
  CAPONIUM = "Caponium",
  ENEFTERIUM = "Enefterium",
  WAXON = "Waxon",
  WECANITE = "Wecanite",
}

export const landsIncomeStore = writable(0.0);

export const accountAssets: Readable<ListingAsset[]> = derived(
  userStore,
  ($userStore, set) => {
    atomicMarket()
      .getAssets({
        owner: $userStore.account,
        collection_name: RPLANET_COLLECTION,
      })
      .then((assets) => set(assets || []));
  },
  [] as ListingAsset[]
);

export const accountLands: Readable<Array<ListingAsset>> = derived(
  userStore,
  ($userStore, set) => {
    atomicMarket()
      .getAssets(
        {
          owner: $userStore.account,
          collection_name: RPLANET_COLLECTION,
        },
        0,
        500
      )
      .then((assets) => {
        landsIncomeStore.set(0.0);
        assets = assets.filter((asset) =>
          asset.schema.schema_name.includes("land")
        );
        set(assets || []);
      });
  },
  [] as Array<ListingAsset>
);
export interface ILandYield {
  // TODO change this field to soemthing better like "mineral" or "landKind"
  id: string;
  value: number;
}

export function getLandsYield(lands: Array<ListingAsset>): Array<ILandYield> {
  const landYield: { [id: string]: number } = {};
  lands.forEach((land) => {
    const mineral = land.data?.name?.toUpperCase();
    const amount = land.data?.base_rate;
    if (!landYield[mineral]) {
      landYield[mineral] = 0;
    }
    landYield[mineral] += amount;
  });

  return Object.entries(landYield).map(([id, value]) => ({
    id,
    value,
  }));
}

export interface ILandYieldPrices {
  id: string;
  value: number;
  wax: number;
  aeth: number;
  usd: number;
}

export function getLandsYieldPrices(
  landsYield: Array<ILandYield>,
  rplanetPrices: IPricesInWax,
  waxPrice: number
): Array<ILandYieldPrices> {
  const aetherPrice = getRPlanetPrice(rplanetPrices, "AETHER");

  return landsYield.map(({ id, value }) => {
    const priceInWax = getRPlanetPrice(rplanetPrices, id);
    const wax = value * priceInWax;
    const aeth = wax / aetherPrice;
    const usd = wax * waxPrice;

    return {
      id,
      value,
      wax,
      aeth,
      usd,
    };
  });
}

export function aggregateLandYields(landsYield: Array<ILandYieldPrices>): {
  wax: number;
  aeth: number;
  usd: number;
} {
  let totalWax = 0;
  let totalAeth = 0;
  let totalUSD = 0;

  landsYield.forEach(({ aeth, wax, usd }) => {
    totalAeth += aeth;
    totalWax += wax;
    totalUSD += usd;
  });

  landsIncomeStore.set(totalUSD);

  return {
    wax: totalWax,
    aeth: totalAeth,
    usd: totalUSD,
  };
}
