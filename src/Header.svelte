<script lang="ts">
  import { nightMode } from "./store";
</script>

<main>
  <section class="hero">
    <div class="hero-body">
      <p class="title">
        RP Whale <span class:night-whale={$nightMode}>🐳</span>
      </p>
      <p class="subtitle">
        Unofficial staking calculator utility for <a
          href="https://rplanet.io"
          target="_blank">RPlanet</a
        > game.
      </p>
    </div>
  </section>
</main>

<style>
  .night-whale {
    filter: saturate(0%);
  }
</style>
