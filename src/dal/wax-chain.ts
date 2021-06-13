const WAX_CHAIN_HOST = "https://api.wax.alohaeos.com";

export async function getTableRows<T>(
  code: string,
  scope: string,
  table: string,
  lower_bound = "",
  upper_bound = ""
): Promise<{ rows: Array<T>; next_key?: number }> {
  const url = WAX_CHAIN_HOST + "/v1/chain/get_table_rows";
  const options = {
    method: "POST",
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
      upper_bound,
    }),
  };
  const res = await fetch(url, options);
  const body = await res.json();
  return {
    rows: body.rows,
    next_key: body.next_key,
  };
}
