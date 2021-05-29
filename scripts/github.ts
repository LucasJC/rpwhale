import fetch from "node-fetch";

const GITHUB_API = `https://api.github.com`;
const REPO = `LucasJC/rpwhale`;
const FEATURE_LABEL = `feature`;

export interface IIssue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  labels: Array<{
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string;
  }>;
  state: string;
  locked: boolean;
  assignee: null;
  assignees: Array<unknown>;
  milestone: null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  author_association: string;
  active_lock_reason: string;
  body: string;
  performed_via_github_app: string;
}

// TODO handle more than one page,
// pag doc https://docs.github.com/en/rest/guides/traversing-with-pagination
// doc https://docs.github.com/en/rest/reference/issues
export async function getFeatureRequests(): Promise<Array<IIssue>> {
  const url = `${GITHUB_API}/repos/${REPO}/issues?labels=${FEATURE_LABEL}&per_page=100`;
  const res = await fetch(url);
  console.log("headers", res.headers, res.status);
  if (res.status < 200 || res.status > 299) {
    throw res;
  }

  const body = await res.json();
  return body;
}
