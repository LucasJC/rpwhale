<script lang="ts">
  import humanFormat from "human-format";
  import { format } from "../domain/currencies";

  export let value: number = 0;

  let fmtValue: string = "";
  $: {
    try {
      fmtValue = humanFormat(Number(value.toFixed(2)), { decimals: 2 });
    } catch (err) {
      console.error(`Failed to format number`, err);
    }
  }
</script>

<span class="has-tooltip-top has-tooltip-info" data-tooltip={format(value)}>
  {fmtValue}
</span>
