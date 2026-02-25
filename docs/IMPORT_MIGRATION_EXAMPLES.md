# Import Path Migration Examples

Complete reference guide showing import transformations for each feature app type.

---

## 1. CBT Engine App

### Location: `frontend/apps/cbt-engine/src/`

#### Components

**Before:**
```tsx
// components/SessionRunner.tsx
import React from 'react';
import { SessionTemplate, SessionResult } from '../types';
import { getTemplates } from '../services/storageService';
import MoodTracker from './MoodTracker';
```

**After:**
```tsx
// components/SessionRunner.tsx
import React from 'react';
import { SessionTemplate, SessionResult } from '@cbt/types';
import { getTemplates } from '@cbt/services/storage';
import MoodTracker from '@cbt/components/MoodTracker';
```

#### Services

**Before:**
```tsx
// services/geminiService.ts
import axios from 'axios';

export const generateResponse = async (prompt: string) => {
  // Gemini API call
};
```

**After:**
```tsx
// services/geminiService.ts (no change to content, but now at @cbt/services/ai)
import axios from 'axios';

export const generateResponse = async (prompt: string) => {
  // Gemini API call
};

// Import elsewhere:
import { generateResponse } from '@cbt/services/ai';
```

#### Types

**Before:**
```tsx
// In any component importing types
import { SessionTemplate, Question } from '../types';
```

**After:**
```tsx
// In any component importing types
import { SessionTemplate, Question } from '@cbt/types';
```

#### Full Configuration Example

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared/src'),
      '@cbt': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
```

---

## 2. Therapist-Onboarding App (Advanced)

### Location: `frontend/apps/therapist-onboarding/`

#### Using Shared CBT Engine

**Before:**
```tsx
// pages/Training.tsx
import SessionRunner from '../../../components/cbt/SessionRunner';
import { SessionTemplate } from '../../../components/cbt/types';
import { getTemplates } from '../../../components/cbt/services/storageService';

const Training = () => {
  const templates = getTemplates();
  
  return <SessionRunner template={templates[0]} />;
};
```

**After:**
```tsx
// pages/Training.tsx
import { SessionRunner } from '@cbt/components';
import { SessionTemplate } from '@cbt/types';
import { getTemplates } from '@cbt/services/storage';
import { CBTEngineConfig } from '@cbt/cbt.config';

// Optional: Use training variant UI
import CBTCourseOverview from '@cbt/components/CBTCourseOverview.variant';

const trainingConfig: CBTEngineConfig = {
  mode: 'training',
  showCourseOverview: true,
  enableProgressTracking: true,
};

const Training = () => {
  const templates = getTemplates();
  
  return (
    <>
      {trainingConfig.showCourseOverview && <CBTCourseOverview />}
      <SessionRunner template={templates[0]} />
    </>
  );
};
```

#### Shared Utilities

**Before:**
```tsx
// components/index.ts
import CourseOverview from './CourseOverview';
import TrainingGuide from './TrainingGuide';
import { formatDate, formatDuration } from '../../utils/formatters';

export { CourseOverview, TrainingGuide, formatDate, formatDuration };
```

**After:**
```tsx
// components/index.ts
import CourseOverview from './CourseOverview';
import TrainingGuide from './TrainingGuide';
import { formatDate, formatDuration } from '@shared/utils/formatters';

export { CourseOverview, TrainingGuide, formatDate, formatDuration };
```

---

## 3. Certification Platform App

### Location: `frontend/apps/certification-platform/`

#### Root-Level Components (Before)

```tsx
// pages/CertificationPage.tsx
import Header from '../../../../components/Header';
import ShopCart from '../../../../components/ShopCart';
import { formatPrice } from '../../../../utils/formatters';
import { getLocalStorage } from '../../../../utils/storageService';
```

#### Root-Level Components (After)

```tsx
// pages/CertificationPage.tsx
import { Header } from '@shared/components';
import { ShopCart } from '@shared/components';
import { formatPrice } from '@shared/utils/formatters';
import { getLocalStorage } from '@shared/services/storage';
```

#### Own Components (Internal Imports)

**Before:**
```tsx
// pages/CertificationPage.tsx
import CertificationForm from '../components/CertificationForm';

// In CertificationForm.tsx:
import { CertificationTemplate } from '../../types';
import CertificationCard from './CertificationCard';
```

**After:**
```tsx
// pages/CertificationPage.tsx
import CertificationForm from '@/components/CertificationForm';

// In CertificationForm.tsx:
import { CertificationTemplate } from '@/types';
import CertificationCard from '@/components/CertificationCard';

// Note: @ == ./src in this app's vite.config.ts
```

**vite.config.ts for this app:**
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared/src'),
      '@cbt': path.resolve(__dirname, '../../cbt-engine/src'),
      '@': path.resolve(__dirname, './src'),  // App-specific
    },
  },
});
```

---

## 4. Corporate Wellness App

### Location: `frontend/apps/corporate-wellness/`

#### Structure

```
corporate-wellness/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── CompanyStats.tsx
│   │   └── EmployeeList.tsx
│   ├── pages/
│   │   └── WellnessHome.tsx
│   ├── services/
│   │   └── analyticsService.ts
│   ├── types.ts
│   └── App.tsx
├── package.json
└── vite.config.ts
```

#### Component Example

**Before:**
```tsx
// src/components/CompanyStats.tsx
import React from 'react';
import { formatPercentage } from '../../../utils/formatters';
import { getUserLanguage } from '../../../utils/i18n';
import { getLocalStorage } from '../../../services/storageService';

const CompanyStats = () => {
  const lang = getUserLanguage();
  const stats = getLocalStorage('company-stats');
  
  return (
    <div>
      <span>{formatPercentage(stats.engagementRate)}</span>
    </div>
  );
};
```

**After:**
```tsx
// src/components/CompanyStats.tsx
import React from 'react';
import { formatPercentage } from '@shared/utils/formatters';
import { getUserLanguage } from '@shared/services/i18n';
import { getLocalStorage } from '@shared/services/storage';

const CompanyStats = () => {
  const lang = getUserLanguage();
  const stats = getLocalStorage('company-stats');
  
  return (
    <div>
      <span>{formatPercentage(stats.engagementRate)}</span>
    </div>
  );
};
```

---

## 5. School Wellness App

### Location: `frontend/apps/school-wellness/`

#### Imports with Shared Components

**Before:**
```tsx
// src/pages/SchoolDashboard.tsx
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import { localeData } from '../../../utils/i18n';
import { SchoolMetrics } from '../../types';
```

**After:**
```tsx
// src/pages/SchoolDashboard.tsx
import { Header, Hero } from '@shared/components';
import { locales } from '@shared/locales';
import { SchoolMetrics } from '@/types';
```

---

## 6. Group Sessions App

### Location: `frontend/apps/group-sessions/`

#### API Service Calls

**Before:**
```tsx
// src/services/sessionService.ts
import axios from 'axios';
import { formatDate } from '../../../utils/formatters';

class SessionService {
  async getSchedule(startDate: Date) {
    const formatted = formatDate(startDate);
    return axios.get(`/api/sessions?date=${formatted}`);
  }
}
```

**After:**
```tsx
// src/services/sessionService.ts
import axios from 'axios';
import { formatDate } from '@shared/utils/formatters';

class SessionService {
  async getSchedule(startDate: Date) {
    const formatted = formatDate(startDate);
    return axios.get(`/api/sessions?date=${formatted}`);
  }
}
```

---

## 7. Meera AI Chatbot App

### Location: `frontend/apps/meera-ai-chatbot/`

#### Complex Nested Imports

**Before:**
```tsx
// src/components/CrisisChat.tsx
import React from 'react';
import Header from '../../../../components/Header';
import { alertUser } from '../../../../utils/notifications';
import { generateAIResponse } from '../../../../services/aiService';
import { storeMessage } from '../../../../utils/storageService';
import ChatThread from '../ChatThread';
import MessageInput from './MessageInput';
```

**After:**
```tsx
// src/components/CrisisChat.tsx
import React from 'react';
import { Header } from '@shared/components';
import { alertUser } from '@shared/utils/notifications';
import { generateAIResponse } from '@shared/services/ai';
import { storeMessage } from '@shared/services/storage';
import ChatThread from '@/components/ChatThread';
import MessageInput from '@/components/MessageInput';
```

#### Locales Integration

**Before:**
```tsx
// src/components/CrisisResponse.tsx
import { getLocaleString } from '../../../utils/i18n';

const CrisisResponse = () => {
  const message = getLocaleString('crisis.resources.helpline');
  return <div>{message}</div>;
};
```

**After:**
```tsx
// src/components/CrisisResponse.tsx
import { locales } from '@shared/locales';
import { useLanguage } from '@shared/hooks/useLanguage';

const CrisisResponse = () => {
  const { currentLanguage } = useLanguage();
  const message = locales[currentLanguage]?.crisis?.resources?.helpline || 'Helpline Available';
  return <div>{message}</div>;
};
```

---

## 8. Patient Matching App

### Location: `frontend/apps/patient-matching/`

#### Header & Navigation

**Before:**
```tsx
// src/pages/MatchingDashboard.tsx
import Header from '../../../../components/Header';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import { getUserType } from '../../../../utils/auth';

export default function MatchingDashboard() {
  const userType = getUserType();
  
  return (
    <>
      <Header />
      <LanguageSwitcher />
      <main>
        {userType === 'patient' && <PatientView />}
      </main>
    </>
  );
}
```

**After:**
```tsx
// src/pages/MatchingDashboard.tsx
import { Header, LanguageSwitcher } from '@shared/components';
import { getUserType } from '@shared/services/auth';

export default function MatchingDashboard() {
  const userType = getUserType();
  
  return (
    <>
      <Header />
      <LanguageSwitcher />
      <main>
        {userType === 'patient' && <PatientView />}
      </main>
    </>
  );
}
```

---

## 9. Jitsi Sessions App

### Location: `frontend/apps/jitsi-sessions/`

#### Media Components

**Before:**
```tsx
// src/components/VideoRoom.tsx
import JitsiMeeting from '@jitsi/react-sdk';
import Header from '../../../../components/Header';
import { storeSession } from '../../../../utils/storageService';

export default function VideoRoom({ roomId }: Props) {
  return (
    <>
      <Header />
      <JitsiMeeting
        roomName={roomId}
        onReadyToClose={() => storeSession({ status: 'completed' })}
      />
    </>
  );
}
```

**After:**
```tsx
// src/components/VideoRoom.tsx
import JitsiMeeting from '@jitsi/react-sdk';
import { Header } from '@shared/components';
import { storeSession } from '@shared/services/storage';

export default function VideoRoom({ roomId }: Props) {
  return (
    <>
      <Header />
      <JitsiMeeting
        roomName={roomId}
        onReadyToClose={() => storeSession({ status: 'completed' })}
      />
    </>
  );
}
```

---

## 10. Payment Gateway App

### Location: `frontend/apps/payment-gateway/`

#### Payment Flow

**Before:**
```tsx
// src/services/paymentService.ts
import axios from 'axios';
import { formatPrice } from '../../../utils/formatters';
import { getUserId } from '../../../utils/auth';

class PaymentService {
  async processPayment(amount: number) {
    const formatted = formatPrice(amount);
    const userId = getUserId();
    
    return axios.post('/api/payments', {
      amount,
      userId,
      displayAmount: formatted,
    });
  }
}
```

**After:**
```tsx
// src/services/paymentService.ts
import axios from 'axios';
import { formatPrice } from '@shared/utils/formatters';
import { getUserId } from '@shared/services/auth';

class PaymentService {
  async processPayment(amount: number) {
    const formatted = formatPrice(amount);
    const userId = getUserId();
    
    return axios.post('/api/payments', {
      amount,
      userId,
      displayAmount: formatted,
    });
  }
}
```

---

## 11. Main Root App

### Location: `frontend/main-app/src/`

#### App.tsx

**Before:**
```tsx
// App.tsx - was in root ./App.tsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HomePage from './components/HomePage';
import LanguageSwitcher from './components/LanguageSwitcher';
import Assessment from './components/Assessment';
import { getUserLanguage } from './utils/i18n';

const App = () => {
  const [view, setView] = useState('HOME');
  const language = getUserLanguage();

  return (
    <div className="app-container">
      <Header />
      <LanguageSwitcher />
      {renderView(view)}
    </div>
  );
};
```

**After:**
```tsx
// src/App.tsx - now in frontend/main-app/src/App.tsx
import React, { useState, useEffect } from 'react';
import { Header, Hero, LanguageSwitcher } from '@shared/components';
import HomePage from '@/components/HomePage';
import Assessment from '@/components/Assessment';
import { getUserLanguage } from '@shared/services/i18n';

const App = () => {
  const [view, setView] = useState('HOME');
  const language = getUserLanguage();

  return (
    <div className="app-container">
      <Header />
      <LanguageSwitcher />
      {renderView(view)}
    </div>
  );
};
```

#### Entry Point

**Before:**
```tsx
// index.tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'; // relative path

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

**After:**
```tsx
// src/main.tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import '@shared/styles/global.css'; // from shared library

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

#### Feature App Navigation

**Before:**
```tsx
// components/Navigation.tsx
import { CBTApp } from '../../CBTSessionEngine/CBTApp';
import { CertificationApp } from '../../certification-platform/CertificationApp';

const navigate = (app: string) => {
  // Dynamic import or component mounting
};
```

**After:**
```tsx
// src/components/Navigation.tsx
// Each feature app loads independently via separate bundle
// Main app coordinates routing only

const featureApps = {
  cbt: () => import('@cbt'), // If using module federation or lazy load
  certification: () => import('@manas360/certification-platform'),
  therapist: () => import('@manas360/therapist-onboarding'),
};

const navigate = async (app: string) => {
  const module = await featureApps[app]();
  // Mount feature app
};
```

---

## 12. Shared Library

### Location: `frontend/shared/src/`

#### Components Export

**File: `frontend/shared/src/components/index.ts`**

```typescript
export { default as Header } from './Header';
export { default as Hero } from './Hero';
export { default as LanguageSwitcher } from './LanguageSwitcher';
export { ShopCart } from './ShopCart';
export { default as HomePage } from './HomePage';

// Type exports
export type { HeaderProps } from './Header';
export type { HeroProps } from './Hero';
```

#### Services Export

**File: `frontend/shared/src/services/index.ts`**

```typescript
export * as storageService from './storage';
export * as aiService from './ai';
export * as authService from './auth';
export * as paymentService from './payment';
export * as i18nService from './i18n';

// Individual imports
export { getLocalStorage, setLocalStorage, clearStorage } from './storage';
export { generateAIResponse, streamAIResponse } from './ai';
export { getUserId, getUserType, isAuthenticated } from './auth';
```

#### Utils Export

**File: `frontend/shared/src/utils/index.ts`**

```typescript
export * from './formatters';
export * from './validators';
export * from './constants';

// Individual exports
export { formatPrice, formatDate, formatDuration } from './formatters';
export { validateEmail, validatePhone } from './validators';
```

#### Types Export

**File: `frontend/shared/src/types.ts`**

```typescript
export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  userType: 'patient' | 'therapist' | 'admin';
  language: string;
}

export interface Session {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  data: Record<string, any>;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}
```

---

## 13. Global tsconfig.json (Root)

### File: `tsconfig.json` (in root)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "./",
    "paths": {
      "@shared/*": ["frontend/shared/src/*"],
      "@shared/components": ["frontend/shared/src/components/index"],
      "@shared/services": ["frontend/shared/src/services/index"],
      "@shared/services/*": ["frontend/shared/src/services/*"],
      "@shared/utils": ["frontend/shared/src/utils/index"],
      "@shared/utils/*": ["frontend/shared/src/utils/*"],
      "@shared/locales/*": ["frontend/shared/src/locales/*"],
      "@shared/types": ["frontend/shared/src/types"],
      "@cbt/*": ["frontend/apps/cbt-engine/src/*"],
      "@cbt/components": ["frontend/apps/cbt-engine/src/components/index"],
      "@cbt/services": ["frontend/apps/cbt-engine/src/services/index"],
      "@cbt/types": ["frontend/apps/cbt-engine/src/types"],
      "@/*": ["frontend/main-app/src/*"]
    }
  },
  "include": [
    "frontend/main-app/src",
    "frontend/apps/*/src",
    "frontend/shared/src",
    "backend/src"
  ],
  "exclude": ["node_modules", "dist", "build"]
}
```

---

## 14. Per-App vite.config.ts Template

### Template for Feature Apps

```typescript
// frontend/apps/{app-name}/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared/src'),
      '@cbt': path.resolve(__dirname, '../../cbt-engine/src'),
      '@': path.resolve(__dirname, './src'), // App-specific, optional
    },
  },
  server: {
    port: 5173, // Adjust per app
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../../dist/{app-name}',
    emptyOutDir: true,
  },
});
```

---

## 15. Common Migration Patterns (Find & Replace)

### Pattern 1: Relative Utils
```
Find:     from ['"']\.\.\/\.\.\/\.\.\/utils/
Replace:  from '@shared/utils/
```

### Pattern 2: Relative Components  
```
Find:     from ['"']\.\.\/\.\.\/\.\.\/components/
Replace:  from '@shared/components/
```

### Pattern 3: Relative Services
```
Find:     from ['"']\.\.\/\.\.\/\.\.\/services/
Replace:  from '@shared/services/
```

### Pattern 4: Root-Level Components (in feature apps)
```
Find:     from ['"']\.\.\/\.\.\/\.\.\/components/Header
Replace:  from '@shared/components/Header
```

### Pattern 5: CBT Imports (in training app)
```
Find:     from ['"']\.\.\/\.\.\/components/cbt/
Replace:  from '@cbt/components/
```

---

## 16. Troubleshooting Common Issues

### Issue: "Cannot find module '@shared/utils'"

**Solution:** Verify `vite.config.ts` alias matches tsconfig.json:
```typescript
// vite.config.ts
alias: {
  '@shared': path.resolve(__dirname, '../../shared/src'),
  //                                          ^^^ Check this path is correct
},
```

### Issue: "Circular dependency detected"

**Solution:** Avoid circular imports between apps. Use this pattern:
```tsx
// ✅ GOOD: Shared library isolated
import { formatDate } from '@shared/utils'; // One-way dependency

// ❌ BAD: App importing from another app
import SessionRunner from '@cbt/components'; // In another app (circular if both import shared)
```

### Issue: "Module not found after importing"

**Solution:** Check TypeScript strict mode is enabled:
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": false
  }
}
```

---

**Examples Version:** 1.0  
**Last Updated:** 2024  
**Status:** Complete - Copy & Paste Ready
