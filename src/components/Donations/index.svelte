<script lang="ts">
  import { userStore, wcw } from "../../domain/user";
  import { store as featureRequests } from "../../domain/feature-requests";
  import Address from "./Address.svelte";

  const formatWax = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  }).format;

  const WAX_ADDRESS = "glrrk.wam";
  let waxToDonate: number = 200;

  let requestedFeature: string = "";

  async function donate(wax: number): Promise<void> {
    try {
      const result = await wcw.api.transact(
        {
          actions: [
            {
              account: "eosio.token",
              name: "transfer",
              authorization: [
                {
                  actor: (wcw as any).userAccount,
                  permission: "active",
                },
              ],
              data: {
                from: (wcw as any).userAccount,
                to: WAX_ADDRESS,
                quantity: `${formatWax(wax)} WAX`,
                memo: requestedFeature
                  ? `____feature:${requestedFeature}`
                  : `donation`,
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

<div class="section">
  <p class="title is-4">Collaborate and support our work</p>
  <p>
    This tool is open source and available to everyone at <a
      target="__blank"
      href="https://github.com/LucasJC/rpwhale/issues?q=is%3Aopen+is%3Aissue+label%3Afeature"
      >Github <span class="fab fa-github" /></a
    >.
    <br />Drop by if you want to ask for new features or participate in existing
    requests.
  </p>

  <div class="mt-4">
    Our wax address for donations: <Address address={WAX_ADDRESS} />
  </div>

  <div class="box mt-6">
    <p class="title is-4">Request a feature!</p>

    <p class="mb-4">
      You can express your interest in a specific feature below:
    </p>

    <fieldset disabled={!$userStore.isLoggedIn}>
      <div class="field">
        <label class="label" for="feature-select"
          >1 - Select a feature to support (Optional):</label
        >
        <div class="control">
          <div class="select">
            <select
              id="feature-select"
              name="feature request"
              bind:value={requestedFeature}
            >
              <option value="" />
              {#each $featureRequests as issue}
                <option value={issue.number}>
                  {`#${issue.number} ${issue.title}`}
                </option>
              {/each}
            </select>
          </div>
        </div>
      </div>
      <p class="label">2 - Proceed to make a donation:</p>
      <div class="field is-grouped is-grouped-multiline">
        <div class="control">
          <button class="button is-info" on:click={() => donate(50)}
            >Donate 50 Wax</button
          >
        </div>

        <div class="control">
          <button class="button is-info" on:click={() => donate(100)}
            >Donate 100 Wax</button
          >
        </div>

        <div class="field has-addons has-tooltip">
          <div class="control">
            <input
              class="input"
              type="number"
              placeholder="Wax"
              bind:value={waxToDonate}
            />
            <p class="help">Custom amount</p>
          </div>
          <div class="control">
            <button
              class="button is-info"
              type="button"
              on:click={() => donate(waxToDonate)}>Donate</button
            >
          </div>
        </div>
      </div>

      <p class="mt-4">
        You can see all the available feature requests or create a new one
        <a
          target="__blank"
          href="https://github.com/LucasJC/rpwhale/issues?q=is%3Aopen+is%3Aissue+label%3Afeature"
          >here</a
        >
      </p>

      {#if !$userStore.isLoggedIn}
        <p class="m-4 is-medium has-background-info-light">
          Please note that you have to be logged in to donate using this form.
        </p>
      {/if}
    </fieldset>
  </div>
</div>
