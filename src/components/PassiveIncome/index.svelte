<script lang="ts">
  import {
    accountLands,
    aetherPrice,
    miningPower,
    waxPrice,
  } from "../../domain/store";
  import Table from "./PeriodicIncomeTable.svelte";
  import LandsTable from "./Lands.svelte";

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
    {#if $accountLands?.length > 0}
      <p class="subtitle">Lands passive income:</p>
      <LandsTable lands={$accountLands} />
    {/if}
  </div>
</main>
