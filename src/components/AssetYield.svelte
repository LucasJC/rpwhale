<script lang="ts">
  import type { ListingAsset } from "../dal/atomic-market";
  import { atomicMarket } from "../dal/atomic-market";
  import type { RarityConfig } from "../dal/rplanet";
  import { format } from "../domain/currencies";
  import {
    poolsStakingConfigStore,
    rarityConfigStore,
  } from "../domain/rplanet";

  let assetId: string;
  let asset: ListingAsset;
  let assetYield: number;
  let assetImage: string;
  let assetRarity: string;
  let error: string | undefined;

  const RPLANET_COLLECTION = "rplanet";

  async function calculateYield() {
    try {
      const id = assetId.replace("#", "").trim();
      asset = await atomicMarket().getAsset(id);
      if (!asset) {
        error = "Asset not found";
        return;
      }
    } catch (err) {
      error = "Asset not available";
      return;
    }

    const rarities = $rarityConfigStore;
    const collection = asset.collection.collection_name;
    const schema = asset.schema.schema_name;
    try {
      if (RPLANET_COLLECTION === collection) {
        calculateRPlanetAssetYield(schema, rarities);
      } else {
        calculatePooledAssetYield(collection, schema, rarities);
      }
      error = undefined;
    } catch (err) {
      error = err;
    }
  }

  function calculateRPlanetAssetYield(
    schema: string,
    rarities: RarityConfig[]
  ) {
    const rarityConf = findAssetRarity(
      asset,
      RPLANET_COLLECTION,
      schema,
      rarities
    );
    if (schema.startsWith("rigs")) {
      assetYield = rarityConf.one_asset_value / 10000;
    } else if (schema.startsWith("elements")) {
      throw "We are working on this!";
    } else {
      throw `Schema [${schema}] of collection [${RPLANET_COLLECTION}] is not stakeable or we don't implemented it yet!`;
    }
  }

  function calculatePooledAssetYield(
    collection: string,
    schema: string,
    rarities: RarityConfig[]
  ) {
    const pools = $poolsStakingConfigStore;
    const pool = pools.get(asset.collection.collection_name);
    if (!pool) {
      throw "No pool found for this collection :(";
    }

    const rarityConf = findAssetRarity(asset, collection, schema, rarities);
    const fraction = Number.parseFloat(pool.fraction.split(" ")[0]) * 10000;
    const assetValue = rarityConf.one_asset_value;
    assetYield = (assetValue * fraction) / (pool.staked * 10000 + assetValue);
  }

  function findAssetRarity(
    asset: ListingAsset,
    collection: string,
    schema: string,
    rarities: RarityConfig[]
  ) {
    const schemaRarityConf = rarities.find(
      (rar) => rar.collection === collection && rar.schema === schema
    );
    if (!schemaRarityConf) {
      throw `Schema [${schema}] was not found in collection [${collection}] configuration for RPlanet :(`;
    }
    assetRarity = asset.data[schemaRarityConf.rarity_id];
    const rarityConf = schemaRarityConf.rarities.find(
      (rar) => rar.rarity === assetRarity
    );
    if (!rarityConf) {
      throw `Rarity [${assetRarity}] was not found in RPlanet configuration for collection [${collection}] and schema [${schema}] :(`;
    }
    updateImage(asset, schemaRarityConf.img_id);
    return rarityConf;
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
    <p class="m-4 tag is-danger is-light is-medium">{error}</p>
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
        <p class="title is-4 mb-4">{format(assetYield)} Aether / hour</p>
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
  {/if}
</div>
