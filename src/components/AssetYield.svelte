<script lang="ts">
  import {
    ASSET_SEARCH_KEY,
    calculatePooledAssetYield,
    calculateRPlanetAssetYield,
    findAsset,
    findSchemaRarity,
    getImageURL,
    RPLANET_COLLECTION,
  } from "../domain/asset-staking";
  import type {
    RarityYield,
    StakeableAsset,
    PoolConfig,
  } from "../domain/asset-staking";
  import { format } from "../domain/currencies";
  import {
    poolsStakingConfigStore,
    rarityConfigStore,
    rateModsStore,
  } from "../domain/rplanet";
  import type { RarityConfig, RateMod } from "../dal/rplanet";
  import { updateSearch } from "../domain/history";

  export let assetId: string | undefined;
  let assetYield: number;
  let assetImage: string | undefined;
  let assetRarity: string;
  let otherRaritiesYield: RarityYield[] | undefined;
  let error: string | undefined;
  let asset: StakeableAsset | undefined;
  let loading: boolean = false;

  $: {
    updateSearch(ASSET_SEARCH_KEY, assetId);
  }

  async function calculateYield(
    rarities: RarityConfig[],
    rateMods: Map<number, RateMod>,
    pools: Map<string, PoolConfig>
  ) {
    try {
      if (!assetId) {
        return;
      }
      otherRaritiesYield = undefined;
      assetImage = undefined;
      asset = await findAsset(assetId);
      if (!asset) {
        throw "Asset not available";
      }
      const schemaRarityConf = await findSchemaRarity(asset, rarities);
      assetRarity = asset.data[schemaRarityConf.rarity_id];
      assetImage = getImageURL(asset, schemaRarityConf.img_id);
      if (RPLANET_COLLECTION === asset.collection) {
        assetYield = await calculateRPlanetAssetYield(
          asset,
          schemaRarityConf,
          rateMods
        );
      } else {
        const pooledRaritiesYield = await calculatePooledAssetYield(
          asset,
          schemaRarityConf,
          pools
        );
        assetYield = pooledRaritiesYield.assetYield;
        otherRaritiesYield = pooledRaritiesYield.otherRaritiesYield;
      }
      error = undefined;
    } catch (err) {
      error = err;
    }
  }

  async function submitId() {
    loading = true;
    try {
      calculateYield(
        await rarityConfigStore.promise,
        await rateModsStore.promise,
        await poolsStakingConfigStore.promise
      );
    } finally {
      loading = false;
    }
  }
  // try to submit for first load
  submitId();
</script>

<div class="section">
  <p class="title is-4">Asset Staking Calculator</p>

  <p class="mt-4">
    Type in your NFT ID and press 'Search'.
    <br />
    <br />
    Found any issue? Let us know
    <a href="https://github.com/LucasJC/rpwhale/issues/32" target="_blank"
      >here</a
    >!
  </p>

  <form class="form mt-6" on:submit|preventDefault={submitId}>
    <div class="field is-grouped">
      <div class="control is-expanded">
        <input
          class="input"
          type="text"
          placeholder="Atomic Asset ID"
          bind:value={assetId}
        />
      </div>
      <div class="control">
        <button type="submit" class="button is-info" class:is-loading={loading}
          >Search</button
        >
      </div>
    </div>
  </form>

  {#if error && !loading}
    <div class="columns is-centered">
      <div class="column is-one-quarter has-text-centered">
        <figure class="image">
          <img src="image/sorry.png" alt="img" />
        </figure>
        <p class="has-background-danger-light has-text-danger-dark">{error}</p>
      </div>
    </div>
  {:else if asset && !loading}
    <div class="m-4 columns is-vcentered">
      <div class="column is-one-quarter" />
      <div class="column is-one-quarter">
        {#if assetImage}
          <figure class="image">
            <img src={assetImage} alt="img" />
          </figure>
        {/if}
      </div>
      <div class="column is-one-quarter">
        <p class="title is-4 mb-4" class:crossed-out={assetYield <= 0}>
          {format(assetYield)} Aether / hour
        </p>
        <table class="table is-narrow has-text-centered">
          <tr>
            <th>Asset</th>
            <td>{asset.id}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{asset.name}</td>
          </tr>
          <tr>
            <th>Collection</th>
            <td>{asset.collection}</td>
          </tr>
          <tr>
            <th>Schema</th>
            <td>{asset.schema}</td>
          </tr>
          <tr>
            <th>Rarity</th>
            <td>{assetRarity}</td>
          </tr>
          <tr>
            <th>Owner</th>
            <td>{asset.owner}</td>
          </tr>
        </table>
      </div>
    </div>

    {#if otherRaritiesYield}
      <div class="block">
        <p class="title is-5">
          Other rarities for schema "{asset.schema}"
        </p>

        <table
          class="table is-narrow is-bordered has-text-centered is-hcentered"
        >
          {#each otherRaritiesYield as rarity, i}
            {#if i == 0}
              <tr>
                <th>Rarity</th>
                <th class="has-text-right">Aether Yield</th>
              </tr>
            {/if}
            <tr
              class:has-background-info-light={rarity.rarity === assetRarity}
              class:has-text-info-dark={rarity.rarity === assetRarity}
            >
              <td
                class="is-italic break"
                class:crossed-out={rarity.aetherYield <= 0}>{rarity.rarity}</td
              >
              <td
                class="has-text-right"
                class:crossed-out={rarity.aetherYield <= 0}
                ><strong>{format(rarity.aetherYield)} A/hr</strong></td
              >
            </tr>
          {/each}
        </table>
      </div>
    {/if}
  {/if}
</div>
