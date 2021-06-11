<script lang="ts">
  import {
    calculatePooledAssetYield,
    calculateRPlanetAssetYield,
    findAsset,
    findSchemaRarity,
    RPLANET_COLLECTION,
  } from "../domain/asset-staking";
  import type { RarityYield } from "../domain/asset-staking";
  import type { ListingAsset } from "../domain/asset-staking";
  import { format } from "../domain/currencies";
  import {
    poolsStakingConfigStore,
    rarityConfigStore,
    rateModsStore,
  } from "../domain/rplanet";
  import type { Rarity } from "../dal/rplanet";

  let assetId: string;
  let asset: ListingAsset;
  let assetYield: number;
  let assetImage: string | undefined;
  let assetRarity: string;
  let otherRaritiesYield: RarityYield[] | undefined;
  let error: string | undefined;

  async function calculateYield() {
    try {
      otherRaritiesYield = undefined;
      assetImage = undefined;
      asset = await findAsset(assetId);
      const rarities = $rarityConfigStore;
      const schemaRarityConf = findSchemaRarity(asset, rarities);
      assetRarity = asset.data[schemaRarityConf.rarity_id];
      updateImage(asset, schemaRarityConf.img_id);
      if (RPLANET_COLLECTION === asset.collection.collection_name) {
        const rateMods = $rateModsStore;
        assetYield = await calculateRPlanetAssetYield(
          asset,
          schemaRarityConf,
          rateMods
        );
      } else {
        const pools = $poolsStakingConfigStore;
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

  function updateImage(asset: ListingAsset, imgField: string) {
    const img = asset.data[imgField] as string;
    if (img && img.startsWith("http")) {
      assetImage = img;
    } else {
      assetImage = `https://ipfs.io/ipfs/${img}`;
    }
  }
</script>

<div class="section">
  <p class="title is-4">Asset Staking Calculator</p>

  <p class="mt-4">
    Type your NFT ID into the input and press 'Search'.
    <br />
    Please keep in mind that this calculator is still under development so you may
    find a bug or two. We are also only considering atomic assets for now.
    <br />
    You may let us know of any issue you encounter
    <a href="https://github.com/LucasJC/rpwhale/issues/32" target="_blank"
      >here</a
    >.
  </p>

  <form class="form mt-6" on:submit|preventDefault={calculateYield}>
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
        <button type="submit" class="button is-info">Search</button>
      </div>
    </div>
  </form>

  {#if error}
    <div class="columns is-centered">
      <div class="column is-one-third has-text-centered">
        <figure class="image">
          <img src="image/sorry.png" alt="img" />
        </figure>
        <p class="has-background-danger-light has-text-danger-dark">{error}</p>
      </div>
    </div>
  {:else if asset}
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
            <td>{asset.asset_id}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{asset.name}</td>
          </tr>
          <tr>
            <th>Collection</th>
            <td>{asset.collection.collection_name}</td>
          </tr>
          <tr>
            <th>Schema</th>
            <td>{asset.schema.schema_name}</td>
          </tr>
          <tr>
            <th>Rarity</th>
            <td>{assetRarity}</td>
          </tr>
        </table>
      </div>
    </div>

    {#if otherRaritiesYield}
      <p class="title is-5">
        Other rarities for schema "{asset.schema.schema_name}"
      </p>
      <div class="tile">
        {#each otherRaritiesYield as other}
          <div class="box m-2" class:crossed-out={other.aetherYield <= 0}>
            <p><strong>{other.rarity}</strong></p>
            <p>{format(other.aetherYield)} Aether / hour</p>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .crossed-out {
    text-decoration: line-through;
  }
</style>
