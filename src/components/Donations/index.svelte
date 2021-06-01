<script lang="ts">
  import { store as user } from "../../domain/User";
  import * as User from "../../domain/User";
  import Address from "./Address.svelte";

  const formatWax = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  }).format;

  const WAX_ADDRESS = "glrrk.wam";
  let waxToDonate: number = 200;

  async function donate(wax: number, memo: string = ""): Promise<void> {
    try {
      const result = await User.wax.api.transact(
        {
          actions: [
            {
              account: "eosio.token",
              name: "transfer",
              authorization: [
                {
                  actor: (User.wax as any).userAccount,
                  permission: "active",
                },
              ],
              data: {
                from: (User.wax as any).userAccount,
                to: WAX_ADDRESS,
                quantity: `${formatWax(wax)} WAX`,
                memo,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<div class="">
  <h3>Support our work:</h3>
  <Address address={WAX_ADDRESS} />

  {#if !$user.isLoggedIn}
    <p>Log in to donate directly from here:</p>
  {/if}
  <div class="donations is-flex is-justify-content-center">
    <button
      class="button is-info"
      on:click={() => donate(50)}
      disabled={!$user.isLoggedIn}>Donate 50 Wax</button
    >
    <button
      class="button is-info"
      on:click={() => donate(100)}
      disabled={!$user.isLoggedIn}>Donate 100 Wax</button
    >
    <input
      class="input"
      type="number"
      placeholder="Wax"
      bind:value={waxToDonate}
      disabled={!$user.isLoggedIn}
    />
    <button
      class="button is-info"
      type="button"
      on:click={() => donate(waxToDonate)}
      disabled={!$user.isLoggedIn}>Donate</button
    >
  </div>
</div>

<style>
  .donations {
    gap: 5px;
  }
  .donations > input {
    width: 100px;
  }
</style>
