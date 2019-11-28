const express = require("express");
const bodyParser = require("body-parser");
const Credentials = require("uport-credentials").Credentials;
const verifyJWT = require("did-jwt").verifyJWT;
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

const ISSUERS = {
  DIPLOMA: {
    did: 'did:ethr:0x6de61bccb8555e8e7dea7bcb056e8b1ecaa03bbb',
    key: '5613d1284e91f22e42b32d47659e832ef1e86219da37a72f579e4411a1476006',
    vc: [ '/ipfs/QmTrZF5ocGuy7aUt7o914dW6DMfMPCnvsuRt3zujFZbyJY' ]
  },
  TRANSPORT: {
    did: 'did:ethr:0x1acc4bfcdf040f6ae713f7782123a15bef89148b',
    key: '701376f918fea6327fc9e30d33556cab762b888a6e4fccf5ef92b26ad6785d92',
    vc: [ '/ipfs/QmajDpos9UDN7R8yChjrhrpjzn4KP5PT1HesLFwdypBm3Q' ]
  },
  PHARMACY: {
    did: 'did:ethr:0x358bc5a8e741b44ce425613bffde503488aef16b',
    key: 'af1e6cac2b372ccaa1ccc8794444473eeb800d9b06273caaed2038220fd5b0ae',
    vc: [ '/ipfs/QmTtcbDKLUygXjPvQEWCRHomEfLghBbVAFg9cpB1YZxWhw' ]
  },
  CITY_ID: {
    did: 'did:ethr:0x711ffad870721f51db6e8bfa0dab6c3280ac2357',
    key: '8faad90821688f0efdcc57f084799001d336359ab3e441207ec3dae72e16a531',
    vc: [ '/ipfs/QmWSoDn8t9FL8LiJD5Nzua4p9fjfx4ZSmmNwAMpLjGujSX' ]
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

app.listen(3001, () => console.log(`Example app listening on port 3001!`))
