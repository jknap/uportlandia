import dayjs from "dayjs";

// Images/Logos
import logo from "../images/uport-logo.svg";
import CityIDIcon from "../images/city_of_lyon.png";
import DiplomaIcon from "../images/sncf.png";
import EmploymentIcon from "../images/company-logo.png";
import InsuranceIcon from "../images/insurance-logo.png";
import PharmacyIcon from "../images/edf-logo.svg";
import TransportIcon from "../images/pole_emploi.png";
import MuseumIcon from "../images/museum-logo.png";
import COUNTRIES from "./countries";

import getSignerUrl from "./signerUrl";

// Home Page
export const home = {
  logo: logo,
  logoLink: "https://uport.me/",
  name: "uPortlandia"
};

// Registration Flow
export const registration = {
  path: "/city",
  name: "City ID",
  serviceId: "CITY_ID",
  text: {
    landingSteps: ["regnLandingStep1", "regnLandingStep2", "regnLandingStep3"]
  },
  form: {
    firstName: {
      label: "First Name",
      defaultValue: "",
      type: "text",
      required: true
    },
    lastName: {
      label: "Last Name",
      defaultValue: "",
      type: "text",
      required: true
    },
    address: {
      label: "Address",
      defaultValue: "",
      type: "text",
      required: true
    },
    city: {
      label: "City",
      defaultValue: "",
      type: "text",
      required: true
    },
    province: {
      label: "State or Province",
      defaultValue: "",
      type: "text",
      required: true
    },
    zipCode: {
      label: "Zip Code",
      defaultValue: "",
      type: "text",
      required: true
    },
    country: {
      label: "Country",
      defaultValue: "",
      type: "dropdown",
      items: COUNTRIES,
      required: true
    },
    dob: {
      label: "Date of Birth",
      defaultValue: "",
      placeholder: "YYYY-MM-DD",
      type: "date",
      min: "1900-01-01",
      max: dayjs()
        .add(-13, "year")
        .format("YYYY-MM-DD"),
      required: true,
      isValid: value => {
        const today = dayjs();
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
          !dayjs(value).isValid() ||
          dayjs(value).year() > today.year() - 13 ||
          dayjs(value).year() < 1900
        ) {
          return {
            valid: false,
            fieldId: "dob",
            error: "Invalid date of birth"
          };
        }
        return { valid: true };
      }
    },
    toc: {
      label: "I agree to the uPort",
      defaultValue: false,
      link: "https://www.uport.me/terms-conditions",
      linkLabel: "Terms and Conditions",
      type: "tnc",
      required: true,
      validationError: "You must agree to the terms and conditions"
    }
  }
};

const CITY_ID = {
  // This should match the Registration Config
  id: "CITY_ID",
  name: "City of Lyon",
  displayName: "cityIdDisplayName",
  icon: CityIDIcon,
  entity: "City of Lyon",
  description: "cityIdDescription",
  url: "/city",
  claim: "Lyon City ID",
  steps: ["cityIdStep1", "cityIdStep2", "cityIdStep3", "cityIdStep4"]
};

const PHARMACY = {
  id: "PHARMACY",
  name: "Proof of Residency",
  displayName: "pharmacyDisplayName",
  icon: PharmacyIcon,
  entity: "EDF",
  description: "pharmacyDescription",
  url: "/edf",
  claim: "Proof of Residency",
  steps: [],
  details: [],
  claimData: {
    "Proof of Residency": "Certified Address"
  }
};

const TRANSPORT = {
  id: "TRANSPORT",
  name: "Unemployment Card",
  displayName: "transportDisplayName",
  icon: TransportIcon,
  entity: "uPortlandia City Transit",
  description: "transportDescription",
  url: "/pole-emploi",
  claim: "Unemployment Card",
  steps: ["transportStep1", "transportStep2", "transportStep3"],
  details: [],
  claimData: {
    "Delivered on": "October 2019"
  }
};

// All Services
const DIPLOMA = {
  id: "DIPLOMA",
  name: "SNCF Unemployment Discount Card",
  displayName: "diplomaDisplayName",
  icon: DiplomaIcon,
  entity: "SNCF",
  description: "diplomaDescription",
  url: "/sncf",
  claim: "Unemployment discount card",
  steps: ["diplomaStep1", "diplomaStep2", "diplomaStep3"],
  details: [],
  claimData: {
    "Issuer": "SNCF",
    "Region": "Midi Pyrénées",
    "Access to": "TER, TGV",
    "Status": "Active"
  }
};

const COMPANY = {
  id: "COMPANY",
  name: "Employment Verification",
  displayName: "employmentDisplayName",
  icon: EmploymentIcon,
  entity: "Dream Job LLC",
  description: "employmentDescription",
  url: "/company",
  claim: "Employment",
  steps: ["employmentStep1", "employmentStep2", "employmentStep3"],
  details: ["companyDetail1", "companyDetail2"],
  claimData: {
    "Company Name": "Dream Job LLC.",
    Salary: "$100,000",
    "Date of Employment": "01/06/2019"
  }
};

const INSURANCE = {
  id: "INSURANCE",
  name: "Insurance Coverage",
  displayName: "insuranceDisplayName",
  icon: InsuranceIcon,
  entity: "People Care Insurance LLC",
  description: "insuranceDescription",
  url: "/insurance",
  claim: "Insurance",
  steps: ["insuranceStep1", "insuranceStep2", "insuranceStep3"],
  details: ["insuranceDetail1"],
  claimData: {
    "Policy Number": "0000",
    "Group Number": "G-01",
    Dependencies: "2"
  }
};

const MUSEUM = {
  id: "MUSEUM",
  name: "Annual Membership",
  displayName: "museumDisplayName",
  icon: MuseumIcon,
  entity: "uPortlandia Museum of Modern Art",
  description: "museumDescription",
  url: "/museum",
  claim: "Museum Membership",
  steps: ["museumStep1", "museumStep2", "museumStep3"],
  details: ["museumDetail1"],
  claimData: {
    "Annual Membership": "2019"
  }
};

const YOURSELF = {
  id: "YOURSELF",
  name: "Yourself, Any Issuer",
  displayName: "Yourself, Any Issuer",
  icon: CityIDIcon,
  entity: "Yourself, Any Issuer",
  description: "Yourself, Any Issuer"
};

// Claims
const FIRST_NAME = {
  id: "firstName",
  name: "First Name",
  displayName: "First Name",
  issuedBy: [CITY_ID],
  honoredBy: [DIPLOMA, INSURANCE, MUSEUM, TRANSPORT, PHARMACY]
};

const LAST_NAME = {
  id: "lastName",
  name: "Last Name",
  displayName: "Last Name",
  issuedBy: [CITY_ID],
  honoredBy: [DIPLOMA, INSURANCE, MUSEUM, TRANSPORT, PHARMACY]
};

const CONTRACT_NUMBER = {
  id: "contractNumber",
  name: "EDF Contract Number",
  displayName: "EDF Contract Number",
  issuedBy: [PHARMACY],
  honoredBy: []
};

const DATE_OF_BIRTH = {
  id: "dob",
  name: "Date of Birth",
  displayName: "Date of Birth",
  issuedBy: [CITY_ID],
  honoredBy: [DIPLOMA, INSURANCE, MUSEUM, TRANSPORT, PHARMACY]
};

const ADDRESS = {
  id: "address",
  name: "Address",
  displayName: "Address",
  issuedBy: [CITY_ID],
  honoredBy: [DIPLOMA, INSURANCE, MUSEUM, TRANSPORT, PHARMACY]
};

const SCHOOL_NAME = {
  name: "Issuer",
  displayName: "Issuer",
  issuedBy: [DIPLOMA],
  honoredBy: [COMPANY]
};

const PROGRAM_NAME = {
  name: "Region",
  displayName: "Region",
  type: "required",
  issuedBy: [DIPLOMA],
  honoredBy: [COMPANY]
};

const FINAL_GRADES = {
  name: "Final Grades",
  displayName: "Final Grades",
  issuedBy: [DIPLOMA],
  honoredBy: [COMPANY]
};

const GRADUATION_YEAR = {
  name: "Access to",
  displayName: "Status",
  issuedBy: [DIPLOMA],
  honoredBy: [INSURANCE, COMPANY]
};

const COMPANY_NAME = {
  name: "Company Name",
  displayName: "Company Name",
  issuedBy: [COMPANY],
  honoredBy: [INSURANCE]
};

const SALARY = {
  name: "Salary",
  displayName: "Salary",
  issuedBy: [COMPANY]
};

const DATE_OF_EMPLOYMENT = {
  name: "Date of Employment",
  displayName: "Date of Employment",
  issuedBy: [COMPANY],
  honoredBy: [INSURANCE]
};

const POLICY_NUMBER = {
  name: "Policy Number",
  displayName: "Policy Number",
  issuedBy: [INSURANCE],
  honoredBy: [PHARMACY]
};

const GROUP_NUMBER = {
  name: "Group Number",
  displayName: "Group Number",
  issuedBy: [INSURANCE],
  honoredBy: [PHARMACY]
};

const DEPENDENCIES = {
  name: "Dependencies",
  displayName: "Dependencies",
  issuedBy: [INSURANCE],
  honoredBy: [PHARMACY]
};

const PRESCRIPTION_DRUG = {
  name: "Proof of Residency",
  displayName: "pharmacyDisplayName",
  issuedBy: [PHARMACY],
  honoredBy: [PHARMACY]
};

const BUS_TICKET = {
  name: "Unemployment Card",
  displayName: "transportDisplayName",
  issuedBy: [TRANSPORT],
  honoredBy: [TRANSPORT]
};

const MUSEUM_MEMBERSHIP = {
  name: "Annual Membership",
  displayName: "museumDisplayName",
  issuedBy: [MUSEUM],
  honoredBy: [MUSEUM]
};

// Attach claims to services
CITY_ID.generatedClaims = [FIRST_NAME, LAST_NAME, ADDRESS, DATE_OF_BIRTH];
CITY_ID.requiredClaims = CITY_ID.generatedClaims.map(c => ({
  ...c,
  issuedBy: [YOURSELF]
}));
PHARMACY.requiredServices = [CITY_ID];
PHARMACY.generatedClaims = [PRESCRIPTION_DRUG];
TRANSPORT.requiredServices = [CITY_ID];
TRANSPORT.generatedClaims = [BUS_TICKET];
DIPLOMA.requiredServices = [CITY_ID, PHARMACY, TRANSPORT];
DIPLOMA.generatedClaims = [
  SCHOOL_NAME,
  PROGRAM_NAME,
  GRADUATION_YEAR,
  FINAL_GRADES
];
COMPANY.requiredClaims = [
  FIRST_NAME,
  LAST_NAME,
  SCHOOL_NAME,
  PROGRAM_NAME,
  FINAL_GRADES
];
COMPANY.requiredServices = [CITY_ID, DIPLOMA];
COMPANY.generatedClaims = [COMPANY_NAME, SALARY, DATE_OF_EMPLOYMENT];
INSURANCE.requiredClaims = [
  FIRST_NAME,
  LAST_NAME,
  COMPANY_NAME,
  DATE_OF_EMPLOYMENT
];
INSURANCE.requiredServices = [CITY_ID, COMPANY];
INSURANCE.generatedClaims = [POLICY_NUMBER, GROUP_NUMBER, DEPENDENCIES];
MUSEUM.requiredClaims = [FIRST_NAME, LAST_NAME, ADDRESS, DATE_OF_BIRTH];
MUSEUM.requiredServices = [CITY_ID];
MUSEUM.generatedClaims = [MUSEUM_MEMBERSHIP];

// export const SERVICES = {
//   CITY_ID, DIPLOMA, COMPANY, INSURANCE, PHARMACY, TRANSPORT, MUSEUM
// };

export const SERVICES = {
  CITY_ID,
  PHARMACY,
  TRANSPORT,
  DIPLOMA
};

// Create route config for services
export const routes = Object.keys(SERVICES).map(serviceId => ({
  path: SERVICES[serviceId].url,
  serviceId
}));

// Ext Service URLs

const getChasquiUrl = () =>
  process.env.REACT_APP_TARGET_ENV === "prod"
    ? "https://api.uport.me/chasqui/"
    : "https://api.uport.space/chasqui/";

export const CHASQUI_URL = getChasquiUrl();
export const SIGNER_URL = getSignerUrl();
export const SENTRY_DSN =
  "https://7a87f2dc2e774d5891ec2ea565b40c05@sentry.io/1449781";
