import type { ListingAsset } from "../dal/am";
import type { AtomicAsset } from "../types";

export function getLands(assets: Array<AtomicAsset>): Array<AtomicAsset> {
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
