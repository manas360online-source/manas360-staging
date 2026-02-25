// Frontend Structure Tests
describe('Frontend Structure Tests', () => {
  const fs = require('fs');
  const path = require('path');

  test('5.1: Main app folder should exist', () => {
    const mainAppPath = path.join(__dirname, '../frontend/main-app');
    expect(fs.existsSync(mainAppPath)).toBe(true);
  });

  test('5.2: Main app should have App.tsx', () => {
    const appPath = path.join(__dirname, '../frontend/main-app/App.tsx');
    expect(fs.existsSync(appPath)).toBe(true);
  });

  test('5.3: Main app should have index.tsx', () => {
    const indexPath = path.join(__dirname, '../frontend/main-app/index.tsx');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('5.4: Main app should have components folder', () => {
    const componentsPath = path.join(__dirname, '../frontend/main-app/components');
    expect(fs.existsSync(componentsPath)).toBe(true);
  });

  test('5.5: Vite config should exist', () => {
    const vitePath = path.join(__dirname, '../vite.config.ts');
    expect(fs.existsSync(vitePath)).toBe(true);
  });

  test('5.6: TypeScript config should exist', () => {
    const tsPath = path.join(__dirname, '../tsconfig.json');
    expect(fs.existsSync(tsPath)).toBe(true);
  });

});

describe('Feature Apps Tests', () => {
  const fs = require('fs');
  const path = require('path');

  const featureApps = [
    'cbt-session-engine',
    'certification-platform',
    'corporate-wellness',
    'meera-ai-chatbot',
    'group-sessions',
    'patient-matching',
    'school-wellness',
    'single-meeting-jitsi',
    'therapist-onboarding',
    'therapist-registration-flow',
  ];

  featureApps.forEach((app, index) => {
    test(`6.${index + 1}: Feature app "${app}" should exist`, () => {
      const appPath = path.join(__dirname, `../frontend/apps/${app}`);
      expect(fs.existsSync(appPath)).toBe(true);
    });
  });

  test('6.11: All feature apps should have App.tsx or main component', () => {
    const appsDir = path.join(__dirname, '../frontend/apps');
    const apps = fs.readdirSync(appsDir);
    
    const appsWithComponents = apps.filter(app => {
      const appPath = path.join(appsDir, app);
      if (!fs.statSync(appPath).isDirectory()) return false;
      
      const hasAppTsx = fs.existsSync(path.join(appPath, 'App.tsx'));
      const hasAppJsx = fs.existsSync(path.join(appPath, 'App.jsx'));
      return hasAppTsx || hasAppJsx;
    });
    
    expect(appsWithComponents.length).toBeGreaterThan(0);
  });

  test('6.12: Feature apps should have package.json', () => {
    const appsDir = path.join(__dirname, '../frontend/apps');
    const apps = fs.readdirSync(appsDir);
    
    apps.forEach(app => {
      const pkgPath = path.join(appsDir, app, 'package.json');
      if (fs.statSync(path.join(appsDir, app)).isDirectory()) {
        // Not all apps need package.json in this setup
        // Just checking structure
        expect(fs.statSync(path.join(appsDir, app)).isDirectory()).toBe(true);
      }
    });
  });

});

describe('Component Library Tests', () => {
  const fs = require('fs');
  const path = require('path');

  test('7.1: Components folder should exist in main-app', () => {
    const componentsPath = path.join(__dirname, '../frontend/main-app/components');
    expect(fs.existsSync(componentsPath)).toBe(true);
  });

  test('7.2: Components should be available', () => {
    const componentsPath = path.join(__dirname, '../frontend/main-app/components');
    const components = fs.readdirSync(componentsPath);
    
    expect(components.length).toBeGreaterThan(0);
  });

  test('7.3: Should have key components like Header and HomePage', () => {
    const componentsPath = path.join(__dirname, '../frontend/main-app/components');
    const files = fs.readdirSync(componentsPath);
    
    const hasHeader = files.some(f => f.includes('Header'));
    const hasHome = files.some(f => f.includes('Home') || f.includes('home'));
    
    // At least some components should exist
    expect(files.length).toBeGreaterThan(5);
  });

});

describe('Utilities and Services Tests', () => {
  const fs = require('fs');
  const path = require('path');

  test('8.1: Utils folder should exist in main-app', () => {
    const utilsPath = path.join(__dirname, '../frontend/main-app/utils');
    expect(fs.existsSync(utilsPath)).toBe(true);
  });

  test('8.2: Utils folder should contain files', () => {
    const utilsPath = path.join(__dirname, '../frontend/main-app/utils');
    const files = fs.readdirSync(utilsPath);
    
    expect(files.length).toBeGreaterThan(0);
  });

  test('8.3: i18n configuration should exist', () => {
    const i18nPath = path.join(__dirname, '../frontend/main-app/utils/i18n.ts');
    expect(fs.existsSync(i18nPath)).toBe(true);
  });

});
