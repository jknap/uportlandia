const handler = require("serverless-express/handler");
const express = require("serverless-express/express");
const bodyParser = require("body-parser");
const Credentials = require("uport-credentials").Credentials;
const verifyJWT = require("did-jwt").verifyJWT;

const app = express();
app.use(bodyParser.json());

const ISSUERS = {
  TRANSPORT: {
    did: "did:ethr:0xe6fb18790d63bbbb4adf946b7c93060298fa7841",
    key: "fd132890302da9ce40911e8408868d58e57aece3facc2bfe20a4295e2d258653",
    vc: ["/ipfs/QmTNXaoyiQ9hkGqNqqQ3fEXE7zqDPQGMQ4t3gcK24Z5Lfc"]
  },
  PHARMACY: {
    did: "did:ethr:0xb777b254ffbedb219497cb50c81747dd5c871159",
    key: "11102c00ba45d646aa9bff979a6085a313a2d3946568a254a6e2809cd788d307",
    vc: ["/ipfs/QmPJ26thDXcbALuUTXKwkCic4rgSWPD2cxMQx2ciPZDbBq"]
  },
  CITY_ID: {
    did: "did:ethr:0xde2a394b9853db13b6b487c97d9fb6fbea56bbe5",
    key: "9baca351706f4d0dd67c6384318f6205924c9134c8a5723b3a07097d08e97b89",
    vc: ["/ipfs/QmSeUzCzkwjji2nHXCXtRynNCRzT4Jrv5EHC4VC4nEPt6X"]
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
