const WAX_CHAIN_HOST = "https://api.wax.alohaeos.com";

export async function getTableRows<T>(
  code: string,
  scope: string,
  table: string,
  lower_bound = "",
  upper_bound = ""
): Promise<Array<T>> {
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
  return body.rows;
}

/**
 * @deprecated replace with atomic assets lib integration
 */
export interface WaxAsset {
  asset_id: string;
  collection_name: string;
  schema_name: string;
  template_id: number;
  ram_payer: string;
  immutable_serialized_data: number[];
  mutable_serialized_data: number[];
}

/**
 * @deprecated replace with atomic assets lib integration
 */
export async function getAccountAssets(
  account: string
): Promise<Array<WaxAsset>> {
  return getTableRows("atomicassets", account, "assets", "", "");
}
