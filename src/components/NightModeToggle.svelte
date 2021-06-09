<script lang="ts">
  import { nightMode } from "../domain/night-mode";
</script>

<span
  class="icon is-medium"
  on:click={nightMode.toggle}
  data-tooltip="Night mode"
>
  <i class="fa-lightbulb fa-lg fas" />
</span>
