<script lang="ts">
  import Currency from "./Currency.svelte";
  import {
    aetherPrice,
    caponPrice,
    eneftPrice,
    waxonPrice,
    waxPrice,
    wecanPrice,
  } from "./store";

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
        price: $aetherPrice,
        alt: "AETHER",
        image: "image/aether.png",
        tooltip: "Wax / AETHER",
      },
      {
        price: $eneftPrice,
        alt: "ENEFT",
        image: "image/eneft.png",
        tooltip: "Wax / ENEFT",
      },
      {
        price: $waxonPrice,
        alt: "WAXON",
        image: "image/waxon.png",
        tooltip: "Wax / WAXON",
      },
      {
        price: $caponPrice,
        alt: "CAPON",
        image: "image/capon.png",
        tooltip: "Wax / CAPON",
      },
      {
        price: $wecanPrice,
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
