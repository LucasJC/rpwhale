import type { AccountCollectionStaking, PoolConfig } from "./types";

export async function getTableRows<T>(code: string, scope: string, table: string, lower_bound = "", upper_bound = ""): Promise<Array<T>> {
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

export async function fetchStakingConfigs(): Promise<PoolConfig[]> {
  return getTableRows<PoolConfig>("s.rplanet", "s.rplanet", "pools");
}

export async function fetchAccountCollectionStaking(account: string, collection: string): Promise<AccountCollectionStaking | undefined> {
  const result = await getTableRows<AccountCollectionStaking>("s.rplanet", collection, "accounts", account, account);
  const staking = result[0];
  if (staking) {
    staking.collection = collection;
  } else {
    console.log(`Collection ${collection} not found`);
  }
  return staking;
}