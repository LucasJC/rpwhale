<script lang="ts">
	import Footer from "./Footer.svelte";
	import Header from "./Header.svelte";
	import StakingPower from "./StakingPower.svelte";
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
</script>

<main>
	<GoogleAnalytics properties={["G-1WNKLF5N10"]} />
	<div class="container">
		<Header/>
		<StakingPower></StakingPower>
	</div>
	<Footer/>
</main>