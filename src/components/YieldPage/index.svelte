<script lang="ts">
  import { rplanetPrices, waxPrice } from "../../domain/currencies";
  import { getAPY, APY } from "../../domain/apy";
  import APYTable from "./APYTable.svelte";

  let waxPerAH: number = 1.9;
  let capital: number = 1000;

  let apy: APY;

  $: {
    apy = getAPY(waxPerAH, $waxPrice, $rplanetPrices);
  }
</script>

<div class="section">
  <div style="max-width: 600px; margin-bottom: 20px;">
    <p class="title is-4">Yield calculator</p>
    <p>
      Estimate how much yield you will get out of a particular investment for an
      asset (or multiple) with a certain Wax per Aether/Hour yield which is a
      value that you usually find as a yield messurement in the community.
    </p>
  </div>

  <div class="columns is-desktop">
    <form class="form column apy__form" on:submit={(e) => e.preventDefault()}>
      <div class="field">
        <label class="label">Wax per Aether/Hour</label>
        <div class="control">
          <input
            class="input"
            type="number"
            placeholder="1.9"
            bind:value={waxPerAH}
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Initial Capital (USD)</label>
        <div class="control">
          <input
            class="input"
            type="number"
            placeholder="1000 USD"
            bind:value={capital}
          />
        </div>
      </div>
    </form>

    <div class="column">
      <APYTable {apy} />
    </div>
  </div>
</div>

<style>
  .apy__form {
    max-width: 600px;
  }
</style>
