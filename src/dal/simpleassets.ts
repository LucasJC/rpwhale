export interface SimpleAsset {
  assetId: string;
  owner: string;
  author: string; // collection
  category: string; // schema
  idata: any; // immutable data
  mdata: any; // mutable data
}

export async function fetchSimpleAsset(id: string): Promise<SimpleAsset> {
  const res = await fetch(`https://wax.api.simpleassets.io/v1/assets/${id}`);
  return await res.json();
}
