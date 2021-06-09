import { derived, writable } from "svelte/store";
import { userStore } from "./user";
import {
  AccountCollectionStaking,
  fetchAccountCollectionStaking,
  PoolConfig,
} from "../dal/rplanet";
import { poolsStakingConfigStore } from "./rplanet";

export const miningPowerStore = writable(0.0);

export const unclaimedAetherStore = writable(0.0);

export const accountStakingConfigStore = derived(
  [userStore, poolsStakingConfigStore],
  ([$userStore, $poolsStakingConfigStore], set) => {
    async function doWork() {
      const collectionNames = [...$poolsStakingConfigStore.keys()].map(
        (collectionName) => collectionName
      );
      const collectionsStaking = await Promise.all(
        collectionNames.map((col) =>
          fetchAccountCollectionStaking($userStore.account, col)
        )
      );
      set(
        collectionsStaking.filter(
          (col) => !!col
        ) as Array<AccountCollectionStaking>
      );
    }
    doWork();
  },
  [] as Array<AccountCollectionStaking>
);

export function calcMiningPower(
  collectionsStaking: Array<AccountCollectionStaking>,
  poolConfig: Map<string, PoolConfig>
): Array<AccountCollectionStaking> {
  return collectionsStaking
    .filter((cs) => poolConfig.has(cs.collection))
    .map((cs) => {
      const collectionConfig = poolConfig.get(cs.collection);
      let miningPower = 0;
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
): { collected: number; miningPower: number } {
  let collected = 0;
  let miningPower = 0;

  collectionsStaking.forEach((cs) => {
    collected += Number(cs.collected.split(" ")[0]);
    miningPower += cs.miningPower || 0;
  });

  miningPowerStore.set(miningPower);
  unclaimedAetherStore.set(collected);

  return { collected, miningPower };
}
