<script lang="ts">
  import { nightMode } from "../domain/store";
import NightModeToggle from "./NightModeToggle.svelte";
</script>

<main>
  <section class="hero">
    <div class="hero-body columns">
      <div class="column">
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
      <div class="column">
        <div class="tabs is-right">
          <ul>
            <li><a>Calculator</a></li>
            <li><a>Staking</a></li>
            <li><a>Glossary</a></li>
            <li><a>Contact</a></li>
            <NightModeToggle />
          </ul>
        </div>
      </div>
    </div>

  </section>
</main>

<style>
  .night-whale {
    filter: saturate(0%);
  }
</style>
