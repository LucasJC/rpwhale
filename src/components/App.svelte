<script lang="ts">
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import Donations from "./Donations/index.svelte";
  import StakingPower from "./StakingPower.svelte";
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
  import { getFromSearch } from "../domain/history";
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
          <StakingPower />
          <PassiveIncome />
          <AccountHoldings />
        {:else}
          <Currencies />
        {/if}
      </Route>

      <Route path="asset-staking">
        <AssetYield />
      </Route>

      <Route path="pools">
        <Pools
          collectionFilter={getFromSearch("collection")}
          schemaFilter={getFromSearch("schema")}
          rarityFilter={getFromSearch("rarity")}
        />
      </Route>

      <Route path="donation">
        <Donations />
      </Route>
    </Router>
  </div>
  <Footer />
</main>
