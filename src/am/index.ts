export type { ListingAsset } from "atomicmarket/build/API/Explorer/Types";
import { ExplorerApi } from "atomicmarket";

const URL = "https://wax.api.atomicassets.io";
const NAMESPACE = "atomicmarket";
const api = new ExplorerApi(URL, NAMESPACE, {});

export default api;
