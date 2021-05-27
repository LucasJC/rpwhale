<script lang="ts">
  import * as Account from "../../domain/Account";
  import Address from "./Address.svelte";
  export let image: string = "";

  const WAX_ADDRESS = "glrrk.wam";

  // TODO check login
  async function donate(wax: number) {
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
              quantity: "0.00000001 WAX",
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
  }
</script>

<div class="">
  <h3>Support our work:</h3>
  <Address address={WAX_ADDRESS} />

  <div>
    <button on:click={() => donate(50)}>Donate 50 Wax</button>
  </div>
</div>
