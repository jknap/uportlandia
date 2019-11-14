const handler = require("serverless-express/handler");
const express = require("serverless-express/express");
const bodyParser = require("body-parser");
const Credentials = require("uport-credentials").Credentials;
const verifyJWT = require("did-jwt").verifyJWT;

const app = express();
app.use(bodyParser.json());

const ISSUERS = {
  TRANSPORT: {
    did: "did:ethr:0x5ce317c4928d6c7ccb60f26400e686fd2a5d83ed",
    key: "b5713c84895b1c941d5ef172518cdca9366fb219a982f0721751eaab20beb6cb",
    vc: ["/ipfs/QmaPvppSXzmQnMrrzkK6MUtGJYW5URchfupFphumFyLxZj"]
  },
  PHARMACY: {
    did: "did:ethr:0xd9a6a24d4fc0f287bb331a162d319829456d0701",
    key: "49a7a671ebbd1acf9e2a2359366713fe8aa8836d32d3aec6320387c6b79596d4",
    vc: ["/ipfs/QmZK2PFzrRTuSn8EPm5fYCo25xpSRo5Vx6KpAAoPcdevTz"]
  },
  CITY_ID: {
    did: "did:ethr:0xc51bf4036b4a8b93a7ed386f79a94ad67ff0b402",
    key: "e4caf59682bf7ad4e7182c31fcdc83a2b40767aca7fd1d09f4f1d35b081ed727",
    vc: ["/ipfs/QmYFukJN5kVAMWNxrtBMgSMvEpFN6YG8CfCWHeFgtKGhsM"]
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
