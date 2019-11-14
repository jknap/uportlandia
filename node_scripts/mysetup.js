  const createIssuers = require("./create_issuers");

async function setup() {
  env = "stage"
  const issuerData = await createIssuers(env);
  console.log("Issuers created: ", issuerData);
  console.table(issuerData);
}

setup();