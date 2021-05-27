import type { ListingAsset } from "../dal/am";
import { IPricesInWax, landsIncome } from "../domain/store";
import type { AtomicAsset } from "../dal/types";
import * as Price from "./Price";

export function getLands(assets: Array<AtomicAsset>): Array<AtomicAsset> {
  // TODO change logic to not have to do this
  landsIncome.set(0.0);

  const rpAssets = assets.filter(
    (asset) => asset.collection_name === "rplanet"
  );
  const lands = rpAssets.filter((asset) => asset.schema_name.includes("lands"));

  return lands;
}

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
  pricesInWax: IPricesInWax,
  waxPrice: number
): Array<ILandYieldPrices> {
  const aetherPrice = Price.getPrice(pricesInWax, "AETHER");

  return landsYield.map(({ id, value }) => {
    const priceInWax = Price.getPrice(pricesInWax, id);
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

export function aggregateLandYields(landsYield: Array<ILandYieldPrices>) {
  let totalWax: number = 0;
  let totalAeth: number = 0;
  let totalUSD: number = 0;

  landsYield.forEach(({ aeth, wax, usd }) => {
    totalAeth += aeth;
    totalWax += wax;
    totalUSD += usd;
  });

  landsIncome.set(totalUSD);

  return {
    wax: totalWax,
    aeth: totalAeth,
    usd: totalUSD,
  };
}
