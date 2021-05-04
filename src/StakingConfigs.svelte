<script lang="ts">

  import type { StakingConfig, Rarity } from "./types";
	
  let filter: string;

  function equalsIgnoreCase(a: string, b: string) {
    return a.toUpperCase() === b.toUpperCase();
  }

  async function fetchStakingConfigs() {
    const url = "https://chain.wax.io/v1/chain/get_table_rows";
    const options = {
      method: 'POST',
      body: JSON.stringify({
        "code": "s.rplanet",
        "index_position": 1,
        "json": true,
        "key_type": "i64",
        "limit": 1000,
        "lower_bound": "",
        "reverse": false,
        "scope": "s.rplanet",
        "show_player": false,
        "table": "collections",
        "upper_bound": ""
      })
    };
    const res = await fetch(url, options);
    return res.json().then(data => data["rows"] as StakingConfig[]);
  };

  let result: Promise<StakingConfig[]> = fetchStakingConfigs();
</script>

<main>

  <div class="section">  
    <form>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="text" placeholder="Search" bind:value={filter} >
        <span class="icon is-right">
          <i class="fas fa-search"></i>
        </span>
      </div>
    </form>
  </div>

  <div class="section">
    {#if result}
      {#await result}
        <p>...waiting</p>
      {:then configs}
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <tr>
            <th>Collection</th>
            <th>Schema</th>
            <th>Rarities</th>
          </tr>
          {#each configs as config}
            {#if !filter || ( config.collection.toUpperCase().includes(filter.toUpperCase()) || config.schema.toUpperCase().includes(filter.toUpperCase()) ) }
              <tr>
                <td>{config.collection}</td>
                <td>{config.schema}</td>
                <td>
                  <table class="table">
                    <tr>
                      <th>Rarity</th>
                      <th>Yield</th>
                    </tr>
                    {#each config.rarities as rarity}
                      <tr>
                        <td>{rarity.rarity}</td>
                        <td>{rarity.one_asset_value / 10000} aether / hour</td>
                      </tr>
                    {/each}
                  </table>
                </td>
              </tr>
            {/if}
          {/each}
        </table>
      {:catch error}
        <p style="color: red">Error</p>
      {/await}
    {/if}
  </div>
</main>

<style>
  table {
    margin: 0 auto;
  }
</style>