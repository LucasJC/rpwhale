<script lang="ts">
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import StakingPower from "./StakingPower.svelte";
  import { GoogleAnalytics } from "@beyonk/svelte-google-analytics";
  import AccountInput from "./AccountInput.svelte";
  import PassiveIncome from "./PassiveIncome/index.svelte";
  import AccountHoldings from "./AccountHoldings.svelte";
  import Currencies from "./Currencies.svelte";
  import { account } from "./store";
</script>

<main>
  <GoogleAnalytics properties={["G-1WNKLF5N10"]} />
  <div class="container">
    <Header />
    <AccountInput />
    <StakingPower />
    {#if $account}
      <PassiveIncome />
    {/if}
    <AccountHoldings />
    <Currencies />
  </div>
  <Footer />
</main>
