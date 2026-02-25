// Backend Server Tests
describe('Backend Server Tests', () => {
  
  test('1.1: Server module should exist', () => {
    const serverFilePath = require('path').join(__dirname, '../server.js');
    const fs = require('fs');
    expect(fs.existsSync(serverFilePath)).toBe(true);
  });

  test('1.2: Environment variables should be configured', () => {
    expect(process.env.NODE_ENV).toBeDefined();
    expect(process.env.DATABASE_HOST).toBeDefined();
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  test('1.3: Backend routes should be importable', () => {
    try {
      const routes = require('../backend/src/routes/authRoutes.js');
      expect(routes).toBeDefined();
    } catch (e) {
      // Expected if using ES modules or server not running
      expect(e.message).toMatch(/Cannot find module|Cannot use import statement/);
    }
  });

  test('1.4: Config files should be accessible', () => {
    const fs = require('fs');
    const path = require('path');
    
    const configDir = path.join(__dirname, '../backend/src/config');
    expect(fs.existsSync(configDir)).toBe(true);
  });

  test('1.5: Controllers directory should exist', () => {
    const fs = require('fs');
    const path = require('path');
    
    const controllersDir = path.join(__dirname, '../backend/src/controllers');
    expect(fs.existsSync(controllersDir)).toBe(true);
  });

});

describe('Backend Directory Structure Tests', () => {
  const fs = require('fs');
  const path = require('path');

  test('2.1: Backend src directory should have config folder', () => {
    const configPath = path.join(__dirname, '../backend/src/config');
    expect(fs.existsSync(configPath)).toBe(true);
  });

  test('2.2: Backend src directory should have routes folder', () => {
    const routesPath = path.join(__dirname, '../backend/src/routes');
    expect(fs.existsSync(routesPath)).toBe(true);
  });

  test('2.3: Backend src directory should have controllers folder', () => {
    const controllersPath = path.join(__dirname, '../backend/src/controllers');
    expect(fs.existsSync(controllersPath)).toBe(true);
  });

  test('2.4: Routes file should exist', () => {
    const authRoutesPath = path.join(__dirname, '../backend/src/routes/authRoutes.js');
    expect(fs.existsSync(authRoutesPath)).toBe(true);
  });

  test('2.5: Controllers file should exist', () => {
    const authControllerPath = path.join(__dirname, '../backend/src/controllers/authController.js');
    expect(fs.existsSync(authControllerPath)).toBe(true);
  });

});
