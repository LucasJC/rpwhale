<script lang="ts">

  import type { StakingConfig, Rarity } from "./types";
	
  let error: string;
  let filter: string;
  let result: StakingConfig[];
  let filteredResult: StakingConfig[];

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

  fetchStakingConfigs().then(data => {
    result = data;
    filteredResult = result;
  });

  function filterData() {
    filteredResult = result.filter(cfg => {
      if (!filter) {
        return true;
      }
      if (cfg.collection.toUpperCase().includes(filter.toUpperCase()) || cfg.schema.toUpperCase().includes(filter.toUpperCase())) {
        return true;
      }
      if (cfg.rarities.filter(rar => rar.rarity.toUpperCase().includes(filter.toUpperCase())).length > 0) {
        return true;
      } 
      return false;
    });
  }

</script>

<main>

  <div class="section">  
    <form>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="text" placeholder="Search" bind:value={filter} on:input={filterData} >
        <span class="icon is-right">
          <i class="fas fa-search"></i>
        </span>
      </div>
    </form>
  </div>

  <div class="section">

    {#if error}
      <p style="color: red">Error: {error}</p>
    {/if}

    {#if filteredResult}
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <tr>
            <th>Collection</th>
            <th>Schema</th>
            <th>Rarities</th>
          </tr>
          {#each filteredResult as config}
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
          {/each}
        </table>
    {/if}
  </div>
</main>

<style>
  table {
    margin: 0 auto;
  }
</style>