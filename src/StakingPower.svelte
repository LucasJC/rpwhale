<script lang="ts">
import type { AccountCollectionStaking, PoolConfig } from "./types";

  let account;
  let totalPower = 0.0;
  let totalCollected = 0.0;
  let collectionsStaking: AccountCollectionStaking[];
  let lasAccount: string;
  let error: string;

  async function executeCalculation() {
    try {
      error = undefined;
      collectionsStaking = [];
      lasAccount = account;
      await calculate();
    } catch(error) {
      error = "Error performing calculation. Please try again later =(";
    }
  }

  async function calculate() {
    if (!account) {
      error = "Please specify a WAX account";
      return;
    }
    const conf = await fetchStakingConfigs();
    if (!conf) {
      error = "Staking configuration could not be retrieved. Please try again later =("
      return;
    }
    const configMap = new Map(conf.map(ce => [ce.id, ce]));
    collectionsStaking = (await Promise.all([...configMap.keys()].map(col => fetchAccountCollectionStaking(account, col)))).filter(el => !!el);
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
  }

  async function getTableRows<T>(code: string, scope: string, table: string, lower_bound = "", upper_bound = ""): Promise<Array<T>> {
    const url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
    const options = {
      method: 'POST',
      body: JSON.stringify({
        code,
        index_position: 1,
        json: true,
        key_type: "i64",
        limit: 1000,
        lower_bound,
        reverse: false,
        scope,
        show_player: false,
        table,
        upper_bound
      })
    };
    const res = await fetch(url, options);
    return res.json().then(data => data["rows"]);
  }

  async function fetchStakingConfigs(): Promise<PoolConfig[]> {
    return getTableRows<PoolConfig>("s.rplanet", "s.rplanet", "pools");
  }

  async function fetchAccountCollectionStaking(account:string, collection: string): Promise<AccountCollectionStaking | undefined> {
    const result = await getTableRows<AccountCollectionStaking>("s.rplanet", collection, "accounts", account, account);
    const staking = result[0];
    if (staking) {
      staking.collection = collection;
    } else {
      console.log(`Collection ${collection} not found`);
    }
    return staking;
  }

  function format(input: number) {
    return input.toLocaleString('en-us', {minimumFractionDigits: 2});
  }

</script>

<main>
  
  <div class="section">
    <form class="form" on:submit|preventDefault={executeCalculation} >
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input class="input" type="text" placeholder="WAX Account" bind:value={account}>
        </div>
        <div class="control">
          <span class="button is-info" href="#" on:click="{executeCalculation}">Calculate</span>
        </div>
      </div>
    </form>
  </div>

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