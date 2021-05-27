<script lang="ts">
  import {
    accountLands,
    aetherPrice,
    miningPowerStore,
    waxPrice,
  } from "../../domain/store";
  import Table from "./PeriodicIncomeTable.svelte";
  import LandsTable from "./Lands.svelte";

  let stakingTables: Array<{ label: string; mp: number }>;
  $: stakingTables = [
    { label: "Aether", mp: $miningPowerStore },
    { label: "Wax", mp: $miningPowerStore * $aetherPrice },
    { label: "USD", mp: $miningPowerStore * $aetherPrice * $waxPrice },
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
    {#if $accountLands?.length > 0}
      <p class="subtitle">Lands passive income:</p>
      <LandsTable lands={$accountLands} />
    {/if}
  </div>
</main>
