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
  import { userStore } from "../domain/user";
  import Summary from "./Summary.svelte";
  import { Router, Route } from "svelte-navigator";
</script>

<main>
  <GoogleAnalytics properties={["G-1WNKLF5N10"]} />
  <div class="container">
    <Router>
      <Header />
 
      <Route path="/">
        <AccountInput />
        {#if $userStore.account}
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
        <div class="section">
          WIP
        </div>
      </Route>

      <Route path="pools">
        <div class="section">
          WIP
        </div>
      </Route>
  
      <Route path="donation">
        <div class="section">
          <Donations />
        </div>
      </Route>
    </Router>
  </div>
  <Footer />
</main>
