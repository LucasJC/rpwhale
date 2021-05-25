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
</script>

<main>
    <div class="section columns is-centered">
      <Currency price={$waxPrice} alt="WAX" image="image/wax.png" tooltip="USD / Wax" />
      <Currency price={$aetherPrice} alt="AETHER" image="image/aether.png" tooltip="Wax / AETHER" />
      <Currency price={$caponPrice} alt="CAPON" image="image/capon.png" tooltip="Wax / CAPON" />
      <Currency price={$eneftPrice} alt="ENEFT" image="image/eneft.png" tooltip="Wax / ENEFT" />
      <Currency price={$waxonPrice} alt="WAXON" image="image/waxon.png" tooltip="Wax / WAXON" />
      <Currency price={$wecanPrice} alt="WECAN" image="image/wecan.png" tooltip="Wax / WECAN" />
    </div>
</main>
