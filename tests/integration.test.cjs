// Integration Tests
describe('Project Integration Tests', () => {
  const fs = require('fs');
  const path = require('path');

  test('9.1: Top-level Admin folder should not exist', () => {
    const adminPath = path.join(__dirname, '../Admin');
    expect(fs.existsSync(adminPath)).toBe(false);
  });

  test('9.2: Admin frontend should exist in main app', () => {
    const adminFrontendPath = path.join(__dirname, '../frontend/main-app/admin');
    expect(fs.existsSync(adminFrontendPath)).toBe(true);
  });

  test('9.3: Admin backend should exist', () => {
    const adminBackendPath = path.join(__dirname, '../backend/admin');
    expect(fs.existsSync(adminBackendPath)).toBe(true);
  });

  test('9.4: Payment gateway service should exist in backend', () => {
    const paymentPath = path.join(__dirname, '../backend/payment-gateway');
    expect(fs.existsSync(paymentPath)).toBe(true);
  });

  test('9.5: Python services folder should exist', () => {
    const pythonPath = path.join(__dirname, '../python-services');
    expect(fs.existsSync(pythonPath)).toBe(true);
  });

  test('9.6: Database migrations folder should exist', () => {
    const migrationsPath = path.join(__dirname, '../migrations');
    expect(fs.existsSync(migrationsPath)).toBe(true);
  });

  test('9.7: Documentation folder should exist', () => {
    const docsPath = path.join(__dirname, '../docs');
    expect(fs.existsSync(docsPath)).toBe(true);
  });

  test('9.8: Scripts folder should exist', () => {
    const scriptsPath = path.join(__dirname, '../scripts');
    expect(fs.existsSync(scriptsPath)).toBe(true);
  });

});

describe('Configuration Files Tests', () => {
  const fs = require('fs');
  const path = require('path');

  test('10.1: .env file should exist', () => {
    const envPath = path.join(__dirname, '../.env');
    expect(fs.existsSync(envPath)).toBe(true);
  });

  test('10.2: package.json should be valid', () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkgContent = fs.readFileSync(pkgPath, 'utf8');
    
    expect(() => {
      JSON.parse(pkgContent);
    }).not.toThrow();
  });

  test('10.3: package.json should have required scripts', () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    expect(pkgContent.scripts).toBeDefined();
    expect(pkgContent.scripts.dev).toBeDefined();
    expect(pkgContent.scripts.build).toBeDefined();
  });

  test('10.4: package.json should have dependencies', () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    expect(pkgContent.dependencies).toBeDefined();
    expect(Object.keys(pkgContent.dependencies).length).toBeGreaterThan(0);
  });

  test('10.5: tsconfig.json should be valid', () => {
    const tsconfigPath = path.join(__dirname, '../tsconfig.json');
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
    
    expect(() => {
      JSON.parse(tsconfigContent);
    }).not.toThrow();
  });

  test('10.6: vite.config.ts should exist', () => {
    const vitePath = path.join(__dirname, '../vite.config.ts');
    expect(fs.existsSync(vitePath)).toBe(true);
  });

});

describe('Environment Configuration Tests', () => {

  test('11.1: Database configuration should have host', () => {
    expect(process.env.DATABASE_HOST).toBeDefined();
  });

  test('11.2: Database configuration should have port', () => {
    expect(process.env.DATABASE_PORT).toBeDefined();
  });

  test('11.3: Database configuration should have name', () => {
    expect(process.env.DATABASE_NAME).toBeDefined();
  });

  test('11.4: JWT secret should be defined', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  test('11.5: Node environment should be set to test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  test('11.6: All required API credentials should be configured', () => {
    expect(process.env.HEYOO_WHATSAPP_TOKEN).toBeDefined();
    expect(process.env.HEYOO_PHONE_NUMBER_ID).toBeDefined();
  });

});
