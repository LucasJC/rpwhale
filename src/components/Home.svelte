<script lang="ts">
  import { getFromSearch } from "../domain/history";
  import { ACCOUNT_SEARCH_KEY, userStore } from "../domain/user";
  import AccountHoldings from "./AccountHoldings.svelte";
  import AccountInput from "./AccountInput.svelte";
  import AccountStaking from "./AccountStaking.svelte";
  import Currencies from "./Currencies.svelte";
  import GoUpButton from "./GoUpButton.svelte";
  import LandsSummary from "./LandsSummary.svelte";
  import Summary from "./Summary.svelte";
  import PassiveIncome from "./PassiveIncome/index.svelte";
</script>

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