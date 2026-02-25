export type BadgeColor = 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';

export interface Module {
  id: number;
  title: string;
  duration_minutes: number;
  topics: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

export interface Certification {
  id: number;
  name: string;
  slug: string;
  badgeColor: BadgeColor;
  tier: 'Entry' | 'Professional' | 'Mastery';
  duration_weeks: number;
  modulesCount: number;
  price_inr: number;
  session_rate_min_inr: number;
  session_rate_max_inr: number;
  monthly_income_min_inr: number;
  monthly_income_max_inr: number;
  description: string;
  prerequisites: string[];
  syllabusPdfUrl: string;
  modules: Module[];
  faqs: Faq[];
  testimonials: Testimonial[];
  requirements: string[];
}

export interface Lead {
  id: number;
  name: string;
  age: number;
  concern: string;
  severity: 'Low' | 'Moderate' | 'High';
  receivedAt: string;
  exclusiveUntil: string;
  isContacted: boolean;
}

export interface AnalyticsData {
  name: string;
  enrollments: number;
  revenue: number;
}

export interface Enrollment {
  id: string;
  certificationId: number;
  certificationName: string;
  slug: string;
  badgeColor: BadgeColor;
  enrollmentDate: string;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  paymentPlan: 'full' | 'installment';
  amountPaid: number;
  totalAmount: number;
  installmentsPaidCount: number; // 0, 1, 2, or 3
  nextInstallmentDue?: string; // ISO date string
  completionPercentage: number;
  modulesCompleted: number;
}

export interface PaymentPlan {
  type: 'full' | 'installment';
  amount: number;
  installments?: number;
}