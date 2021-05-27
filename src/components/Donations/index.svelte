<script lang="ts">
  import * as Account from "../../domain/Account";
  import Address from "./Address.svelte";

  const formatWax = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  }).format;

  const WAX_ADDRESS = "glrrk.wam";
  let waxToDonate: number = 200;
  // TODO this needs more work, probably enhancing the
  // account store to be able to
  // 1. refresh the app when the login is done
  // 2. be able to tell reactively if the user is logged in or not
  let isLoggedIn: boolean = true;
  /*let isLoggedIn: boolean = !!(Account.wax as any).userAccount;*/
  /*$: {*/
  /*isLoggedIn = !!(Account.wax as any).userAccount;*/
  /*console.log("isLoggedIn?", isLoggedIn);*/
  /*}*/

  // TODO check login
  async function donate(wax: number, memo: string = ""): Promise<void> {
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
