import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, MOCK_PATIENTS } from '../types';

interface AppContextType {
  patients: Patient[];
  currentUserId: string;
  psychologistWallet: number; // Income from therapy
  referralWallet: number; // Income from referrals
  psychiatristWallet: number; // Income from psych

  updatePatient: (id: string, updates: Partial<Patient>) => void;
  setReferral: (patientId: string, notes: string) => void;
  acceptReferral: (patientId: string) => void;
  setCurrentUser: (id: string) => void;
  createNewPatient: (name: string, score: number, answers?: Record<string, number>) => void;
  confirmBooking: (patientId: string, doctorName: string, role: 'Psychologist' | 'Psychiatrist', date: string, time: string, price: number, phone: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or use Default
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('manas360_patients');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('manas360_currentUserId') || '';
  });

  // Wallets
  const [psychologistWallet, setPsychologistWallet] = useState(0);
  const [referralWallet, setReferralWallet] = useState(0);
  const [psychiatristWallet, setPsychiatristWallet] = useState(0);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('manas360_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('manas360_currentUserId', currentUserId);
  }, [currentUserId]);

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const setReferral = (patientId: string, notes: string) => {
    updatePatient(patientId, {
      status: 'Referred',
      carePath: 'Integrated', // Unlocks Psychiatrist
      referralStatus: 'Pending',
      referralNotes: notes,
      referralDate: new Date().toISOString()
    });
    // Add ₹100 to referral wallet
    setReferralWallet(prev => prev + 100);
  };

  // Psychiatrist accepts the case: Button clicked ONCE, triggers Patient View update
  const acceptReferral = (patientId: string) => {
    updatePatient(patientId, {
      referralStatus: 'Accepted',
      isBooked: false // Resets booking so Patient Dashboard shows Referral Card
    });
  };

  const createNewPatient = (name: string, score: number, answers?: Record<string, number>) => {
    // Basic Triage Logic for new patients
    let carePath: Patient['carePath'] = 'Foundation';
    let status: Patient['status'] = 'Assessment'; // Start at Assessment until booked
    let assignedPsychiatristId = undefined;

    if (score >= 20) {
      carePath = 'Crisis';
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      name,
      age: 30, // Default
      primaryConcern: 'New Assessment',
      phq9Score: score,
      gad7Score: Math.floor(score * 0.8),
      status,
      carePath,
      assignedPsychologistId: undefined, // Not assigned until booking
      assignedPsychiatristId,
      sessionsCompleted: 0,
      referralStatus: 'None',
      isBooked: false,
      answers: answers // Store the raw answers
    };

    setPatients(prev => [...prev, newPatient]);
    setCurrentUserId(newPatient.id);
  };

  const confirmBooking = (patientId: string, doctorName: string, role: 'Psychologist' | 'Psychiatrist', date: string, time: string, price: number, phone: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;

      return {
        ...p,
        isBooked: true,
        bookingDate: date,
        bookingTime: time,
        bookedDoctorName: doctorName,
        bookedDoctorRole: role,
        amountPaid: price,
        phoneNumber: phone,
        status: role === 'Psychiatrist' ? 'Integrated Care' : 'Therapy',
        // Preserve Psychologist if upgrading to Psychiatrist, or assign if booking Psychologist
        assignedPsychologistId: role === 'Psychologist' ? 'psy1' : p.assignedPsychologistId,
        assignedPsychiatristId: role === 'Psychiatrist' ? 'psych1' : p.assignedPsychiatristId
      };
    }));

    // Update wallets based on who was booked
    if (role === 'Psychologist') {
      setPsychologistWallet(prev => prev + price);
    } else {
      setPsychiatristWallet(prev => prev + price);
    }
  };

  const setCurrentUser = (id: string) => {
    setCurrentUserId(id);
  }

  return (
    <AppContext.Provider value={{
      patients,
      currentUserId,
      updatePatient,
      setReferral,
      acceptReferral,
      setCurrentUser,
      createNewPatient,
      confirmBooking,
      psychologistWallet,
      referralWallet,
      psychiatristWallet
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};