// Test setup file
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_PORT = '5432';
process.env.DATABASE_NAME = 'manas360_test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.HEYOO_WHATSAPP_TOKEN = 'test-token';
process.env.HEYOO_PHONE_NUMBER_ID = 'test-phone-id';
