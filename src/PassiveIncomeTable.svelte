<script lang="ts">
  import { format } from "./format";

  export let miningPower: number = 0;
</script>

<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
  <tr>
    <th>Period</th>
    <th>Amount</th>
  </tr>
  <tr>
    <td>hourly</td>
    <td>{format(miningPower)}</td>
  </tr>
  <tr>
    <td>daily</td>
    <td>{format(miningPower * 24)}</td>
  </tr>
  <tr>
    <td>weekly</td>
    <td>{format(miningPower * 24 * 7)}</td>
  </tr>
  <tr>
    <td>monthly</td>
    <td>{format(miningPower * 24 * 30)}</td>
  </tr>
  <tr>
    <td>yearly</td>
    <td>{format(miningPower * 24 * 365)}</td>
  </tr>
</table>
