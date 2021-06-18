<script lang="ts">
  import Table from "./PeriodicIncomeTable.svelte";
  import LandsTable from "./LandsIncome.svelte";
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
    <p class="title is-4">Staking Passive Income</p>
    <Table
      labels={stakingTables.map((t) => t.label)}
      hourlyValues={stakingTables.map((t) => t.mp)}
    />
  </div>
{/if}

{#if $accountLands?.length > 0}
  <div class="section">
    <p class="title is-4">Lands Passive Income</p>
    <LandsTable lands={$accountLands} />
  </div>
{/if}
