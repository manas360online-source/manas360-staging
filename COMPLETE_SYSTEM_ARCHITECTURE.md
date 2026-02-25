# MANAS360 Complete System Architecture
## User Flows, Modules, Subscriptions & Role-Based Access Control

**Last Updated**: February 24, 2026  
**Status**: Production Ready ✅

---

## 📊 Table of Contents

1. [User Roles & Types](#user-roles--types)
2. [Complete User Flows](#complete-user-flows)
3. [Module Structure](#module-structure)
4. [Subscription Plans](#subscription-plans)
5. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
6. [Module-to-Module Flow](#module-to-module-flow)
7. [Payment & Revenue Model](#payment--revenue-model)
8. [Database Schema](#database-schema)
9. [Authentication & Authorization](#authentication--authorization)

---

## 1. User Roles & Types

### Primary User Roles (6 Types)

| Role | User Type | Code | Dashboard Route | Description |
|------|-----------|------|----------------|-------------|
| **Patient** | `patient` | `patient` | `/patient/dashboard` | End users seeking mental health support |
| **Psychologist** | `psychologist` | `therapist` | `/therapist/dashboard` | Licensed psychologists providing therapy |
| **Psychiatrist** | `psychiatrist` | `therapist` | `/therapist/dashboard` | Medical doctors specializing in mental health |
| **NLP Coach** | `nlp_coach` | `coach` | `/coach/dashboard` | Neuro-linguistic programming coaches |
| **Corporate Admin** | `corporate_admin` | `admin` | `/corporate/dashboard` | Corporate wellness program administrators |
| **Education Admin** | `education_admin` | `admin` | `/education/dashboard` | School/university wellness administrators |

### Secondary Roles

| Role | Access Level | Purpose |
|------|-------------|---------|
| **Super Admin** | `admin` | Platform administration, analytics, user management |
| **Clinician** | `therapist` | General term for all therapy providers |
| **Therapist** | `therapist` | Generic therapy provider (psychologist/psychiatrist) |

---

## 2. Complete User Flows

### 🎯 Total User Flows: **12 Major Flows**

### Flow 1: Patient Onboarding & Therapy Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ PATIENT FLOW (8 Steps)                                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Landing Page
  ↓ User clicks "Get Started"
  
Step 2: Role Selection
  ↓ Selects "Continue as User"
  │ File: frontend/main-app/components/RoleSelection.tsx
  
Step 3: Profile Setup
  ↓ Email, Name, Phone Number
  │ File: frontend/main-app/components/ProfileSetup.tsx
  
Step 4: OTP Verification
  ↓ WhatsApp OTP sent via Heyoo API
  │ File: backend/src/controllers/authController.js
  │ API: POST /api/auth/send-otp
  │ API: POST /api/auth/verify-otp
  
Step 5: Initial Assessment
  ↓ Mental health screening questionnaire
  │ File: frontend/main-app/components/Assessment.tsx
  │ File: frontend/main-app/components/FullAssessment.tsx
  
Step 6: Therapist Matching
  ↓ AI-powered matching based on assessment
  │ Module: frontend/apps/patient-matching/
  │ Algorithm: Mood, preferences, availability
  
Step 7: Session Booking & Payment
  ↓ Select therapist → Book session → Payment
  │ Module: integrations/payment-gateway/
  │ Plans: Individual session or subscription
  
Step 8: Join Session
  ↓ Video call with therapist
  │ Module: frontend/apps/single-meeting-jitsi/
  │ OR: frontend/apps/group-sessions/
  
Post-Session: View Results
  │ File: frontend/main-app/components/SessionResultsView.tsx
  │ File: frontend/main-app/components/ResultsPage.tsx
```

---

### Flow 2: Therapist Onboarding & Practice Management

```
┌─────────────────────────────────────────────────────────────────┐
│ THERAPIST FLOW (7 Steps)                                        │
└─────────────────────────────────────────────────────────────────┘

Step 1: Registration
  ↓ Therapist registration form
  │ Module: frontend/apps/therapist-registration-flow/
  
Step 2: Professional Verification
  ↓ Upload credentials (license, certificates)
  │ Module: frontend/apps/therapist-onboarding/
  │ Admin verification required
  
Step 3: Profile Creation
  ↓ Specialization, availability, rates
  │ Components: ProfileSetup, Specialization
  
Step 4: Admin Approval
  ↓ Super admin reviews and approves
  │ Module: Admin/backend/
  │ API: PATCH /api/v1/admin/therapists/:id/verify
  
Step 5: Session Builder
  ↓ Create therapy modules/sessions
  │ File: frontend/main-app/components/SessionBuilder.tsx
  
Step 6: Receive Bookings
  ↓ Patients book sessions
  │ Module: frontend/apps/patient-matching/
  
Step 7: Conduct Sessions & Track
  ↓ Video sessions + session notes
  │ Module: frontend/apps/single-meeting-jitsi/
  │ Analytics: Admin/frontend/ (session tracking)
```

---

### Flow 3: Corporate Wellness Program

```
┌─────────────────────────────────────────────────────────────────┐
│ CORPORATE WELLNESS FLOW (6 Steps)                               │
└─────────────────────────────────────────────────────────────────┘

Step 1: Corporate Admin Registration
  ↓ Company signs up for wellness program
  
Step 2: Employee Enrollment
  ↓ Bulk upload or invite employees
  │ Module: frontend/apps/corporate-wellness/
  
Step 3: Company Dashboard Setup
  ↓ Configure wellness policies, benefits
  │ Components: CompanySettings, TeamDashboard
  
Step 4: Employee Access
  ↓ Employees get subsidized therapy sessions
  │ Payment: Company pays or co-pays
  
Step 5: Anonymous Wellness Sessions
  ↓ Employees book therapy (anonymized to employer)
  │ Privacy: Employer sees aggregated data only
  
Step 6: Corporate Analytics
  ↓ Company views wellness metrics
  │ Module: Admin/frontend/ (corporate dashboard)
  │ Metrics: Utilization, satisfaction, anonymized trends
```

---

### Flow 4: School/University Wellness

```
┌─────────────────────────────────────────────────────────────────┐
│ EDUCATION WELLNESS FLOW (5 Steps)                               │
└─────────────────────────────────────────────────────────────────┘

Step 1: Education Admin Setup
  ↓ School/university wellness program
  
Step 2: Student Enrollment
  ↓ Students register with edu email
  │ Module: frontend/apps/school-wellness/
  
Step 3: Student Services Access
  ↓ Free or subsidized counseling
  
Step 4: Peer Support Groups
  ↓ Group therapy sessions
  │ Module: frontend/apps/group-sessions/
  
Step 5: Academic Wellness Tracking
  ↓ Track student mental health trends
  │ Module: Admin/frontend/
```

---

### Flow 5: AI Chatbot Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│ AI CHATBOT FLOW (4 Steps)                                       │
└─────────────────────────────────────────────────────────────────┘

Step 1: Access Meera AI
  ↓ Free mental health chatbot
  │ Module: frontend/apps/meera-ai-chatbot/
  
Step 2: Conversation
  ↓ AI-powered conversation (Google Gemini)
  │ Service: services/gemini.ts
  │ API: GEMINI_API_KEY
  
Step 3: Mood Tracking
  ↓ Log mood and receive insights
  │ Components: MoodTracker, EmotionWheel
  
Step 4: Escalation to Human Therapist
  ↓ If needed, connect to real therapist
  │ Flow: Redirects to Patient Flow Step 6
```

---

### Flow 6: Certification Platform

```
┌─────────────────────────────────────────────────────────────────┐
│ CERTIFICATION FLOW (6 Steps)                                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Browse Courses
  ↓ Mental health professional courses
  │ Module: frontend/apps/certification-platform/
  
Step 2: Course Enrollment
  ↓ Select course → Payment
  │ Component: pages/CourseListPage
  
Step 3: Learning Progress
  ↓ Watch videos, complete modules
  │ Component: pages/CoursePlayerPage
  
Step 4: Assessments
  ↓ Quizzes and exams
  │ Component: pages/ExamPage
  
Step 5: Certificate Generation
  ↓ Pass exam → Generate certificate
  │ Library: jsPDF (certificate generation)
  
Step 6: Download & Share
  ↓ Download certificate, LinkedIn sharing
  │ Component: pages/CertificatePage
```

---

### Flow 7: Group Therapy Sessions

```
┌─────────────────────────────────────────────────────────────────┐
│ GROUP SESSION FLOW (5 Steps)                                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Group Creation
  ↓ Therapist creates group session
  │ Module: frontend/apps/group-sessions/
  
Step 2: Patient Enrollment
  ↓ Patients join group (max capacity)
  
Step 3: Payment Processing
  ↓ Group rate per participant
  │ Module: integrations/payment-gateway/
  
Step 4: Video Conference
  ↓ Multi-participant video call
  │ Component: components/VideoRoom
  │ Tech: Jitsi or custom video SDK
  
Step 5: Group Analytics
  ↓ Therapist views engagement metrics
```

---

### Flow 8: CBT Session Builder

```
┌─────────────────────────────────────────────────────────────────┐
│ CBT SESSION FLOW (4 Steps)                                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: Session Design
  ↓ Therapist creates CBT modules
  │ Module: frontend/apps/cbt-session-engine/
  
Step 2: Component Selection
  ↓ Choose exercises, worksheets
  │ Component: components/SessionBuilder
  
Step 3: Patient Assignment
  ↓ Assign session to patient
  
Step 4: Patient Completion
  ↓ Patient completes exercises
  │ Component: components/SessionRunner
  │ Results: components/SessionResultsView
```

---

### Flow 9: Payment & Subscription Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ PAYMENT FLOW (7 Steps)                                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Plan Selection
  ↓ User selects subscription or one-time
  │ Module: integrations/payment-gateway/
  
Step 2: Checkout
  ↓ Review order, apply coupons
  │ Component: frontend/components/ShopCheckout
  
Step 3: Payment Gateway
  ↓ PhonePe / Stripe / Razorpay
  │ Backend: backend/src/routes/paymentRoutes.js
  │ API: POST /api/v1/payment/create
  
Step 4: Payment Processing
  ↓ User completes payment
  
Step 5: Webhook Verification
  ↓ Payment gateway sends webhook
  │ API: POST /api/v1/payment/webhook
  
Step 6: Subscription Activation
  ↓ Update user subscription status
  │ Table: subscriptions (database)
  
Step 7: Confirmation
  ↓ Email + SMS confirmation
  │ Component: frontend/components/ShopOrderResult
```

---

### Flow 10: Admin Dashboard & Analytics

```
┌─────────────────────────────────────────────────────────────────┐
│ ADMIN ANALYTICS FLOW (5 Steps)                                  │
└─────────────────────────────────────────────────────────────────┘

Step 1: Admin Login
  ↓ JWT authentication with admin role
  │ Module: Admin/backend/
  │ Middleware: adminAuth.js (role check)
  
Step 2: Dashboard Overview
  ↓ View platform metrics
  │ Module: Admin/frontend/
  │ Component: components/OverviewDashboard
  
Step 3: User Management
  ↓ Approve therapists, manage users
  │ Component: components/UserManagement
  │ API: GET /api/v1/admin/users
  
Step 4: Session Analytics
  ↓ View session completion rates
  │ API: GET /api/analytics/sessions
  
Step 5: Revenue Reports
  ↓ Financial analytics, settlements
  │ API: GET /api/analytics/revenue
```

---

### Flow 11: Digital Pet Hub (Gamification)

```
┌─────────────────────────────────────────────────────────────────┐
│ DIGITAL PET FLOW (4 Steps)                                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: Pet Selection
  ↓ User chooses digital pet
  │ Module: python-services/digital-pet-hub/
  
Step 2: Mood Logging
  ↓ Daily mood check-ins
  │ Component: DigitalPetHub
  
Step 3: Pet Growth
  ↓ Pet evolves based on wellness activities
  
Step 4: Rewards & Achievements
  ↓ Unlock features, badges
```

---

### Flow 12: Crisis Intervention

```
┌─────────────────────────────────────────────────────────────────┐
│ CRISIS FLOW (3 Steps)                                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: Crisis Detection
  ↓ AI detects crisis keywords
  │ Component: frontend/main-app/components/CrisisBanner
  
Step 2: Immediate Resources
  ↓ Hotline numbers, emergency contacts
  │ Component: frontend/main-app/components/CrisisPage
  
Step 3: Priority Therapist Matching
  ↓ Fast-track to available therapist
```

---

## 3. Module Structure

### 📦 Total Modules: **10 Feature Apps + 5 Core Services**

### Feature Applications (Frontend/apps/)

| # | Module Name | Path | Purpose | Status |
|---|-------------|------|---------|--------|
| 1 | **CBT Session Engine** | `frontend/apps/cbt-session-engine/` | Cognitive Behavioral Therapy builder | ✅ Active |
| 2 | **Certification Platform** | `frontend/apps/certification-platform/` | Professional courses & certificates | ✅ Active |
| 3 | **Corporate Wellness** | `frontend/apps/corporate-wellness/` | Enterprise wellness programs | ✅ Active |
| 4 | **Group Sessions** | `frontend/apps/group-sessions/` | Multi-participant therapy | ✅ Active |
| 5 | **Meera AI Chatbot** | `frontend/apps/meera-ai-chatbot/` | AI mental health assistant | ✅ Active |
| 6 | **Patient Matching** | `frontend/apps/patient-matching/` | Therapist-patient matching | ✅ Active |
| 7 | **School Wellness** | `frontend/apps/school-wellness/` | Educational institution programs | ✅ Active |
| 8 | **Single Meeting (Jitsi)** | `frontend/apps/single-meeting-jitsi/` | One-on-one video therapy | ✅ Active |
| 9 | **Therapist Onboarding** | `frontend/apps/therapist-onboarding/` | Therapist registration & verification | ✅ Active |
| 10 | **Therapist Registration** | `frontend/apps/therapist-registration-flow/` | Registration workflow | ✅ Active |

### Core Services

| # | Service Name | Path | Purpose | Port |
|---|-------------|------|---------|------|
| 1 | **Main Frontend** | `frontend/main-app/` | Root React application | 3000 |
| 2 | **Backend API** | `backend/` | Express.js REST API | 5000 |
| 3 | **Admin Dashboard** | `Admin/` | Analytics & management | 3001 |
| 4 | **Payment Gateway** | `integrations/payment-gateway/` | Payment processing | 5002 |
| 5 | **Python Services** | `python-services/` | ML services, Digital Pet | Various |

---

## 4. Subscription Plans

### 💳 Subscription Tiers

#### Plan Types

| Plan ID | Name | Price (INR) | Duration | Type | Features |
|---------|------|-------------|----------|------|----------|
| `premium_monthly` | Premium Monthly | ₹299 | 30 days | Recurring | All premium features |
| `premium_yearly` | Premium Yearly | ₹2,999 | 365 days | Recurring | Annual discount (17% off) |
| `anytimebuddy_lifetime` | Anytime Buddy Lifetime | ₹9,999 | Lifetime | One-time | Lifetime AI chatbot access |
| `track_single` | Single Track | ₹30 | N/A | One-time | Individual therapy track |

#### Free Tier Features

| Feature | Free | Premium |
|---------|------|---------|
| Meera AI Chatbot | Limited (10 msg/day) | ✅ Unlimited |
| Assessment Tools | ✅ Basic | ✅ Advanced |
| Therapist Matching | ❌ No | ✅ Yes |
| Video Sessions | ❌ No | ✅ Unlimited |
| Group Therapy | ❌ No | ✅ Yes |
| Digital Pet Hub | ✅ Basic | ✅ Premium pets |
| CBT Exercises | ❌ No | ✅ Yes |
| Certification Courses | Pay per course | 50% discount |
| Session History | 7 days | ✅ Unlimited |
| Priority Support | ❌ No | ✅ Yes |

#### Subscription Database Schema

```sql
-- Table: subscriptions
CREATE TABLE subscriptions (
  id                      SERIAL PRIMARY KEY,
  user_id                 VARCHAR(64) UNIQUE NOT NULL,
  plan_id                 VARCHAR(32) NOT NULL,
  status                  VARCHAR(16) DEFAULT 'active',
                          -- active | expired | cancelled | payment_failed
  starts_at               TIMESTAMPTZ NOT NULL,
  ends_at                 TIMESTAMPTZ NOT NULL,
  payment_transaction_id  VARCHAR(64),
  auto_renew              BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Role-Based Access Control (RBAC)

### 🔐 Access Control Matrix

#### Route Protection by Role

| Route/Feature | Patient | Therapist | Admin | Corporate | Education |
|--------------|---------|-----------|-------|-----------|-----------|
| **HomePage** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **AI Chatbot** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Assessment** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Find Therapist** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Book Session** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Video Session** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Session Builder** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Patient List** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Create Course** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Take Course** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin Dashboard** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **User Management** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Verify Therapists** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Analytics** | ❌ | ✅ (own) | ✅ (all) | ✅ (company) | ✅ (school) |
| **Revenue Reports** | ❌ | ✅ (own) | ✅ (all) | ❌ | ❌ |
| **Corporate Dashboard** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **School Dashboard** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Digital Pet** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Group Sessions** | ✅ (join) | ✅ (create) | ✅ | ✅ | ✅ |
| **Billing History** | ✅ | ✅ | ✅ | ✅ | ✅ |

#### Authentication Middleware

```javascript
// Backend Authentication Flow
// File: backend/src/controllers/authController.js

// 1. OTP Send
POST /api/auth/send-otp
  ↓ Validates phone number
  ↓ Generates 6-digit OTP
  ↓ Sends via WhatsApp (Heyoo API)
  ↓ Stores hashed OTP in database

// 2. OTP Verification
POST /api/auth/verify-otp
  ↓ Validates OTP
  ↓ Creates/updates user
  ↓ Generates JWT token
  ↓ Returns: { token, user, redirectTo }

// 3. JWT Structure
{
  userId: "uuid",
  userType: "patient|psychologist|admin|...",
  exp: 1709740800
}

// 4. Protected Route Example
router.get('/protected', authMiddleware, (req, res) => {
  // req.user available with decoded JWT
});
```

#### Admin Role Protection

```javascript
// File: Admin/backend/src/middleware/adminAuth.js

// Middleware Chain
verifyToken → requireAdmin → route handler

// 1. Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
};

// 2. Check Admin Role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access forbidden. Admin role required.'
    });
  }
  next();
};

// 3. Apply to Routes
router.use(adminAuth); // All admin routes protected
```

---

## 6. Module-to-Module Flow

### 🔄 Inter-Module Communication

#### Patient Journey Across Modules

```
┌──────────────────────────────────────────────────────────────────┐
│ COMPLETE PATIENT JOURNEY (Module Flow)                          │
└──────────────────────────────────────────────────────────────────┘

Module 1: Main App (Homepage)
  ↓ User Registration
  │ Component: RoleSelection, ProfileSetup
  │ API: POST /api/auth/send-otp
  
Module 2: Assessment
  ↓ Mental Health Screening
  │ Component: Assessment, FullAssessment
  │ Stores: Assessment results in user profile
  
Module 3: Patient Matching
  ↓ Therapist Recommendation
  │ Algorithm: Matches based on:
  │   - Assessment scores
  │   - Preferred language
  │   - Availability
  │   - Specialization
  │ Output: List of recommended therapists
  
Module 4: Payment Gateway
  ↓ Session Booking & Payment
  │ Component: ShopCheckout
  │ API: POST /api/v1/payment/create
  │ Creates: Payment record, subscription
  
Module 5: Video Session (Jitsi)
  ↓ Live Therapy Session
  │ Component: VideoRoom
  │ Tech: Jitsi Meet API
  │ Records: Session metadata
  
Module 6: Session Results
  ↓ Post-Session Summary
  │ Component: SessionResultsView
  │ Stores: Progress notes, outcomes
  
Module 7: AI Chatbot (Follow-up)
  ↓ Between-Session Support
  │ Module: Meera AI Chatbot
  │ API: Google Gemini
  
Module 8: Digital Pet Hub
  ↓ Gamified Wellness Tracking
  │ Daily mood logging
  │ Pet growth based on engagement
  
Module 9: Admin Analytics
  ↓ Session Tracking (Background)
  │ Admin sees: Completion rate, satisfaction
  │ Therapist sees: Their session analytics
```

#### Therapist Journey Across Modules

```
┌──────────────────────────────────────────────────────────────────┐
│ THERAPIST WORKFLOW (Module Flow)                                │
└──────────────────────────────────────────────────────────────────┘

Module 1: Therapist Registration
  ↓ Professional Signup
  │ Module: therapist-registration-flow
  
Module 2: Therapist Onboarding
  ↓ Credential Verification
  │ Module: therapist-onboarding
  │ Upload: License, certificates, ID
  
Module 3: Admin Approval
  ↓ Admin Verification
  │ Module: Admin/backend
  │ API: PATCH /api/v1/admin/therapists/:id/verify
  
Module 4: Session Builder
  ↓ Create Therapy Content
  │ Module: cbt-session-engine
  │ Component: SessionBuilder
  
Module 5: Patient Matching
  ↓ Receive Patient Requests
  │ Module: patient-matching
  │ Algorithm matches patients to therapist
  
Module 6: Payment Gateway
  ↓ Session Payment Processing
  │ Revenue Split: 60% therapist, 40% platform
  │ Table: settlements
  
Module 7: Video Session
  ↓ Conduct Therapy
  │ Module: single-meeting-jitsi OR group-sessions
  
Module 8: Session Notes
  ↓ Document Session
  │ Component: SessionResultsView
  │ Stores: Clinical notes (encrypted)
  
Module 9: Analytics Dashboard
  ↓ View Performance
  │ Module: Admin/frontend
  │ Metrics: Sessions, ratings, earnings
  
Module 10: Certification Platform
  ↓ Professional Development
  │ Module: certification-platform
  │ Continuous learning, CEU credits
```

---

## 7. Payment & Revenue Model

### 💰 Revenue Streams

#### 1. Subscription Revenue

| Source | Model | Price | Platform Share |
|--------|-------|-------|----------------|
| Premium Monthly | Recurring | ₹299/mo | 100% |
| Premium Yearly | Recurring | ₹2,999/yr | 100% |
| Anytime Buddy Lifetime | One-time | ₹9,999 | 100% |

#### 2. Session Revenue (Revenue Sharing)

```
Patient Payment → Revenue Split
┌─────────────────────────────────────┐
│ Session: ₹1,000                     │
├─────────────────────────────────────┤
│ Therapist (60%):     ₹600          │
│ Platform (40%):      ₹400          │
└─────────────────────────────────────┘

Database: settlements table
- Tracks revenue split
- Pending payouts to therapists
- Settlement status (pending/settled)
```

#### 3. Corporate Wellness Revenue

```
Corporate Package → Bulk Pricing
┌─────────────────────────────────────┐
│ 100 Employees @ ₹200/employee/mo   │
│ Total: ₹20,000/month               │
├─────────────────────────────────────┤
│ Platform Revenue: 100%             │
│ (Therapists paid per session)      │
└─────────────────────────────────────┘
```

#### 4. Certification Revenue

```
Course Sales → Revenue Model
┌─────────────────────────────────────┐
│ Course: ₹4,999                      │
├─────────────────────────────────────┤
│ Course Creator (70%):  ₹3,499      │
│ Platform (30%):        ₹1,500      │
└─────────────────────────────────────┘
```

### Payment Flow Architecture

```sql
-- Payment Tables

-- 1. PAYMENTS (every transaction)
CREATE TABLE payments (
  transaction_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  plan_id VARCHAR(32),
  amount_paise INTEGER,
  status VARCHAR(16), -- INITIATED|SUCCESS|FAILED
  therapist_id VARCHAR(64), -- NULL if platform-only
  payment_method VARCHAR(32) -- UPI|CARD|NETBANKING
);

-- 2. SUBSCRIPTIONS (user tier)
CREATE TABLE subscriptions (
  user_id VARCHAR(64) PRIMARY KEY,
  plan_id VARCHAR(32),
  status VARCHAR(16), -- active|expired|cancelled
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  auto_renew BOOLEAN
);

-- 3. SETTLEMENTS (therapist payouts)
CREATE TABLE settlements (
  transaction_id VARCHAR(64),
  therapist_id VARCHAR(64),
  total_amount INTEGER,
  provider_share INTEGER, -- 60%
  platform_share INTEGER, -- 40%
  status VARCHAR(16) -- pending|settled
);

-- 4. AUDIT_LOG (all payment events)
CREATE TABLE audit_log (
  user_id VARCHAR(64),
  action VARCHAR(64),
  details JSONB,
  created_at TIMESTAMPTZ
);
```

---

## 8. Database Schema

### 📊 Core Tables

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone_number VARCHAR(20) UNIQUE,
  role VARCHAR(50), -- patient|therapist|admin
  user_type VARCHAR(50), -- patient|psychologist|psychiatrist|...
  profile_completed BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  subscription_tier VARCHAR(50), -- free|premium
  subscription_status VARCHAR(50), -- active|expired|cancelled
  premium_ends_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### OTP Verifications

```sql
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20),
  otp_hash TEXT, -- Bcrypt hashed
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  is_verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### User Sessions

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_token TEXT, -- JWT token
  refresh_token TEXT,
  device_info JSONB,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. Authentication & Authorization

### 🔐 Auth Architecture

#### JWT Token Structure

```javascript
// Token Payload
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userType": "patient|psychologist|admin|...",
  "email": "user@example.com",
  "role": "patient|therapist|admin",
  "iat": 1709654400, // Issued at
  "exp": 1709740800  // Expires at (24h default)
}

// Token Generation
function generateToken(userId, userType) {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}
```

#### Authorization Levels

| Level | Access | Middleware |
|-------|--------|-----------|
| **Public** | Anyone (no auth) | None |
| **Authenticated** | Any logged-in user | `authMiddleware` |
| **Role-Specific** | Specific role only | `roleCheck(['patient', 'therapist'])` |
| **Admin-Only** | Admin role required | `adminAuth` |

#### Protected Route Examples

```javascript
// 1. Public Route (No Protection)
router.get('/api/public', (req, res) => {
  res.json({ message: 'Public endpoint' });
});

// 2. Authenticated Route
router.get('/api/profile', authMiddleware, (req, res) => {
  // req.user available
  res.json(req.user);
});

// 3. Admin-Only Route
router.get('/api/admin/users', adminAuth, (req, res) => {
  // Only admins can access
});

// 4. Role-Specific Route
router.post('/api/sessions/create',
  authMiddleware,
  roleCheck(['therapist', 'psychologist']),
  (req, res) => {
    // Only therapists can create sessions
  }
);
```

---

## 📈 Summary Statistics

### Platform Overview

| Metric | Count |
|--------|-------|
| **Total User Flows** | 12 |
| **Feature Modules** | 10 |
| **Core Services** | 5 |
| **User Roles** | 6 primary + 2 secondary |
| **Subscription Plans** | 4 |
| **Database Tables** | 15+ |
| **API Endpoints** | 50+ |
| **Payment Gateways** | 4 (PhonePe, Stripe, Razorpay, PayPal) |
| **Video Solutions** | 3 (Jitsi, Zoom, Agora) |
| **AI Services** | 4 (Gemini, OpenAI, Anthropic, HuggingFace) |

---

## 🎯 Key Integration Points

### Critical Module Dependencies

```
Authentication (Core)
  ├─→ Patient Matching
  ├─→ Payment Gateway
  ├─→ Video Sessions
  └─→ Admin Analytics

Payment Gateway
  ├─→ Subscriptions
  ├─→ Session Booking
  ├─→ Course Enrollment
  └─→ Settlements

Patient Matching
  ├─→ Assessment Results
  ├─→ Therapist Availability
  └─→ Payment Status

Admin Analytics
  ├─→ Session Data
  ├─→ User Metrics
  ├─→ Revenue Data
  └─→ Therapist Performance
```

---

**Document Status**: ✅ Complete and Production-Ready  
**Last Reviewed**: February 24, 2026  
**Maintained By**: MANAS360 Development Team
