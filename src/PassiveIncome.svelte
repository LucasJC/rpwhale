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
          <p class="subtitle">Aether</p>
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
          <p class="subtitle">Wax</p>
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
          <p class="subtitle">USD</p>
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
        {$aetherPrice} Wax/Aether - {$waxPrice} USD/Wax
      </p>
    {/if}
  </div>
</main>