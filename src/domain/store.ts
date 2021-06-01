import {
  readable,
  Subscriber,
  writable,
  derived,
  Readable,
} from "svelte/store";
import type { ListingAsset } from "../dal/am";
import am from "../dal/am";
import * as Asset from "../domain/Asset";
import {
  fetchAccountCollectionStaking,
  fetchStakingConfigs,
  getAccountAssets,
  getAlcorPrice,
  getWaxPriceInUSD,
} from "../dal/integration";
import {
  AccountCollectionStaking,
  ALCOR_MARKET,
  AtomicAsset,
  PoolConfig,
} from "../dal/types";

// reexporting for backwards compat
import { store as user } from "../domain/User";

export const accountAssets: Readable<Array<AtomicAsset>> = derived(
  user,
  ($user, set) => {
    getAccountAssets($user.account).then((assets) => set(assets || []));
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

export const poolStakingConfig = readable<Map<string, PoolConfig>>(
  new Map(),
  (set) => {
    fetchStakingConfigs().then((config) =>
      set(new Map(config.map((col) => [col.id, col])))
    );
  }
);

export const accountStakingPower = derived(
  [user, poolStakingConfig],
  ([$user, $poolStakingConfig], set) => {
    async function doWork() {
      const collectionNames = [...$poolStakingConfig.keys()].map(
        (collectionName) => collectionName
      );
      const collectionsStaking = await Promise.all(
        collectionNames.map((col) =>
          fetchAccountCollectionStaking($user.account, col)
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

export const miningPowerStore = writable(0.0);
export const unclaimedAetherStore = writable(0.0);
export const landsIncome = writable(0.0);

// TODO move to domain
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
