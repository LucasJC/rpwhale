<script lang="ts">
  import { account, accountQueryParams } from "./store";

  let accountInput: string = $account;
  function setAccount() {
    account.set(accountInput);
    accountQueryParams.set(accountInput)
  }
</script>

<main>
  <div class="section">
    <form class="form" on:submit|preventDefault={setAccount} >
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input class="input" type="text" placeholder="WAX Account" bind:value={accountInput}>
        </div>
        <div class="control">
          <span class="button is-info" href="#" on:click="{setAccount}">Calculate</span>
        </div>
      </div>
    </form>
  </div>
</main>
