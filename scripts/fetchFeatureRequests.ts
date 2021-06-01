import { promises as fs } from "fs";
import { getFeatureRequests } from "./github";

async function main(): Promise<void> {
  const issues = await getFeatureRequests();
  console.log(issues);

  const path = "./src/data/featureRequests.json";
  await fs.writeFile(path, JSON.stringify(issues, null, 2));

  console.log("success");
}

main().then(console.log, console.error);
