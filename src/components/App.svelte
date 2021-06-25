<script lang="ts">
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import Donations from "./Donations/index.svelte";
  import AccountStaking from "./AccountStaking.svelte";
  import { GoogleAnalytics } from "@beyonk/svelte-google-analytics";
  import AccountInput from "./AccountInput.svelte";
  import PassiveIncome from "./PassiveIncome/index.svelte";
  import AccountHoldings from "./AccountHoldings.svelte";
  import Currencies from "./Currencies.svelte";
  import { ACCOUNT_SEARCH_KEY, userStore } from "../domain/user";
  import Summary from "./Summary.svelte";
  import { Router, Route } from "svelte-navigator";
  import AssetYield from "./AssetYield.svelte";
  import Pools from "./Pools.svelte";
  import GoUpButton from "./GoUpButton.svelte";
  import { getFromSearch, poolFilters } from "../domain/history";
  import LandsSummary from "./LandsSummary.svelte";
  import { ASSET_SEARCH_KEY } from "../domain/asset-staking";
</script>

<main>
  <GoogleAnalytics properties={["G-1WNKLF5N10"]} />
  <div class="container">
    <Router>
      <Header />

      <Route path="/">
        <AccountInput account={getFromSearch(ACCOUNT_SEARCH_KEY)} />
        {#if $userStore.account}
          <GoUpButton />
          <Summary />
          <Currencies />
          <AccountStaking />
          <PassiveIncome />
          <AccountHoldings />
          <LandsSummary />
        {:else}
          <Currencies />
        {/if}
      </Route>

      <Route path="asset-staking">
        <AssetYield assetId={getFromSearch(ASSET_SEARCH_KEY)} />
      </Route>

      <Route path="pools">
        <Pools filters={$poolFilters} />
      </Route>

      <Route path="donation">
        <Donations />
      </Route>
    </Router>
  </div>
  <Footer />
</main>
