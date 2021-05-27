<script lang="ts">
  import { store as account } from "../domain/Account";
  import * as Account from "../domain/Account";

  let accountInput: string = $account;
  $: {
    accountInput = $account;
  }

  function setAccount() {
    Account.set(accountInput);
  }

  async function login() {
    try {
      Account.login();
    } catch (err) {
      console.error(err);
    }
  }
</script>

<main>
  <div class="section">
    <form class="form" on:submit|preventDefault={setAccount}>
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input
            class="input"
            type="text"
            placeholder="WAX Account"
            bind:value={accountInput}
          />
        </div>
        <div class="control">
          <button type="submit" class="button is-info" on:click={setAccount}>
            Calculate
          </button>
        </div>
        <div class="control" on:click={login}>
          <button class="button is-link">
            <span class="login-wax" />
          </button>
        </div>
      </div>
    </form>
  </div>
</main>

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
