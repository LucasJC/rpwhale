<script lang="ts">
  import * as Account from "../../domain/Account";
  export let image: string = "";

  const WAX_ADDRESS = "glrrk.wam";

  async function onCopy(): Promise<void> {
    const type = "text/plain";
    const blob = new Blob([WAX_ADDRESS], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    try {
      const result = await (navigator.clipboard as any).write(data);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }

  // TODO check login
  async function donate(wax: number) {
    const result = await Account.wax.api.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "delegatebw",
            authorization: [
              {
                actor: (Account.wax as any).userAccount,
                permission: "active",
              },
            ],
            data: {
              from: (Account.wax as any).userAccount,
              receiver: WAX_ADDRESS,
              stake_net_quantity: "0.00000001 WAX",
              stake_cpu_quantity: "0.00000000 WAX",
              transfer: false,
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
  <p>
    Wax address for donations: <strong>{WAX_ADDRESS}</strong>
    <button on:click={onCopy}>Copy</button>
  </p>

  <div>
    <button on:click={() => donate(50)}>Donate 50 Wax</button>
  </div>
</div>
