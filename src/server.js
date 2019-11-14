const handler = require("serverless-express/handler");
const express = require("serverless-express/express");
const bodyParser = require("body-parser");
const Credentials = require("uport-credentials").Credentials;
const verifyJWT = require("did-jwt").verifyJWT;

const app = express();
app.use(bodyParser.json());

const ISSUERS = {
  DIPLOMA: {
    did: "did:ethr:0x6164a98cd2aac8392167bc4dab95389331333f46",
    key: "700f80db98504ec16930cd71f12a5335f655a90150aa36c6f396a9cc96361794",
    vc: ["/ipfs/QmbZ8y3AyqMFKr1FwsVHgcYgwaaYT5NdPuKaTaouuzD5oY"]
  },
  TRANSPORT: {
    did: "did:ethr:0xe889925152b4474bf5be65be54ce27ce0ee203fc",
    key: "9041db432d35d144f6f7f98852ed312547e3949dbe746ed6fe23b25528613d46",
    vc: ["/ipfs/QmfRenGHcVhLJkPhBx1pnZHeceXr5zpW3mPL9dFzcaH1Bf"]
  },
  PHARMACY: {
    did: "did:ethr:0x0b0776245972ddc7b5bf355517187ec227f3a510",
    key: "5387ec1110a359f834b1d9e944d57a5ee5736cc05e5d3290b251a8124ebf9a24",
    vc: ["/ipfs/QmU2MWvipHmYoaV83Hs62JcSsKfMHmLcapU1GeTgutsNKc"]
  },
  CITY_ID: {
    did: "did:ethr:0xbcfa079c2f506a99a23c0d97f7addba750a7c2df",
    key: "be9faf03f6a06f6f3dd425e1ed88eb2ecaf8209ab8a122e329fec1d3df8f829d",
    vc: ["/ipfs/QmezwmbxRtcgKzdsEP1wsqR4BUuTzR22Xo4r7LJrx2GAiv"]
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
