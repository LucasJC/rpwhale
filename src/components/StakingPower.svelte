<script lang="ts">
  import { format } from "../domain/format";
  import { accountStakingPower, poolStakingConfig } from "../domain/store";
  import * as Staking from "../domain/Staking";
  import type { AccountCollectionStaking } from "../dal/types";

  let collectionsStaking: AccountCollectionStaking[] = [];
  let totalPower = 0.0;
  let totalCollected = 0.0;

  $: {
    collectionsStaking = Staking.calcMiningPower(
      $accountStakingPower,
      $poolStakingConfig
    );
    const { miningPower, collected } = Staking.calcTotals(collectionsStaking);
    totalPower = miningPower;
    totalCollected = collected;
    Staking.getRank(miningPower);
  }
</script>

<main>
  <div class="section">
    {#if collectionsStaking}
      <p class="subtitle">Staked Collections Details:</p>
      <table
        class="table is-bordered is-striped is-narrow is-fullwidth has-text-centered"
      >
        <tr>
          <th>Collection</th>
          <th>Collected Aether</th>
          <th>Mining Power</th>
        </tr>
        {#each collectionsStaking as cs}
          <tr>
            <td>{cs.collection}</td>
            <td class="has-text-right">{format(Number.parseFloat(cs.collected.split(" ")[0]))}</td>
            <td class="has-text-right">{format(cs?.miningPower)}</td>
          </tr>
        {/each}
        <tr
          class="has-text-weight-bold has-background-info-light has-text-info-dark"
        >
          <td>Total</td>
          <td class="has-text-right">{format(totalCollected)}</td>
          <td class="has-text-right">{format(totalPower)}</td>
        </tr>
      </table>
    {/if}
  </div>
</main>

<style>
  table {
    margin: 0 auto;
  }
</style>
