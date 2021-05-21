<script lang="ts">
	import Footer from "./Footer.svelte";
	import Header from "./Header.svelte";
	import StakingPower from "./StakingPower.svelte";
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
import AccountInput from "./AccountInput.svelte";
import PassiveIncome from "./PassiveIncome.svelte";
import AccountHoldings from "./AccountHoldings.svelte";
</script>

<main>
	<GoogleAnalytics properties={["G-1WNKLF5N10"]} />
	<div class="container">
		<Header/>
		<AccountInput></AccountInput>
		<StakingPower></StakingPower>
		<PassiveIncome></PassiveIncome>
		<AccountHoldings></AccountHoldings>
	</div>
	<Footer/>
</main>