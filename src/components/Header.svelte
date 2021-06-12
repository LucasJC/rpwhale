<script lang="ts">
  import { nightMode } from "../domain/night-mode";
  import NightModeToggle from "./NightModeToggle.svelte";
  import { link, useLocation } from "svelte-navigator";

  const location = useLocation();
  let isMenuActive = false;
</script>

<section id="header" class="hero">
  <nav class="navbar hero-body" role="navigation" aria-label="main navigation">
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
    <div class="navbar-menu" class:is-active={isMenuActive}>
      <div class="navbar-start">
        <!-- navbar items -->
      </div>

      <div class="navbar-end">
        <a
          class="navbar-item"
          class:is-active={$location.pathname === "/"}
          href="/"
          use:link
        >
          Home
        </a>
        <a
          class="navbar-item"
          class:is-active={$location.pathname === "/asset-staking"}
          href="/asset-staking"
          use:link
        >
          Asset Staking
        </a>
        <a
          class="navbar-item"
          class:is-active={$location.pathname === "/pools"}
          href="/pools"
          use:link
        >
          Pools
        </a>
        <a
          class="navbar-item"
          class:is-active={$location.pathname === "/donation"}
          href="/donation"
          use:link
        >
          Donation
        </a>
        <div class="navbar-item">
          <NightModeToggle />
        </div>
      </div>
    </div>
  </nav>
</section>
