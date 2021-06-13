<script lang="ts">
  import { prevent_default } from "svelte/internal";

  import type { ListingAsset } from "../domain/asset-staking";
  import { accountLands, LAND_TYPE } from "../domain/land";

  interface LandSummaryItem {
    key: string;
    mineral: string;
    location: string;
    rarity: string;
    level: string;
    baseRate: string;
    quantity: number;
    colorClass: string;
  }

  interface Location {
    name: string;
    lands: LandSummaryItem[];
    totalLands: number;
  }

  let locations: Array<Location>;

  $: locations = load($accountLands);

  function load(lands: ListingAsset[]): Array<Location> {
    const locationsSet: Set<string> = new Set();
    const summary = new Map<string, LandSummaryItem>();
    for (let land of lands) {
      const key =
        land.data?.name +
        land.data?.rarity +
        land.data?.location +
        land.data?.level;
      let item = summary.get(key);
      if (!item) {
        item = {
          key,
          mineral: land.data?.name,
          location: land.data?.location,
          rarity: land.data?.rarity,
          level: land.data?.level,
          baseRate: land.data?.base_rate,
          quantity: 1,
          colorClass: colorClass(land.data?.mineral),
        };
        locationsSet.add(land.data?.location);
        summary.set(key, item);
      } else {
        item.quantity = item.quantity + 1;
      }
    }

    let locs: Array<Location> = [];
    for (let location of Array.from(locationsSet)) {
      const items = Array.from(summary.values())
        .filter((el) => el.location === location)
        .sort((a, b) => a.key.localeCompare(b.key));
      const totalLands = items
        .map((l) => l.quantity)
        .reduceRight((prev, cur) => prev + cur);
      locs.push({
        name: location,
        lands: items,
        totalLands,
      });
    }
    return locs;
  }

  function colorClass(mineral: string): string {
    if (LAND_TYPE.CAPONIUM === mineral) {
      return "has-text-link";
    }
    if (LAND_TYPE.ENEFTERIUM === mineral) {
      return "has-text-success";
    }
    if (LAND_TYPE.WAXON === mineral) {
      return "has-text-warning";
    }
    if (LAND_TYPE.WECANITE === mineral) {
      return "has-text-danger";
    }
    return "";
  }
</script>

{#if locations && locations.length > 0}
  <div class="section">
    <p class="title is-4">Land Assets Summary</p>
    {#each locations as location}
      <p class="title is-5">Lands in {location.name}</p>
      <table
        class="table is-bordered is-narrow is-fullwidth has-text-centered is-hcentered"
      >
        <tr>
          <th>Mineral</th>
          <th>Location</th>
          <th>Rarity</th>
          <th>Level</th>
          <th>Base Rate</th>
          <th>Quantity</th>
        </tr>
        {#each location.lands as land}
          <tr>
            <td class={"has-text-weight-semibold " + land.colorClass}
              >{land.mineral}</td
            >
            <td>{land.location}</td>
            <td>{land.rarity}</td>
            <td>{land.level}</td>
            <td>{land.baseRate}</td>
            <td>{land.quantity}</td>
          </tr>
        {/each}
        <tr
          class="has-text-weight-bold has-background-info-light has-text-info-dark"
        >
          <td>TOTAL</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>{location.totalLands}</td>
        </tr>
      </table>
    {/each}
  </div>
{/if}
