<script lang="ts">
  import type { NavbarItem } from "../domain/navbar";
  import Navbar from "./Navbar.svelte";
  export let items: NavbarItem[];
</script>

<section id="header" class="hero">
  <div class="hero-body">
    <Navbar {items} />
  </div>
</section>
