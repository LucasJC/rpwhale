<script lang="ts">
  import { format } from "./format";
  import { fetchAccountCollectionStaking, fetchStakingConfigs } from "./integration";
  import { account, miningPower } from "./store";
  import type { AccountCollectionStaking } from "./types";

  let totalPower = 0.0;
  let totalCollected = 0.0;
  let collectionsStaking: AccountCollectionStaking[];
  let lasAccount: string;
  let error: string;

  $: if ($account) {
    executeCalculation();
  }

  async function executeCalculation() {
    try {
      error = undefined;
      collectionsStaking = [];
      lasAccount = $account;
      await calculate($account);
    } catch(error) {
      error = "Error performing calculation. Please try again later =(";
    }
  }

  async function calculate(waxAccount: string) {
    if (!waxAccount) {
      error = "Please specify a WAX account";
      return;
    }
    const conf = await fetchStakingConfigs();
    if (!conf) {
      error = "Staking configuration could not be retrieved. Please try again later =("
      return;
    }
    const configMap = new Map(conf.map(ce => [ce.id, ce]));
    collectionsStaking = (await Promise.all([...configMap.keys()].map(col => fetchAccountCollectionStaking(waxAccount, col)))).filter(el => !!el);
    let total = 0;
    let collected = 0;
    collectionsStaking.forEach(cs => {
      if (configMap.has(cs.collection)) {
        const collectionConfig = configMap.get(cs.collection);
        if (cs.collection === 's.rplanet') {
          cs.miningPower = cs.staked / 10000;
        } else {
          const poolRewards = Number(collectionConfig.fraction.split(" ")[0]);
          cs.miningPower = cs.staked * poolRewards / collectionConfig.staked;
        }
        collected += Number(cs.collected.split(" ")[0]);
        total += cs.miningPower;
      }
    });
    totalCollected = collected;
    totalPower = total;
    miningPower.set(totalPower);
  }

</script>

<main>

  <div class="section">
    {#if collectionsStaking}
      <p class="subtitle">Account <span class="has-text-weight-bold">{lasAccount}</span> has a total mining power of <span class="has-text-weight-bold">{format(totalPower)} A/h</span></p>
      <p class="subtitle">Details:</p>
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <tr>
          <th>Collection</th>
          <th>Collected Aether</th>
          <th>Mining Power</th>
        </tr>
        {#each collectionsStaking as cs}
            <tr>
              <td>{cs.collection}</td>
              <td>{cs.collected}</td>
              <td>{format(cs.miningPower)} A/h</td>
            </tr>
        {/each}
        <tr class="has-text-weight-bold">
          <td>Total</td>
          <td class="has-text-weight-bold">{format(totalCollected)} AETHER</td>
          <td>{format(totalPower)} A/h</td>
        </tr>
      </table>
    {/if}

    {#if error}
      <div class="tag is-danger is-light is-medium">Error: {error}</div>
    {/if}

  </div>
</main>

<style>
  table {
    margin: 0 auto;
  }
</style>