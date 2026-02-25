import { Certification, Lead, AnalyticsData, Enrollment } from './CertificationTypes';

export const CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    name: "Certified Practitioner",
    slug: "certified-practitioner",
    badgeColor: "blue",
    tier: "Entry",
    duration_weeks: 12,
    modulesCount: 16,
    price_inr: 0,
    session_rate_min_inr: 0,
    session_rate_max_inr: 500,
    monthly_income_min_inr: 0,
    monthly_income_max_inr: 5000,
    description: "Start your mental wellness journey with patient psychoeducation and community impact. Ideal for volunteers.",
    prerequisites: ["None"],
    syllabusPdfUrl: "#",
    requirements: [
        "Complete all 16 modules",
        "Participate in 2 community workshops",
        "Pass final quiz (80% score)",
        "Sign ethical code of conduct"
    ],
    modules: [
        { id: 1, title: "Introduction to Wellness", duration_minutes: 45, topics: ["Basic concepts", "Self-care", "Stigma reduction"] },
        { id: 2, title: "Community Support", duration_minutes: 60, topics: ["Active Listening", "Empathy", "Referral pathways"] },
        { id: 3, title: "Crisis Identification", duration_minutes: 50, topics: ["Red flags", "Emergency contacts"] },
        { id: 4, title: "Ethical Boundaries", duration_minutes: 40, topics: ["Confidentiality", "Role limits"] }
    ],
    faqs: [
        { question: "Is this course really free?", answer: "Yes, this entry-level certification is completely free to encourage community support." },
        { question: "Can I practice clinically?", answer: "No, this is for psychoeducation and support, not clinical therapy." },
        { question: "Do I get a certificate?", answer: "Yes, a digital certificate of completion is provided." },
        { question: "Is it self-paced?", answer: "Yes, you can complete it at your own speed." }
    ],
    testimonials: [
        { id: 1, name: "Sarah J.", role: "Volunteer", text: "A great starting point for my career.", avatar: "https://picsum.photos/50/50?random=1", rating: 5 },
        { id: 2, name: "Amit K.", role: "Student", text: "Very informative and easy to understand.", avatar: "https://picsum.photos/50/50?random=11", rating: 4 },
        { id: 3, name: "Linda G.", role: "Teacher", text: "Helped me support my students better.", avatar: "https://picsum.photos/50/50?random=12", rating: 5 }
    ]
  },
  {
    id: 2,
    name: "Certified ASHA Champion",
    slug: "certified-asha-champion",
    badgeColor: "green",
    tier: "Entry",
    duration_weeks: 5,
    modulesCount: 5,
    price_inr: 0,
    session_rate_min_inr: 0,
    session_rate_max_inr: 200,
    monthly_income_min_inr: 1500,
    monthly_income_max_inr: 3000,
    description: "Community Mental Health Detection specifically designed for ASHA workers to identify early signs in rural areas.",
    prerequisites: ["ASHA Worker Status"],
    syllabusPdfUrl: "#",
    requirements: [
        "Valid ASHA ID card",
        "Complete 5 field modules",
        "Report 3 mock cases",
        "Supervisor validation"
    ],
    modules: [
        { id: 1, title: "Early Detection", duration_minutes: 30, topics: ["Identifying signs", "Depression symptoms", "Anxiety signs"] },
        { id: 2, title: "Maternal Mental Health", duration_minutes: 45, topics: ["Postpartum depression", "Support systems"] },
        { id: 3, title: "Referral Networks", duration_minutes: 30, topics: ["PHC coordination", "Doctor liaison"] }
    ],
    faqs: [
        { question: "Can I do this on mobile?", answer: "Yes, the entire course is mobile-friendly and works on low bandwidth." },
        { question: "Is it available in local languages?", answer: "Yes, currently supports Hindi, English, and regional dialects." },
        { question: "Does it help with incentives?", answer: "Certification may qualify you for state-level incentives." },
        { question: "How long is the access?", answer: "Lifetime access to materials." }
    ],
    testimonials: [
        { id: 1, name: "Priya M.", role: "ASHA Worker", text: "Helped me serve my village better.", avatar: "https://picsum.photos/50/50?random=2", rating: 5 },
        { id: 2, name: "Sunita D.", role: "ASHA Lead", text: "Essential training for our team.", avatar: "https://picsum.photos/50/50?random=13", rating: 5 },
        { id: 3, name: "Ravi T.", role: "NGO Coordinator", text: "Great impact on ground level.", avatar: "https://picsum.photos/50/50?random=14", rating: 4 }
    ]
  },
  {
    id: 3,
    name: "Certified NLP Therapist",
    slug: "certified-nlp-therapist",
    badgeColor: "yellow",
    tier: "Professional",
    duration_weeks: 6,
    modulesCount: 8,
    price_inr: 15000,
    session_rate_min_inr: 1000,
    session_rate_max_inr: 3000,
    monthly_income_min_inr: 16000,
    monthly_income_max_inr: 60000,
    description: "Life Coaching & Behavior Transformation using Neuro-Linguistic Programming techniques to rewrite mental patterns.",
    prerequisites: ["None"],
    syllabusPdfUrl: "#",
    requirements: [
        "Attend 8 live sessions",
        "Submit 2 case studies",
        "Practice 20 coaching hours",
        "Pass practical exam"
    ],
    modules: [
        { id: 1, title: "NLP Fundamentals", duration_minutes: 120, topics: ["Presuppositions", "Sensory Acuity", "Rapport"] },
        { id: 2, title: "Anchoring & State Management", duration_minutes: 90, topics: ["Resource anchors", "Collapsing anchors"] },
        { id: 3, title: "Reframing", duration_minutes: 90, topics: ["Context reframing", "Content reframing", "Six-step reframe"] },
        { id: 4, title: "Timeline Therapy", duration_minutes: 120, topics: ["Releasing negative emotions", "Future pacing"] }
    ],
    faqs: [
        { question: "Is this accredited?", answer: "Yes, recognized by the MANAS360 board and NLP associations." },
        { question: "Can I open my own clinic?", answer: "You can practice as a Life Coach or NLP Practitioner." },
        { question: "Are classes live?", answer: "Mix of recorded theory and live practice sessions." },
        { question: "Do you provide client leads?", answer: "Yes, top graduates get access to our Lead Boost platform." }
    ],
    testimonials: [
        { id: 1, name: "Rahul V.", role: "Life Coach", text: "Transformative tools for my clients.", avatar: "https://picsum.photos/50/50?random=3", rating: 5 },
        { id: 2, name: "Sneha P.", role: "Corporate Trainer", text: "Boosted my training effectiveness.", avatar: "https://picsum.photos/50/50?random=15", rating: 4 },
        { id: 3, name: "Arun J.", role: "Therapist", text: "Added a new dimension to my practice.", avatar: "https://picsum.photos/50/50?random=16", rating: 5 }
    ]
  },
  {
    id: 4,
    name: "Certified Psychologist",
    slug: "certified-psychologist",
    badgeColor: "orange",
    tier: "Professional",
    duration_weeks: 10,
    modulesCount: 10,
    price_inr: 20000,
    session_rate_min_inr: 1500,
    session_rate_max_inr: 4000,
    monthly_income_min_inr: 50000,
    monthly_income_max_inr: 87000,
    description: "Advanced Therapy Mastery for clinical practice. Deep dive into CBT, DBT, and Trauma-informed care.",
    prerequisites: ["M.Phil or Ph.D in Psychology"],
    syllabusPdfUrl: "#",
    requirements: [
        "Verify RCI Registration",
        "Complete 50 supervised hours",
        "Submit research paper",
        "Clinical case presentation"
    ],
    modules: [
        { id: 1, title: "Depth Psychology", duration_minutes: 180, topics: ["Unconscious mind", "Trauma", "Archetypes"] },
        { id: 2, title: "CBT Advanced Techniques", duration_minutes: 120, topics: ["Cognitive restructuring", "Exposure therapy"] },
        { id: 3, title: "DBT Skills", duration_minutes: 120, topics: ["Distress tolerance", "Emotional regulation"] },
        { id: 4, title: "Ethics in Clinical Practice", duration_minutes: 90, topics: ["Dual relationships", "Legal frameworks"] }
    ],
    faqs: [
        { question: "Do I need RCI registration?", answer: "Yes, valid RCI registration is required for this tier." },
        { question: "Is supervision included?", answer: "Yes, 10 hours of supervision are included." },
        { question: "Can I specialize further?", answer: "This covers general clinical practice; specializations are separate." },
        { question: "What is the passing criteria?", answer: "90% attendance and successful case defense." }
    ],
    testimonials: [
        { id: 1, name: "Dr. Anjali S.", role: "Clinical Psychologist", text: "Deepened my clinical practice significantly.", avatar: "https://picsum.photos/50/50?random=4", rating: 5 },
        { id: 2, name: "Dr. Rajeev M.", role: "Psychologist", text: "The trauma module was exceptional.", avatar: "https://picsum.photos/50/50?random=17", rating: 5 },
        { id: 3, name: "Meera K.", role: "Counselor", text: "Highly rigorous and professional.", avatar: "https://picsum.photos/50/50?random=18", rating: 4 }
    ]
  },
  {
    id: 5,
    name: "Certified Psychiatrist",
    slug: "certified-psychiatrist",
    badgeColor: "red",
    tier: "Professional",
    duration_weeks: 8,
    modulesCount: 12,
    price_inr: 25000,
    session_rate_min_inr: 2000,
    session_rate_max_inr: 5000,
    monthly_income_min_inr: 75000,
    monthly_income_max_inr: 150000,
    description: "Medical Management & Integrated Care. focus on psychopharmacology updates and therapy integration.",
    prerequisites: ["MD Psychiatry", "NMC Registration"],
    syllabusPdfUrl: "#",
    requirements: [
        "Verify NMC Registration",
        "Complete pharmacological assessment",
        "Integrated care case study",
        "Final board exam"
    ],
    modules: [
        { id: 1, title: "Psychopharmacology Update", duration_minutes: 240, topics: ["New medications", "Side effects", "Genomics"] },
        { id: 2, title: "Therapy for Psychiatrists", duration_minutes: 180, topics: ["Brief interventions", "Motivational interviewing"] },
        { id: 3, title: "Neurobiology of Addiction", duration_minutes: 120, topics: ["Pathways", "MAT"] }
    ],
    faqs: [
        { question: "Is this for medical doctors only?", answer: "Yes, strictly for MD Psychiatrists." },
        { question: "Does it carry CME credits?", answer: "Yes, accredited for 20 CME points." },
        { question: "How is this different from residency?", answer: "It focuses on recent updates and private practice integration." },
        { question: "Can I attend virtually?", answer: "Yes, all lectures are streamed live." }
    ],
    testimonials: [
        { id: 1, name: "Dr. K. Mehta", role: "Psychiatrist", text: "Excellent integration of therapy and medicine.", avatar: "https://picsum.photos/50/50?random=5", rating: 5 },
        { id: 2, name: "Dr. S. Rao", role: "Psychiatrist", text: "Very up-to-date on new protocols.", avatar: "https://picsum.photos/50/50?random=19", rating: 5 },
        { id: 3, name: "Dr. A. Singh", role: "Resident", text: "Great supplement to my studies.", avatar: "https://picsum.photos/50/50?random=20", rating: 4 }
    ]
  },
  {
    id: 6,
    name: "Certified Executive Therapist",
    slug: "certified-executive-therapist",
    badgeColor: "purple",
    tier: "Mastery",
    duration_weeks: 24,
    modulesCount: 20,
    price_inr: 40000,
    session_rate_min_inr: 5000,
    session_rate_max_inr: 15000,
    monthly_income_min_inr: 70000,
    monthly_income_max_inr: 180000,
    description: "Consciousness Work & Integrative Practice for high-end clientele. The pinnacle of mental health certification.",
    prerequisites: ["Professional Level Certification"],
    syllabusPdfUrl: "#",
    requirements: [
        "Interview with Board",
        "5 years prior experience",
        "Capstone project",
        "Retreat participation"
    ],
    modules: [
        { id: 1, title: "Executive Mindset", duration_minutes: 300, topics: ["Leadership psychology", "Burnout", "High-performance"] },
        { id: 2, title: "Eastern Wisdom Integration", duration_minutes: 360, topics: ["Meditation", "Mindfulness", "Non-duality"] },
        { id: 3, title: "Systemic Coaching", duration_minutes: 240, topics: ["Organizational constellations", "Team dynamics"] },
        { id: 4, title: "The Business of Healing", duration_minutes: 180, topics: ["Branding", "Premium client acquisition"] }
    ],
    faqs: [
        { question: "Is there a mentorship program?", answer: "Yes, includes 6 months of 1-on-1 mentorship." },
        { question: "What is the ROI?", answer: "Graduates typically double their session rates within 6 months." },
        { question: "Is the retreat mandatory?", answer: "Yes, the 3-day immersion retreat is a core part of the curriculum." },
        { question: "Do you offer placement?", answer: "We connect you with corporate wellness panels." }
    ],
    testimonials: [
        { id: 1, name: "Vikram R.", role: "Executive Coach", text: "Opened doors to corporate clients I never had access to.", avatar: "https://picsum.photos/50/50?random=6", rating: 5 },
        { id: 2, name: "Elena S.", role: "Leadership Consultant", text: "A profound personal and professional journey.", avatar: "https://picsum.photos/50/50?random=21", rating: 5 },
        { id: 3, name: "Kabir D.", role: "Therapist", text: "The mastery level training is unmatched in India.", avatar: "https://picsum.photos/50/50?random=22", rating: 5 }
    ]
  }
];

export const MOCK_LEADS: Lead[] = [
  { id: 101, name: "Ananya P.", age: 28, concern: "Work Anxiety", severity: "Moderate", receivedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), exclusiveUntil: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(), isContacted: false },
  { id: 102, name: "Rohan D.", age: 34, concern: "Relationship Issues", severity: "Low", receivedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), exclusiveUntil: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), isContacted: false }, // Expired
  { id: 103, name: "Kavya S.", age: 22, concern: "Academic Stress", severity: "High", receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), exclusiveUntil: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(), isContacted: true },
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { name: 'Practitioner', enrollments: 120, revenue: 0 },
  { name: 'NLP', enrollments: 45, revenue: 675000 },
  { name: 'Psychologist', enrollments: 30, revenue: 600000 },
  { name: 'Psychiatrist', enrollments: 15, revenue: 375000 },
  { name: 'Executive', enrollments: 10, revenue: 400000 },
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
    { 
        id: "ENR-1001", 
        certificationId: 3, 
        certificationName: "Certified NLP Therapist", 
        slug: "certified-nlp-therapist",
        badgeColor: "yellow",
        enrollmentDate: "2023-10-15", 
        paymentStatus: "Partial", 
        paymentPlan: "installment",
        amountPaid: 5000, 
        totalAmount: 15000, 
        installmentsPaidCount: 1,
        completionPercentage: 35,
        modulesCompleted: 3,
        nextInstallmentDue: "2023-11-15"
    },
    { 
        id: "ENR-1002", 
        certificationId: 1, 
        certificationName: "Certified Practitioner", 
        slug: "certified-practitioner",
        badgeColor: "blue",
        enrollmentDate: "2023-09-01", 
        paymentStatus: "Paid", 
        paymentPlan: "full",
        amountPaid: 0, 
        totalAmount: 0, 
        installmentsPaidCount: 1,
        completionPercentage: 100,
        modulesCompleted: 16
    }
];