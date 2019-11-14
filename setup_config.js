module.exports.config = {
  region: "us-east-1",
  serviceName: "uportlandia",
  ssmParam: {
    issuers: "/uportlandia/${opt:stage}/issuers"
  },
  s3Bucket: {
    stage: "cleverland-stage",
    prod: "cleverland-prod"
  },
  domain: {
    stage: "uportlandia.uport.space",
    prod: "uportlandia.uport.me"
  },
  cors: true
};

module.exports.ISSUER_PROFILES = [
  {
    id: "CITY_ID",
    name: "City Of Lyon",
    url: {
      stage: "https://uportlandia.uport.space/city",
      prod: "https://uportlandia.uport.me/city"
    },
    profileImage: "src/images/city_of_lyon.png"
  },
  {
    id: "PHARMACY",
    name: "EDF",
    url: {
      stage: "https://uportlandia.uport.space/pharmacy",
      prod: "https://uportlandia.uport.me/pharmacy"
    },
    profileImage: "src/images/edf.png"
  },
  {
    id: "TRANSPORT",
    name: "Pole Emploi",
    url: {
      stage: "https://uportlandia.uport.space/transport",
      prod: "https://uportlandia.uport.me/transport"
    },
    profileImage: "src/images/pole_emploi.png"
  },
  {
    id: "DIPLOMA",
    name: "Pole Emploi",
    url: {
      stage: "https://uportlandia.uport.space/university",
      prod: "https://uportlandia.uport.me/university"
    },
    profileImage: "src/images/sncf.png"
  }
];
