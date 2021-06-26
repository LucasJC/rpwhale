<script lang="ts">
  import { rplanetPrices, waxPrice } from "../domain/currencies";
  import { currencyBalance } from "../domain/balance";
  import * as Balance from "../domain/balance";
  import FormattedPrice from "./FormattedPrice.svelte";
  import { getAPY, APY } from "../domain/apy";

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
      <table class="table">
        <tbody>
          <tr>
            <th> Hourly </th>
            <th>
              {apy.hpyFormatted()}
            </th>
          </tr>
          <tr>
            <th> Daily </th>
            <th>
              {apy.dpyFormatted()}
            </th>
          </tr>
          <tr>
            <th> Weekly </th>
            <th>
              {apy.wpyFormatted()}
            </th>
          </tr>
          <tr>
            <th> Monthly </th>
            <th>
              {apy.mpyFormatted()}
            </th>
          </tr>
          <tr>
            <th> Yearly (APY) </th>
            <th>
              {apy.apyFormatted()}
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .apy__form {
    max-width: 600px;
  }
</style>
