<script lang="ts">
  import Navbar from "./Navbar.svelte";
  const items = [
    { url: "/", label: "Home" },
    { url: "/asset-staking", label: "Asset Staking" },
    { url: "/pools", label: "Pools" },
    { url: "/yield", label: "APY" },
    { url: "/donation", label: "Donation" },
  ];
</script>

<section id="header" class="hero">
  <div class="hero-body">
    <Navbar {items} />
  </div>
</section>
