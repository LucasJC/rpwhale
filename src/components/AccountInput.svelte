<script lang="ts">
  import { updateSearch } from "../domain/history";
  import { ACCOUNT_SEARCH_KEY, userStore, wcwLogin } from "../domain/user";

  export let account: string | undefined;
  let input: string;

  $: {
    if (account) {
      userStore.setAccount(account);
      updateSearch(ACCOUNT_SEARCH_KEY, account);
    }
  }

  async function login() {
    try {
      await wcwLogin();
      input = $userStore.account;
    } catch (err) {
      console.error(err);
    }
  }
</script>

<div class="section">
  <form class="form" on:submit|preventDefault={() => (account = input)}>
    <div class="field is-grouped">
      <div class="control is-expanded">
        <input
          class="input"
          type="text"
          placeholder="WAX Account"
          bind:value={input}
        />
      </div>
      <div class="control">
        <button type="submit" class="button is-info"> Calculate </button>
      </div>
      <div class="control" on:click={login}>
        <button class="button is-link" class:is-loading={$userStore.loading}>
          {#if !$userStore.loading}
            <span class="login-wax" />
          {/if}
        </button>
      </div>
    </div>
  </form>
</div>

<style>
  .login-wax {
    background-image: url(/image/wax_wallet.png);
    width: 50px;
    height: 14px;
    background-position: 50% 50%;
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
