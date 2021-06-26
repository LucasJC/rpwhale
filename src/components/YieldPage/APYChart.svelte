<script lang="ts">
  import moment from "moment";
  import { ScaleTypes } from "@carbon/charts/interfaces/enums";
  import { LineChart } from "@carbon/charts-svelte";
  import type { APY } from "../../domain/apy";

  export let apy: APY;
  export let capital: number = 1000;

  let data = [{ group: "no-compounding", x: new Date(), y: 10 }];
  const next12Months = "x"
    .repeat(12)
    .split("")
    .map((_, index) => moment().add(index, "month"));

  $: {
    let mpy = apy?.mpy() || 0.1;
    if (mpy == Infinity) {
      mpy = 0.1;
    }

    const linear = next12Months.map((date, index) => ({
      group: "no compounding",
      x: date.toDate(),
      y: capital + capital * mpy * index,
    }));

    const compounding = next12Months.map((date, index) => ({
      group: "compounding monthly",
      x: date.toDate(),
      y: capital * (1 + mpy) ** index,
    }));

    data = [...linear, ...compounding];
  }
</script>

<LineChart
  {data}
  options={{
    title: "",
    axes: {
      left: {
        mapsTo: "y",
      },
      bottom: {
        mapsTo: "x",
        scaleType: ScaleTypes.TIME,
      },
    },
    height: "400px",
  }}
/>
