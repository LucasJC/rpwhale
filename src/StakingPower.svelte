<script lang="ts">
  import { format } from "./format";
  import {
    fetchAccountCollectionStaking,
    fetchStakingConfigs,
  } from "./integration";
  import { account, miningPower } from "./store";
  import type { AccountCollectionStaking } from "./types";

  let totalPower = 0.0;
  let totalCollected = 0.0;
  let collectionsStaking: AccountCollectionStaking[];
  let lastAccount: string;
  let rank: string = "";
  let error: string | undefined;

  $: if ($account) {
    executeCalculation();
  }

  async function executeCalculation() {
    try {
      error = undefined;
      collectionsStaking = [];
      lastAccount = $account;
      await calculate($account);
    } catch (error) {
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
      error =
        "Staking configuration could not be retrieved. Please try again later =(";
      return;
    }
    const configMap = new Map(conf.map((ce) => [ce.id, ce]));
    const collectionsStakingRes = await Promise.all(
      [...configMap.keys()].map((col) =>
        fetchAccountCollectionStaking(waxAccount, col)
      )
    );

    collectionsStaking = collectionsStakingRes.filter(
      (el) => !!el
    ) as AccountCollectionStaking[];
    let total = 0;
    let collected = 0;
    collectionsStaking.forEach((cs) => {
      if (configMap.has(cs.collection)) {
        const collectionConfig = configMap.get(cs.collection);
        if (cs.collection === "s.rplanet") {
          cs.miningPower = cs.staked / 10000;
        } else {
          const poolRewards = Number(
            collectionConfig?.fraction.split(" ")[0] || 0
          );
          cs.miningPower =
            (cs.staked * poolRewards) / (collectionConfig?.staked || 0);
        }
        collected += Number(cs.collected.split(" ")[0]);
        total += cs.miningPower;
      }
    });
    totalCollected = collected;
    totalPower = total;
    miningPower.set(totalPower);
    rank = getRank(totalPower);
  }

  function getRank(mp: number) {
    if (mp < 2000) {
      return "🐠";
    }
    if (mp < 10000) {
      return "🦀";
    }
    if (mp < 40000) {
      return "🐬";
    }
    if (mp < 100000) {
      return "🦈";
    }
    if (mp < 250000) {
      return "🐳";
    }
    return "🐙";
  }
</script>

<main>
  <div class="section">
    {#if collectionsStaking}
      <p class="subtitle">
        Account <span class="has-text-weight-bold">{lastAccount}</span> has a
        total mining power of
        <span
          class="has-text-weight-bold"
          data-tooltip="Aether generated per hour"
          >{format(totalPower)} A/h {rank}</span
        >
      </p>
      <p class="subtitle">Details:</p>
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
            <td class="has-text-right">{cs.collected}</td>
            <td class="has-text-right">{format(cs?.miningPower)} A/h</td>
          </tr>
        {/each}
        <tr
          class="has-text-weight-bold has-background-info-light has-text-info-dark"
        >
          <td>Total</td>
          <td class="has-text-right">{format(totalCollected)} AETHER</td>
          <td class="has-text-right">{format(totalPower)} A/h</td>
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
