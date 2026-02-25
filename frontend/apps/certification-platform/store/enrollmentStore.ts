import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Enrollment } from '../types';

interface EnrollmentState {
  enrollments: Enrollment[];
  addEnrollment: (enrollment: Enrollment) => void;
  getEnrollmentBySlug: (slug: string) => Enrollment | undefined;
  updateProgress: (id: string, progress: number) => void;
  payInstallment: (id: string) => void;
  markComplete: (id: string) => void;
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      enrollments: [],
      
      addEnrollment: (enrollment) => set((state) => {
        // Prevent duplicates by slug/ID
        const exists = state.enrollments.some(e => e.certificationId === enrollment.certificationId);
        if (exists) return state;
        return { enrollments: [...state.enrollments, enrollment] };
      }),

      getEnrollmentBySlug: (slug) => {
        return get().enrollments.find((e) => e.slug === slug);
      },

      updateProgress: (id, progress) => set((state) => ({
        enrollments: state.enrollments.map((e) => 
          e.id === id ? { 
            ...e, 
            completionPercentage: Math.min(100, Math.max(0, progress)),
            modulesCompleted: Math.floor((Math.min(100, Math.max(0, progress)) / 100) * 10) // Approx mapping for demo
          } : e
        )
      })),

      markComplete: (id) => set((state) => ({
        enrollments: state.enrollments.map((e) => 
          e.id === id ? { ...e, completionPercentage: 100, modulesCompleted: 10 } : e
        )
      })),

      payInstallment: (id) => set((state) => ({
        enrollments: state.enrollments.map((e) => {
          if (e.id !== id) return e;
          
          // Calculate installment amount (approx 1/3 of total)
          const standardInstallment = Math.ceil(e.totalAmount / 3);
          const remaining = e.totalAmount - e.amountPaid;
          const payAmount = Math.min(standardInstallment, remaining);
          
          const newAmountPaid = e.amountPaid + payAmount;
          const newInstallmentCount = e.installmentsPaidCount + 1;
          
          // Check if fully paid (either amount met or 3rd installment paid)
          const isFullyPaid = newAmountPaid >= e.totalAmount || newInstallmentCount >= 3;
          
          // Next due date: +30 days if not paid, undefined if paid
          const nextDue = isFullyPaid 
            ? undefined 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

          return {
            ...e,
            amountPaid: isFullyPaid ? e.totalAmount : newAmountPaid, // Snap to total if finished
            installmentsPaidCount: newInstallmentCount,
            paymentStatus: isFullyPaid ? 'Paid' : 'Partial',
            nextInstallmentDue: nextDue
          };
        })
      }))
    }),
    {
      name: 'manas360-enrollments',
    }
  )
);