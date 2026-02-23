
export interface Specialization {
  icon: string;
  name: string;
  symptoms: string;
}

export interface Shift {
  id: string;
  icon: string;
  time: string;
  label: string;
  days: string[];
}

export interface FormData {
  professionalTypes: string[];
  fullName: string;
  displayName: string;
  dob: string;
  gender: string;
  experience: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  registrationType: string;
  regNumber: string;
  nmrId: string;
  smc: string;
  regDate: string;
  licenseExpiry: string;
  qualification: string;
  university: string;
  completionYear: string;
  additionalQuals: string;
  selectedSpecializations: string[];
  focusedExpertise: string[];
  therapeuticApproaches: string[];
  languages: string[];
  corporateWilling: string;
  corporateCities: string[];
  corporateSpecs: string[];
  maxSessions: string;
  serviceWillingness: Record<string, boolean>;
  certifications: string[];
  pricing: {
    individual: string;
    couples: string;
    followup: string;
  };
  firstSessionPricing: string;
  insurance: string;
  pan: string;
  upiId: string;
  bankAccount: string;
  ifsc: string;
  bio: string;
  tagline: string;
  signature: string;
  // Document uploads
  degreeDoc: File | null;
  regDoc: File | null;
  aadhaarDoc: File | null;
  insuranceDoc: File | null;
}

export interface Step {
  num: number;
  label: string;
}
