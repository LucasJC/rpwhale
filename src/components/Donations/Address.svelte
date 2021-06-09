<script lang="ts">
  import Clipboard from "clipboard";
  export let address: string = "";

  // TODO do this onmount only?
  try {
    new Clipboard(".copy-wax-address");
  } catch (err) {
    console.log("error clipboard", err);
  }
</script>

<strong>{address}</strong>
<button
  class="ml-1 copy-wax-address button is-small is-info"
  data-clipboard-text={address}>Copy</button
>
