<script lang="ts">
  import { account, aetherPrice, miningPower, waxPrice } from "./store";
  import Table from "./PassiveIncomeTable.svelte";
  import { getAccountAssets } from "./integration";
  import am from "./am";
  import type { ListingAsset } from "./am";

  let tables: Array<{ label: string; mp: number }>;

  $: tables = [
    { label: "Aether", mp: $miningPower },
    { label: "Wax", mp: $miningPower * $aetherPrice },
    { label: "USD", mp: $miningPower * $aetherPrice * $waxPrice },
  ];

  let landAssets: Array<ListingAsset> = [];

  $: if ($account) {
    fetchData();
  }

  async function fetchData() {
    const assets = await getAccountAssets($account);
    const rpAssets = assets.filter(
      (asset) => asset.collection_name === "rplanet"
    );
    const lands = rpAssets.filter((asset) =>
      asset.schema_name.includes("lands")
    );
    landAssets = await Promise.all(
      lands.map((land) => am.getAsset(land.asset_id))
    );
  }
</script>

<main>
  <div class="section">
    {#if $miningPower}
      {#each landAssets as land}
        <div>mining {land.data?.base_rate}</div>
        <div>mineral {land.data?.name}</div>
      {/each}
      <p class="subtitle">Passive income rates:</p>

      <div class="columns">
        {#each tables as table}
          <div class="column">
            <p
              class="subtitle has-text-centered"
              data-tooltip="Aether calculated income."
            >
              {table.label}
            </p>
            <Table miningPower={table.mp} />
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>
