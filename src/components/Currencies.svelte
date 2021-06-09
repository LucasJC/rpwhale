<script lang="ts">
  import { waxPrice, rplanetPrices } from "../domain/currencies";
  import Currency from "./Currency.svelte";

  interface ICurr {
    price: number;
    alt: string;
    image: string;
    tooltip: string;
  }

  let currencies: Array<ICurr> = [];

  $: {
    currencies = [
      {
        price: $waxPrice,
        alt: "WAX",
        image: "image/wax.png",
        tooltip: "USD / Wax",
      },
      {
        price: $rplanetPrices.AETHER,
        alt: "AETHER",
        image: "image/aether.png",
        tooltip: "Wax / AETHER",
      },
      {
        price: $rplanetPrices.ENEFT,
        alt: "ENEFT",
        image: "image/eneft.png",
        tooltip: "Wax / ENEFT",
      },
      {
        price: $rplanetPrices.WAXON,
        alt: "WAXON",
        image: "image/waxon.png",
        tooltip: "Wax / WAXON",
      },
      {
        price: $rplanetPrices.CAPON,
        alt: "CAPON",
        image: "image/capon.png",
        tooltip: "Wax / CAPON",
      },
      {
        price: $rplanetPrices.WECAN,
        alt: "WECAN",
        image: "image/wecan.png",
        tooltip: "Wax / WECAN",
      },
    ];
  }
</script>

<main>
  <div class="section columns is-centered">
    {#each currencies as row}
      <Currency {...row} />
    {/each}
  </div>
</main>
