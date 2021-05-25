<script lang="ts">
  import { format } from "../format";

  export let hourlyAmount: number = 0;
</script>

<table class="table is-bordered is-striped is-narrow is-fullwidth has-text-centered">
  <tr>
    <th>Period</th>
    <th>Amount</th>
  </tr>
  <tr>
    <td>hourly</td>
    <td class="has-text-right">{format(hourlyAmount)}</td>
  </tr>
  <tr>
    <td>daily</td>
    <td class="has-text-right">{format(hourlyAmount * 24)}</td>
  </tr>
  <tr>
    <td>weekly</td>
    <td class="has-text-right">{format(hourlyAmount * 24 * 7)}</td>
  </tr>
  <tr>
    <td>monthly</td>
    <td class="has-text-right">{format(hourlyAmount * 24 * 30)}</td>
  </tr>
  <tr>
    <td>yearly</td>
    <td class="has-text-right">{format(hourlyAmount * 24 * 365)}</td>
  </tr>
</table>
