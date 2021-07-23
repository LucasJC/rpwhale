<script lang="ts">
  import { nightMode } from "../domain/night-mode";
  import NightModeToggle from "./NightModeToggle.svelte";
  import { link, useLocation } from "svelte-navigator";
  export let items: {
    url: string;
    label: string;
  }[];
  const location = useLocation();
  let isMenuActive = false;
</script>

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="column">
      <p class="title">
        RP Whale <span class:desaturated={$nightMode}>🐳</span>
      </p>
      <p class="subtitle">
        Unofficial staking calculator utility for <a
          href="https://rplanet.io"
          target="_blank">RPlanet</a
        >.
      </p>
    </div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      class:is-active={isMenuActive}
      on:click={() => (isMenuActive = !isMenuActive)}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>
  <div
    class="navbar-menu"
    class:is-active={isMenuActive}
    on:click={() => (isMenuActive = !isMenuActive)}
  >
    <div class="navbar-start">
      <!-- navbar items -->
    </div>
    <div class="navbar-end">
      {#each items as item}
        <a
          class="navbar-item"
          class:is-active={$location.pathname === item.url}
          href={item.url}
          use:link
        >
          {item.label}
        </a>
      {/each}
      <div class="navbar-item">
        <NightModeToggle />
      </div>
    </div>
  </div>
</nav>
