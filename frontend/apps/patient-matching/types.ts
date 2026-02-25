export interface Patient {
  id: string;
  name: string;
  age: number;
  phoneNumber?: string; // Added
  primaryConcern: string;
  phq9Score: number;
  gad7Score: number;
  status: 'Assessment' | 'Therapy' | 'Referred' | 'Integrated Care';
  carePath: 'Foundation' | 'Integrated' | 'Crisis';
  assignedPsychologistId?: string;
  assignedPsychiatristId?: string;
  sessionsCompleted: number;
  referralStatus: 'None' | 'Pending' | 'Accepted';
  referralNotes?: string;
  referralDate?: string;
  
  // Booking Details
  isBooked: boolean;
  bookingDate?: string;
  bookingTime?: string;
  bookedDoctorName?: string;
  bookedDoctorRole?: 'Psychologist' | 'Psychiatrist';
  amountPaid?: number;

  // Assessment Details
  answers?: Record<string, number>;
}

export interface Referral {
  id: string;
  patientId: string;
  psychologistId: string;
  reason: string[];
  notes: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Completed';
  bonusPaid: boolean;
}

export const MOCK_PATIENTS: Patient[] = [];