# 📖 STORY 3.6: Session Analytics

## Story Details

| Field | Value |
|-------|-------|
| **Story ID** | 3.6 |
| **Epic** | 3 - Patient Engagement & Therapy Tools |
| **Story Points** | 8 |
| **Priority** | HIGH |
| **Assignee** | Full Stack Developer |

## User Story

**As a** Admin  
**I want** session analytics  
**So that** we can measure therapy effectiveness

---

## Description

Build a comprehensive analytics dashboard that tracks therapy session metrics, patient outcomes, therapist performance, and platform-wide statistics. Enable admins to identify patterns, measure effectiveness, and make data-driven decisions to improve mental health outcomes.

---

## Key Features

- 📊 Session completion rates & trends
- 📈 Patient outcome tracking (PHQ-9, GAD-7 improvements)
- 👨‍⚕️ Therapist performance metrics
- 🔄 Session frequency analysis
- 📉 Drop-off analysis
- 🎯 Treatment effectiveness by therapy type
- 📅 Time-based trend analysis
- 📤 Export reports (PDF/Excel)

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| Frontend | React, TypeScript |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Authentication | JWT |
| Export | ExcelJS, PDFKit |

---

## Database Schema

### Tables Created

1. **therapy_sessions** - Core session data
2. **session_outcomes** - PHQ-9/GAD-7 scores
3. **session_analytics_daily** - Aggregated daily metrics
4. **therapist_metrics** - Therapist performance data

---

## Acceptance Criteria

- [x] AC1: Dashboard shows total sessions, completion rate, avg duration
- [x] AC2: PHQ-9/GAD-7 score improvements visualized
- [x] AC3: Therapist performance comparison charts
- [x] AC4: Session trends (daily/weekly/monthly)
- [x] AC5: Filter by date range, therapist, therapy type
- [x] AC6: Export to Excel/PDF
- [x] AC7: Real-time data refresh
- [x] AC8: Role-based access (Admin only)
- [x] AC9: Mobile-responsive design
- [x] AC10: API response time <500ms

---

## Test Cases

| TC ID | Test Case | Input | Expected | Status |
|-------|-----------|-------|----------|--------|
| TC3.6.1 | Load dashboard | Admin login | All metrics display | ✅ |
| TC3.6.2 | Session completion rate | Date range | % sessions completed | ✅ |
| TC3.6.3 | Outcome improvement | Patient ID | PHQ-9 score change | ✅ |
| TC3.6.4 | Therapist ranking | Metric filter | Sorted list | ✅ |
| TC3.6.5 | Date filter | Custom range | Filtered data | ✅ |
| TC3.6.6 | Export Excel | Click export | .xlsx downloaded | ✅ |
| TC3.6.7 | Export PDF | Click export | .pdf downloaded | ✅ |
| TC3.6.8 | Trend analysis | Monthly view | Line chart renders | ✅ |
| TC3.6.9 | Non-admin access | User login | 403 Forbidden | ✅ |
| TC3.6.10 | Large dataset | 10k sessions | <500ms response | ✅ |
| TC3.6.11 | Empty state | No data | "No data" message | ✅ |
| TC3.6.12 | API error | DB down | Error notification | ✅ |

---

## Implementation Steps

1. ✅ Create database migrations for analytics tables
2. ✅ Build Sequelize models with associations
3. ✅ Create analytics service with aggregation logic
4. ✅ Build REST API endpoints
5. ✅ Add admin authentication middleware
6. ✅ Create React analytics dashboard
7. ✅ Implement Recharts visualizations
8. ✅ Add date range filters
9. ✅ Build export functionality
10. ✅ Write unit and integration tests

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Dashboard summary |
| GET | `/api/analytics/sessions` | Session metrics |
| GET | `/api/analytics/outcomes` | Patient outcomes |
| GET | `/api/analytics/therapists` | Therapist performance |
| GET | `/api/analytics/trends` | Time-based trends |
| GET | `/api/analytics/export/excel` | Export to Excel |
| GET | `/api/analytics/export/pdf` | Export to PDF |

---

## Definition of Done

- [x] All API endpoints working
- [x] Dashboard components render correctly
- [x] Charts display accurate data
- [x] Export functionality tested
- [x] Admin-only access enforced
- [x] Mobile responsive
- [x] Code reviewed
- [x] Documentation complete
- [x] Demo ready

---

## Dependencies

- Story 2.3: Video Session Infrastructure
- Story 3.1: CBT Session Engine  
- Story 3.4: PHQ-9 Assessment
- Story 1.2: Authentication

---

## Files Created

```
manas360-session-analytics/
├── STORY_3.6_TRACEABILITY.md    # This file
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.js                # Express app setup
│   │   ├── config/
│   │   │   └── database.js       # PostgreSQL config
│   │   ├── models/
│   │   │   ├── index.js          # Model associations
│   │   │   ├── TherapySession.js
│   │   │   ├── SessionOutcome.js
│   │   │   └── TherapistMetric.js
│   │   ├── controllers/
│   │   │   └── analyticsController.js
│   │   ├── services/
│   │   │   └── analyticsService.js
│   │   ├── routes/
│   │   │   └── analyticsRoutes.js
│   │   └── middleware/
│   │       └── adminAuth.js
│   └── migrations/
│       └── 001_create_analytics_tables.sql
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.tsx
│       ├── pages/
│       │   └── AnalyticsDashboard.tsx
│       ├── components/
│       │   ├── MetricCard.tsx
│       │   ├── SessionTrendsChart.tsx
│       │   ├── OutcomeChart.tsx
│       │   ├── TherapistPerformance.tsx
│       │   └── ExportButtons.tsx
│       ├── services/
│       │   └── analyticsApi.ts
│       └── hooks/
│           └── useAnalytics.ts
└── docker-compose.yml
```
