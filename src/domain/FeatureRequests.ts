import type { IIssue } from "../dal/github";
import { getFeatureRequests } from "../dal/github";

import { readable } from "svelte/store";

export const store = readable<Array<IIssue>>([], (set) => {
  getFeatureRequests().then((issues) => set(issues));
});
