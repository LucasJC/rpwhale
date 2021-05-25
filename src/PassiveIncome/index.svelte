<script lang="ts">
  import { accountLands, aetherPrice, miningPower, waxPrice } from "../store";
  import Table from "./PeriodicIncomeTable.svelte";
  import LandsTable from "./Lands.svelte";
  import * as Asset from "../domain/Asset";

  let landsYield: Array<Asset.ILandYield>;
  $: landsYield = Asset.getLandsYield($accountLands);

  let stakingTables: Array<{ label: string; mp: number }>;
  $: stakingTables = [
    { label: "Aether", mp: $miningPower },
    { label: "Wax", mp: $miningPower * $aetherPrice },
    { label: "USD", mp: $miningPower * $aetherPrice * $waxPrice },
  ];
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
    {#if landsYield?.length > 0}
      <p class="subtitle">Lands passive income:</p>
      <LandsTable {landsYield} />
    {/if}
  </div>
</main>
