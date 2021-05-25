<script lang="ts">
  import { account, aetherPrice, miningPower, waxPrice } from "../store";
  import Table from "./PeriodicIncomeTable.svelte";
  import LandsTable from "./Lands.svelte";
  import { getAccountAssets } from "../integration";
  import am from "../am";

  let stakingTables: Array<{ label: string; mp: number }>;
  let landsYield: Array<{ id: string; value: number }>;

  $: stakingTables = [
    { label: "Aether", mp: $miningPower },
    { label: "Wax", mp: $miningPower * $aetherPrice },
    { label: "USD", mp: $miningPower * $aetherPrice * $waxPrice },
  ];

  $: if ($account) getLandsYield();

  async function getLandsYield(): Promise<void> {
    landsYield = [];
    const assets = await getAccountAssets($account);
    const rpAssets = assets.filter(
      (asset) => asset.collection_name === "rplanet"
    );
    const lands = rpAssets.filter((asset) =>
      asset.schema_name.includes("lands")
    );
    const landAssets = await Promise.all(
      lands.map((land) => am.getAsset(land.asset_id))
    );

    const landYield: { [id: string]: number } = {};
    landAssets.forEach((land) => {
      const mineral = land.data?.name?.toUpperCase();
      const amount = land.data?.base_rate;
      if (!landYield[mineral]) {
        landYield[mineral] = 0;
      }
      landYield[mineral] += amount;
    });
    landsYield = Object.entries(landYield).map(([id, value]) => ({
      id,
      value,
    }));
  }
</script>

<main>
  <div class="section">
    <p class="subtitle">Staking passive income:</p>

    <div class="columns">
      {#each stakingTables as table}
        <div class="column">
          <p class="subtitle has-text-centered">
            {table.label}
          </p>
          <Table hourlyAmount={table.mp} />
        </div>
      {/each}
    </div>
  </div>

  <div class="section">
    {#if landsYield && landsYield.length > 0}
      <p class="subtitle">Lands passive income:</p>
      <LandsTable {landsYield} />
    {/if}
  </div>
</main>
