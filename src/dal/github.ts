import type { IIssue } from "../../scripts/github";
import issues from "../data/featureRequests.json";

export type { IIssue };

export function getFeatureRequests(): Array<IIssue> {
  return issues;
}
