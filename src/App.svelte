<script lang="ts">
	import Footer from "./Footer.svelte";
	import Header from "./Header.svelte";
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
	import StakingConfigs from "./StakingConfigs.svelte";
</script>

<main>
	<GoogleAnalytics properties={["G-1WNKLF5N10"]} />
	<Header/>
	<StakingConfigs/>
	<Footer/>
</main>