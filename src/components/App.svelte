<script lang="ts">
  import Header from "./Header.svelte";
  import Donations from "./Donations/index.svelte";
  import { GoogleAnalytics } from "@beyonk/svelte-google-analytics";
  import { Router, Route } from "svelte-navigator";
  import AssetYield from "./AssetYield.svelte";
  import Pools from "./PoolExplorer/index.svelte";
  import { getFromSearch, poolFilters } from "../domain/history";
  import Yield from "./YieldPage/index.svelte";
  import CurrenciesCalculator from "./CurrenciesCalculator.svelte";
  import type { NavbarItem } from "../domain/navbar";
  import Home from "./Home.svelte";
  import { ASSET_SEARCH_KEY } from "../domain/asset-staking";
  const items: NavbarItem[] = [
    { url: "/", label: "Home" },
    { url: "/asset-staking", label: "Asset Staking" },
    { url: "/pools", label: "Pools" },
    { url: "/yield", label: "APY" },
    { url: "/donation", label: "Donation" },
    { url: "/calculator", label: "Calculator" },
  ];
</script>

<GoogleAnalytics properties={["G-1WNKLF5N10"]} />
<div class="container">
  <Router>
    <Header {items} />
    <Route path="/">
      <Home />
    </Route>
    <Route path="asset-staking">
      <AssetYield assetId={getFromSearch(ASSET_SEARCH_KEY)} />
    </Route>
    <Route path="calculator">
      <CurrenciesCalculator />
    </Route>
    <Route path="pools">
      <Pools filters={$poolFilters} />
    </Route>
    <Route path="yield">
      <Yield />
    </Route>
    <Route path="donation">
      <Donations />
    </Route>
  </Router>
</div>
