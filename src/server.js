const handler = require("serverless-express/handler");
const express = require("serverless-express/express");
const bodyParser = require("body-parser");
const Credentials = require("uport-credentials").Credentials;
const verifyJWT = require("did-jwt").verifyJWT;

const app = express();
app.use(bodyParser.json());

const ISSUERS = {
  TRANSPORT: {
    did: "did:ethr:0x114152f0b19fc75da23c54378b290a8b01709b27",
    key: "0db09b194bdbf17b039e3c660d2c93498b400ba38d3c56bbdbd5eca6784f93cc",
    vc: ["/ipfs/QmWmvuozBYfDDYwoTFEMfpgZ7cLSjGab9FQGAV1mtEgo4T"]
  },
  PHARMACY: {
    did: "did:ethr:0x826bdfe92abf84d9a671c3dd34dd6d9776e188e2",
    key: "e63187304de2998019d36f07c0dd8fba29027db170bfc7a16ae846bc331a9f70",
    vc: ["/ipfs/QmeprRX8WtGLDd8ZnLhqNta4odUrpQtyPjR7Q9vzeoyFaJ"]
  },
  CITY_ID: {
    did: "did:ethr:0xed2fd324359f68fad22e3d3cca183832d473cdb6",
    key: "3885b104badcb324259ed26aee3f8504faca0068d9e253c2114a014e1553d679",
    vc: ["/ipfs/QmfDhMgsN2UX9hCgsKwxjaGTHtDXCtr4jvvx9SWfL4mPa1"]
  }
};

const getCredentials = serviceId => {
  if (!ISSUERS[serviceId]) throw new Error("Invalid serviceId");
  return new Credentials({
    did: ISSUERS[serviceId].did,
    privateKey: ISSUERS[serviceId].key
  });
};

app.get("/api/ping", (req, res) => {
  res.send("OK");
});

app.post("/api/request_disclosure", async (req, res) => {
  const {
    serviceId,
    requested = ["name"],
    verified = [],
    notifications = false,
    callbackUrl,
    expiresIn = 600
  } = req.body;
  const credentials = getCredentials(serviceId);
  const jwt = await credentials.createDisclosureRequest(
    {
      requested,
      verified,
      notifications,
      callbackUrl,
      accountType: "none",
      vc: ISSUERS[serviceId].vc
    },
    expiresIn
  );
  res.json({ jwt });
});

app.post("/api/send_verification", async (req, res) => {
  const { serviceId, sub, claim, callbackUrl } = req.body;
  const credentials = getCredentials(serviceId);
  const jwt = await credentials.createVerification({
    sub,
    vc: ISSUERS[serviceId].vc,
    claim,
    callbackUrl
  });
  res.json({ jwt });
});

app.post("/api/verify_credentials", async (req, res) => {
  const { serviceId, token } = req.body;
  const credentials = getCredentials(serviceId);
  const response = await verifyJWT(token, { audience: credentials.did });
  const profile = await credentials.processDisclosurePayload(response);
  profile.publicEncKey = profile.boxPub;
  res.json({ profile });
});

module.exports.handler = handler(app);
