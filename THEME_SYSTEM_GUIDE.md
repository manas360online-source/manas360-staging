# MANAS360 Theme System - Professional Implementation Guide

## Overview

This document explains the professional, production-grade theme system now implemented in MANAS360. The system uses **Tailwind CSS's `darkMode: "class"` strategy** for full control over when dark mode is applied.

## Architecture

### 1. **Configuration**

#### `tailwind.config.js`
```javascript
export default {
  darkMode: 'class',  // ✅ Use class-based dark mode, NOT media queries
  // ... rest of config
};
```

**Why `class` over `media`?**
- `media`: Respects browser/system preferences (undesired - forces dark mode users into light)
- `class`: Gives app full control via `.dark` class on `<html>` element (desired - respects user toggle)

#### `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 2. **HTML Theme Initialization**

#### `index.html` - Dead Simple
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="color-scheme" content="light dark" />
    <style>
      :root {
        color-scheme: light dark;
      }
      html {
        background-color: #FDFCF8; /* light */
        color: #1A1A1A;
      }
      html.dark {
        background-color: #030712; /* dark */
        color: #f9fafb;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

**Key Points:**
- No inline Tailwind config (use `tailwind.config.js` instead)
- No old theme hacks or media query overrides
- Simple CSS for instant background/text colors
- `color-scheme: light dark` allows browser to adapt forms, scrollbars, etc.

### 3. **Theme Utility System**

#### `frontend/main-app/utils/themeUtils.ts`

**Core Functions:**
- `initializeTheme()`: Called once at app startup
- `applyTheme(theme)`: Adds/removes `.dark` class from `<html>`
- `getCurrentTheme()`: Returns current theme state
- `toggleTheme()`: Switches between light/dark
- `useTheme()`: React hook for components

**Storage Strategy:**
```typescript
const STORAGE_KEY = 'manas360-theme-preference';

// Load theme on startup
const stored = localStorage.getItem(STORAGE_KEY);
if (stored === 'light' || stored === 'dark') {
  useStoredTheme();
} else {
  fallback to system preference (matchMedia);
}
```

### 4. **React Integration**

#### `index.tsx` - Clean Initialization
```typescript
import { initializeTheme } from './utils/themeUtils';

// Apply theme BEFORE React renders
initializeTheme();

// Rest of React app
```

#### Using Theme in Components
```typescript
import { useTheme } from '../utils/themeUtils';

export const MyComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      <p>Current theme: {theme}</p>
    </>
  );
};
```

### 5. **Tailwind Dark Mode Classes**

#### Pattern: `light-class dark:dark-class`

**Text Colors:**
```tailwind
text-black dark:text-white
text-gray-600 dark:text-gray-400
text-blue-600 dark:text-blue-400
```

**Backgrounds:**
```tailwind
bg-white dark:bg-gray-900
bg-gray-50 dark:bg-gray-950
bg-blue-100 dark:bg-blue-900
```

**Borders:**
```tailwind
border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600
```

**Shadows:**
```tailwind
shadow-md dark:shadow-none
shadow-lg dark:shadow-xl
```

**Never Do This❌:**
```tailwind
/* Hardcoded colors - breaks theme switching */
bg-[#FDFCF8]
bg-[#030712]

/* Media queries - system-controlled */
dark:bg-gray-900 (when media query is active)
```

## Complete Component Example

```typescript
const Card: React.FC<{ title: string; }> = ({ title }) => {
  return (
    <div className="
      bg-white dark:bg-gray-900
      text-gray-900 dark:text-gray-100
      border border-gray-200 dark:border-gray-700
      shadow-md dark:shadow-none
      p-6 rounded-lg
      hover:shadow-lg dark:hover:shadow-lg
      transition-all duration-200
    ">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
        Description here
      </p>
    </div>
  );
};
```

## Theme Toggle Implementation

```typescript
// Simple button to toggle theme
import { useTheme } from '../utils/themeUtils';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
```

## Persistence & User Preferences

### localStorage Key
```javascript
'manas360-theme-preference' = 'light' | 'dark'
```

### Behavior
1. **On First Load:**
   - Check localStorage
   - If no saved preference → use system preference
   - If user set preference → use that (ignore system)

2. **On Toggle:**
   - Immediately update DOM (`.dark` class)
   - Persist to localStorage
   - Fire `theme-change` event for other components

3. **On Browser/System Change:**
   - Only affects if user hasn't set preference
   - Won't override user's explicit choice

## Verification Checklist

### ✅ Light Mode
- App loads with light background (#FDFCF8)
- Text is dark (#1A1A1A)
- Buttons have light bg with shadows
- All components readable

### ✅ Toggle Without Page Reload
- Click toggle button
- `.dark` class applied to `<html>`
- All colors change instantly
- No layout shift or flicker
- localStorage updated

### ✅ System Theme Change (No Saved Preference)
- Open DevTools → Emulate `prefers-color-scheme: dark`
- App switches to dark mode
- Preference NOT saved (system-driven)

### ✅ System Theme Change (With Saved Preference)
- Toggle to dark mode manually
- Reload page
- System preference changes (emulate light)
- App stays dark (localStorage wins)

### ✅ All Pages Use `dark:` Classes
- Dark mode is consistent
- No hardcoded colors needed
- Container backgrounds and text colors flip properly

## Troubleshooting

### Problem: Theme doesn't toggle
**Solution:** Ensure `initializeTheme()` is called in `index.tsx` before React renders

### Problem: Dark mode bleeds through
**Solution:** Use `dark:bg-X` and `dark:text-X` on ALL interactive elements

### Problem: Hardcoded colors not respecting theme
**Solution:** Replace hardcoded colors with Tailwind classes:
```typescript
// ❌ Wrong
bg-[#1A1A1A]

// ✅ Right
bg-gray-900 dark:bg-gray-900
```

### Problem: Flash of wrong theme on reload
**Solution:** Theme is applied immediately in `index.tsx` before React DOM renders

## Files Modified/Created

### Created
- `/tailwind.config.js` - Defines `darkMode: 'class'`
- `/postcss.config.js` - PostCSS processing
- `/frontend/main-app/utils/themeUtils.ts` - Theme logic and React hook
- `/frontend/main-app/components/ThemeToggle.tsx` - Example toggle button
- `/frontend/main-app/components/ExampleCard.tsx` - Example component with proper dark: classes

### Modified
- `/frontend/main-app/index.html` - Removed old hacks, simplified
- `/frontend/main-app/index.tsx` - Replaced light-only enforcement with proper init
- `/frontend/main-app/src/styles/accessibility.css` - Already using `:root.dark` (class-based)

## Next Steps for Your Components

1. **Audit All Components** for hardcoded colors
2. **Replace with Tailwind classes:**
   ```typescript
   const OldComponent = () => (
     <div style={{ backgroundColor: '#FDFCF8', color: '#1A1A1A' }}>
       Old style
     </div>
   );
   
   const NewComponent = () => (
     <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
       New way
     </div>
   );
   ```

3. **Test Each Page in Dark Mode** - Use DevTools to add `.dark` class to `<html>`

4. **Add Theme Toggle to Header** - Use the `ThemeToggle` component

## CSS Best Practices

### ✅ DO

```css
/* Semantic color pairs */
.button {
  @apply bg-blue-600 dark:bg-blue-700 text-white;
}

/* Consistent transitions */
.card {
  @apply transition-all duration-200;
}

/* Respect layout */
.grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
  /* Don't change gap in dark mode */
}
```

### ❌ DON'T

```css
/* Media queries for dark mode */
@media (prefers-color-scheme: dark) {
  /* Don't do this - use dark: classes instead */
}

/* Hardcoded colors */
background-color: #030712;

/* Layout changes in dark mode */
.dark .card {
  padding: 2rem; /* Don't change spacing */
}
```

## Production Deployment

1. Build with `npm run build`
2. Tailwind will output both light and dark styles
3. JS bundle includes theme utilities
4. On first load, theme is applied before React renders
5. User preference persists across sessions and devices

---

**Questions?** Refer to [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
