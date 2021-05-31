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

<p>
  Wax address for donations: <strong>{address}</strong>
  <button
    class="copy-wax-address button is-small is-info"
    data-clipboard-text={address}>Copy</button
  >
</p>
