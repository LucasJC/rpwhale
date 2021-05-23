<script lang="ts">
  import { format } from "./format";
  import { aetherPrice, miningPower, waxPrice } from "./store";

  let aetherInWax: number = 0.0;
  let aetherInUSD: number = 0.0;

  $: if($miningPower) {
    aetherInWax = $miningPower * $aetherPrice;
    aetherInUSD = aetherInWax * $waxPrice;
  }
</script>

<main>

  <div class="section">
    {#if $miningPower}
      <p class="subtitle">Passive income rates:</p>
      <div class="columns">
        <div class="column">
          <p class="subtitle has-text-centered" data-tooltip="Aether calculated income.">Aether</p>
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <tr>
                <th>Period</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>hourly</td>
                <td>{format($miningPower)}</td>
              </tr>
              <tr>
                <td>daily</td>
                <td>{format($miningPower * 24)}</td>
              </tr>
              <tr>
                <td>weekly</td>
                <td>{format($miningPower * 24 * 7)}</td>
              </tr>
              <tr>
                <td>monthly</td>
                <td>{format($miningPower * 24 * 30)}</td>
              </tr>
            </table>
        </div>
        <div class="column">
          <p class="subtitle has-text-centered" data-tooltip="Wax calculated income. Defaults to 0 when prices are not available.">Wax</p>
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <tr>
                <th>Period</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>hourly</td>
                <td>{format(aetherInWax)}</td>
              </tr>
              <tr>
                <td>daily</td>
                <td>{format(aetherInWax * 24)}</td>
              </tr>
              <tr>
                <td>weekly</td>
                <td>{format(aetherInWax * 24 * 7)}</td>
              </tr>
              <tr>
                <td>monthly</td>
                <td>{format(aetherInWax * 24 * 30)}</td>
              </tr>
            </table>
        </div>
        <div class="column">
          <p class="subtitle has-text-centered" data-tooltip="USD calculated income. Defaults to 0 when prices are not available.">USD</p>
          <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <tr>
              <th>Period</th>
              <th>Amount</th>
            </tr>
            <tr>
              <td>hourly</td>
              <td>{format(aetherInUSD)}</td>
            </tr>
            <tr>
              <td>daily</td>
              <td>{format(aetherInUSD * 24)}</td>
            </tr>
            <tr>
              <td>weekly</td>
              <td>{format(aetherInUSD * 24 * 7)}</td>
            </tr>
            <tr>
              <td>monthly</td>
              <td>{format(aetherInUSD * 24 * 30)}</td>
            </tr>
          </table>
        </div>
      </div>
      <p>
        <span class="has-tooltip-bottom" data-tooltip="Aether price taken from Alcor Exchange API.">{$aetherPrice} Wax/Aether</span> - <span class="has-tooltip-bottom" data-tooltip="Wax price taken from CoinGecko API.">{$waxPrice} USD/Wax</span>
      </p>
    {/if}
  </div>
</main>