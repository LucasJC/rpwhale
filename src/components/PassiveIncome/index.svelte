<script lang="ts">
  import Table from "./PeriodicIncomeTable.svelte";
  import LandsTable from "./Lands.svelte";
  import { miningPowerStore } from "../../domain/account-staking";
  import { rplanetPrices, waxPrice } from "../../domain/currencies";
  import { accountLands } from "../../domain/land";

  let stakingTables: Array<{ label: string; mp: number }>;
  $: stakingTables = [
    { label: "Aether", mp: $miningPowerStore },
    { label: "Wax", mp: $miningPowerStore * $rplanetPrices.AETHER },
    { label: "USD", mp: $miningPowerStore * $rplanetPrices.AETHER * $waxPrice },
  ];
</script>

{#if $miningPowerStore > 0}
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
{/if}

{#if $accountLands?.length > 0}
  <div class="section">
    <p class="subtitle">Lands passive income:</p>
    <LandsTable lands={$accountLands} />
  </div>
{/if}
