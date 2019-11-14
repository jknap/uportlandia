const handler = require("serverless-express/handler");
const express = require("serverless-express/express");
const bodyParser = require("body-parser");
const Credentials = require("uport-credentials").Credentials;
const verifyJWT = require("did-jwt").verifyJWT;

const app = express();
app.use(bodyParser.json());

const ISSUERS = {
  DIPLOMA: {
    did: "did:ethr:0xa8cd7583c58ba013a36e2ec62c2d280cf05ab6d0",
    key: "c6ac5f3691505602694b9f0901db9536929a81b48633fc49a9cd79b57fb1730d",
    vc: ["/ipfs/QmSVDVt8NTpXakVeajvPqAbDSJWJNHcZWMsAyuRfgBTgAg"]
  },
  TRANSPORT: {
    did: "did:ethr:0xdbb25667ea5f4aa478150c2ac6a0eaa05bb107d4",
    key: "54b6bf2635d35178a60672c586ffec1163fb41739b00457935331751cb59f040",
    vc: ["/ipfs/QmSgage4VPo5aYhxX635oekYs91zUsq3PYeFEJaPz6GtHb"]
  },
  PHARMACY: {
    did: "did:ethr:0xd47090f58d2a57d8bc808a688137b7a6eba131ba",
    key: "fc354129e62aa12d4fd7661f5ad7cbc54a2f192e90380f3d2b33d0434b8ab9dd",
    vc: ["/ipfs/QmbsfX31Vie2XQt22BwzY73eV4RQXTbjLhxFmZuTSeRkbn"]
  },
  CITY_ID: {
    did: "did:ethr:0x0416792b2e61456d82cadfa2a6bc102888156a64",
    key: "ec0f9ccb6e309bca3482e9dbf1c3f9ac3429748a2166b804d392c1fa29dd9066",
    vc: ["/ipfs/QmcmRUqM6AQ4xAQjv9KHQCqgKYG22DwNQPrLTpDPsSBYjW"]
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
