<script lang="ts">
  import { aetherPrice, caponPrice, eneftPrice, waxonPrice, waxPrice, wecanPrice } from "./store";
</script>

<main>
  <p class="has-text-centered is-italic">
    <span class="has-tooltip-bottom" data-tooltip="Aether price taken from Alcor Exchange API.">{$aetherPrice} Wax/Aether</span> - 
    <span class="has-tooltip-bottom" data-tooltip="Wax price taken from CoinGecko API.">{$waxPrice} USD/Wax</span> - 
    <span class="has-tooltip-bottom" data-tooltip="Caponite price taken from Alcor Exchange API.">{$caponPrice} Wax/CAPON</span> - 
    <span class="has-tooltip-bottom" data-tooltip="Enefterium price taken from Alcor Exchange API.">{$eneftPrice} Wax/ENEFT</span> - 
    <span class="has-tooltip-bottom" data-tooltip="Waxon price taken from Alcor Exchange API.">{$waxonPrice} Wax/WAXON</span> - 
    <span class="has-tooltip-bottom" data-tooltip="Wecanite price taken from Alcor Exchange API.">{$wecanPrice} Wax/WECAN</span> - 
  </p>
</main>