  const createIssuers = require("./create_issuers");

async function setup() {
  env = "stage"
  const issuerData = await createIssuers(env);
  console.log("\n\n\n\n")
  console.log(issuerData);
}

setup();