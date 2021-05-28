<script lang="ts">
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import StakingPower from "./StakingPower.svelte";
  import { GoogleAnalytics } from "@beyonk/svelte-google-analytics";
  import AccountInput from "./AccountInput.svelte";
  import PassiveIncome from "./PassiveIncome/index.svelte";
  import AccountHoldings from "./AccountHoldings.svelte";
  import Currencies from "./Currencies.svelte";
  import { account } from "../domain/store";
  import Summary from "./Summary.svelte";
  import { store as featureRequests } from "../domain/FeatureRequests";
</script>

<main>
  <GoogleAnalytics properties={["G-1WNKLF5N10"]} />
  <div class="container">
    <Header />
    {#each $featureRequests as issue}
      <div>{issue.url}</div>
      <div>{issue.title}</div>
    {/each}
    <AccountInput />
    {#if $account}
      <Summary />
      <Currencies />
      <StakingPower />
      <PassiveIncome />
      <AccountHoldings />
    {:else}
      <Currencies />
    {/if}
  </div>
  <Footer />
</main>
