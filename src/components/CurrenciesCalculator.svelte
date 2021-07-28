<script lang="ts">
import Currencies from "./Currencies.svelte";

  let currencies = [
    {
      currency: "",
      amount: 0,
    },
  ];
</script>

<div class="section">
  <Currencies />
</div>