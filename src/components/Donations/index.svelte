<script lang="ts">
  import * as Account from "../../domain/Account";
  import Address from "./Address.svelte";

  const WAX_ADDRESS = "glrrk.wam";
  let waxToDonate: number = 200;
  let isLoggedIn: boolean = !!(Account.wax as any).userAccount;
  $: {
    isLoggedIn = !!(Account.wax as any).userAccount;
    console.log("isLoggedIn?", isLoggedIn);
  }

  // TODO check login
  async function donate(wax: number, memo?: string): Promise<void> {
    try {
      const result = await Account.wax.api.transact(
        {
          actions: [
            {
              account: "eosio.token",
              name: "transfer",
              authorization: [
                {
                  actor: (Account.wax as any).userAccount,
                  permission: "active",
                },
              ],
              data: {
                from: (Account.wax as any).userAccount,
                to: WAX_ADDRESS,
                quantity: `${wax} WAX`,
                memo: "This is a WaxJS/Cloud Wallet Demo.",
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

  {#if !isLoggedIn}
    <p>Log in to donate directly from here:</p>
  {/if}
  <div class="donations is-flex is-justify-content-center">
    <button
      class="button is-info"
      on:click={() => donate(50)}
      disabled={!isLoggedIn}>Donate 50 Wax</button
    >
    <button
      class="button is-info"
      on:click={() => donate(100)}
      disabled={!isLoggedIn}>Donate 100 Wax</button
    >
    <input
      class="input"
      type="number"
      placeholder="Wax"
      bind:value={waxToDonate}
      disabled={!isLoggedIn}
    />
    <button
      class="button is-info"
      type="button"
      on:click={() => donate(waxToDonate)}
      disabled={!isLoggedIn}>Donate</button
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
