import type { AccountCollectionStaking, PoolConfig } from "../dal/types";
import { miningPowerStore, unclaimedAetherStore } from "../domain/store";

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

export function getRank(mp: number): { emoji: string; name: string } {
  if (mp < 2000) {
    return { emoji: "🐠", name: "Guppy" };
  }
  if (mp < 10000) {
    return { emoji: "🦀", name: "Crab" };
  }
  if (mp < 40000) {
    return { emoji: "🐬", name: "Dolphin" };
  }
  if (mp < 100000) {
    return { emoji: "🦈", name: "Shark" };
  }
  if (mp < 250000) {
    return { emoji: "🐳", name: "Whale" };
  }
  return { emoji: "🐙", name: "Kraken" };
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
  unclaimedAetherStore.set(collected);

  return { collected, miningPower };
}
