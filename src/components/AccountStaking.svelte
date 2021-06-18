<script lang="ts">
  import FormattedPrice from "./FormattedPrice.svelte";
  import type { AccountCollectionStaking } from "../dal/rplanet";
  import { poolsStakingConfigStore } from "../domain/rplanet";
  import {
    accountStakingConfigStore,
    calcMiningPower,
    calcTotals,
  } from "../domain/account-staking";

  let collectionsStaking: AccountCollectionStaking[] = [];
  let totalPower = 0.0;
  let totalCollected = 0.0;

  $: {
    collectionsStaking = calcMiningPower(
      $accountStakingConfigStore,
      $poolsStakingConfigStore
    );
    const { miningPower, collected } = calcTotals(collectionsStaking);
    totalPower = miningPower;
    totalCollected = collected;
  }
</script>

<div class="section">
  <p class="title is-4">Staked Collections</p>
  {#if collectionsStaking && collectionsStaking.length > 0}
    <table
      class="table is-bordered is-narrow is-fullwidth has-text-centered is-hcentered"
    >
      <tr>
        <th>Collection</th>
        <th>Collected Aether</th>
        <th>Staking Power</th>
      </tr>
      {#each collectionsStaking as cs}
        <tr>
          <td>{cs.collection}</td>
          <td class="has-text-right">
            <FormattedPrice
              value={Number.parseFloat(cs.collected.split(" ")[0]) || 0}
            />
          </td>
          <td class="has-text-right">
            <FormattedPrice value={cs?.miningPower || 0} />
          </td>
        </tr>
      {/each}
      <tr
        class="has-text-weight-bold has-background-info-light has-text-info-dark"
      >
        <td>Total</td>
        <td class="has-text-right">
          <FormattedPrice value={totalCollected} />
        </td>
        <td class="has-text-right">
          <FormattedPrice value={totalPower} />
        </td>
      </tr>
    </table>
  {:else}
    <p>No staked assets found for this account.</p>
  {/if}
</div>
