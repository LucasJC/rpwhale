import type { AccountCollectionStaking, PoolConfig } from "../domain/types";
import { miningPower as miningPowerStore } from "../domain/store";

export function calcMiningPower(
  collectionsStaking: Array<AccountCollectionStaking>,
  poolConfig: Map<string, PoolConfig>
): Array<AccountCollectionStaking> {
  return collectionsStaking
    .filter((cs) => poolConfig.has(cs.collection))
    .map((cs) => {
      const collectionConfig = poolConfig.get(cs.collection);
      let miningPower: number = 0;
      if (cs.collection === "s.rplanet") {
        miningPower = cs.staked / 10000;
      } else {
        const poolRewards = Number(
          collectionConfig?.fraction.split(" ")[0] || 0
        );
        miningPower =
          (cs.staked * poolRewards) / (collectionConfig?.staked || 0);
      }
      return {
        ...cs,
        miningPower,
      };
    });
}

export function getRank(mp: number): string {
  if (mp < 2000) {
    return "🐠";
  }
  if (mp < 10000) {
    return "🦀";
  }
  if (mp < 40000) {
    return "🐬";
  }
  if (mp < 100000) {
    return "🦈";
  }
  if (mp < 250000) {
    return "🐳";
  }
  return "🐙";
}

export function calcTotals(
  collectionsStaking: Array<AccountCollectionStaking>
) {
  let collected: number = 0;
  let miningPower: number = 0;

  collectionsStaking.forEach((cs) => {
    collected += Number(cs.collected.split(" ")[0]);
    miningPower += cs.miningPower || 0;
  });

  miningPowerStore.set(miningPower);

  return { collected, miningPower };
}
