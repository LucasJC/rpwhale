<script lang="ts">
  import { aetherPrice, miningPower, waxPrice } from "./store";
  import Table from "./PassiveIncomeTable.svelte";

  let tables: Array<{ label: string; mp: number }>;

  $: tables = [
    { label: "Aether", mp: $miningPower },
    { label: "Wax", mp: $miningPower * $aetherPrice },
    { label: "USD", mp: $miningPower * $aetherPrice * $waxPrice },
  ];
</script>

<main>
  <div class="section">
    {#if $miningPower}
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
