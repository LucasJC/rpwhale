<script lang="ts">
	import Footer from "./Footer.svelte";
	import StakingConfigs from "./StakingConfigs.svelte";
</script>

<main>
	<p class="title">RPlanet Staking Configuration</p>
	<StakingConfigs></StakingConfigs>
	<Footer></Footer>
</main>

<style>
	@import "https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css";
	@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>