<script lang="ts">
  import { nightMode } from "./store";

  // add or remove dark mode stylesheet in a hacky way when nightMode state changes
  $: {
    let darkLink = document.getElementById("dark-theme");
    if ($nightMode && !darkLink) {
      darkLink = document.createElement("link");
      darkLink["rel"] = "stylesheet";
      darkLink.id = "dark-theme";
      darkLink["href"] = "https://unpkg.com/bulma-prefers-dark";
      document.head.appendChild(darkLink);
    }
    if (!$nightMode && darkLink) {
      darkLink.remove();
    }
  }
</script>

<main>
  <div class="icon is-medium" on:click={nightMode.toggle}>
    <i class="fa-lightbulb fa-lg fas" />
  </div>
</main>

<style>
</style>
