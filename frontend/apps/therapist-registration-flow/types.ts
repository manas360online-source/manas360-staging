
export enum Step {
  REGISTRATION = 'registration',
  UPLOAD = 'upload',
  VERIFICATION = 'verification',
  DASHBOARD = 'dashboard',
  ANALYTICS = 'analytics',
  PATIENTS = 'patients'
}

export interface TherapistData {
  fullName: string;
  email: string;
  mobile: string;
  qualification: string;
  rciRegNo: string;
  yearsExp: string;
  specialization: string;
  languages: string;
}

export interface UploadedFiles {
  degree: File | null;
  rci: File | null;
  photo: File | null;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  progress: number; // 0-100
  history: string;
  requiredTreatment: string;
  lastSession: string;
}
