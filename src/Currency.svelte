<script lang="ts">
  export let image: string = "";
  export let alt: string = "";
  export let price: number = 0;
  export let tooltip: string = "";
</script>

<main>
  <div class="column is-flex is-flex-direction-row is-align-content-center">
        <figure class="image is-24x24">
          <img src={image} {alt}>
        </figure>
        <span class="has-tooltip-bottom pl-2" data-tooltip={tooltip}>{price}</span>
  </div>
</main>