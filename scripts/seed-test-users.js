#!/usr/bin/env node

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEED TEST USERS - Create test accounts for all user types
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Creates test users for login testing:
 * - Patient: patient / patient@123
 * - Therapist: therapist / therapist@123
 * - Corporate: corporate / corporate@123
 * - Education: education / education@123
 * - Healthcare: healthcare / healthcare@123
 * - Insurance: insurance / insurance@123
 * - Government: government / government@123
 * - Admin: admin / admin@123
 * 
 * Usage:
 *   node scripts/seed-test-users.js
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */

const pg = require('pg');
const bcrypt = require('bcryptjs');

// Database connection
const client = new pg.Client({
  user: process.env.DB_USER || 'chandu',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'manas360_ui_main',
});

// Test users configuration
const TEST_USERS = [
  {
    username: 'patient',
    email: 'patient@manas360.com',
    phone: '+919876543210',
    password: 'patient@123',
    role: 'patient',
    full_name: 'Test Patient',
    first_name: 'Test',
    last_name: 'Patient',
  },
  {
    username: 'therapist',
    email: 'therapist@manas360.com',
    phone: '+919876543211',
    password: 'therapist@123',
    role: 'therapist',
    full_name: 'Test Therapist',
    first_name: 'Test',
    last_name: 'Therapist',
  },
  {
    username: 'corporate',
    email: 'corporate@manas360.com',
    phone: '+919876543212',
    password: 'corporate@123',
    role: 'corporate',
    full_name: 'Corporate Admin',
    first_name: 'Corporate',
    last_name: 'Admin',
  },
  {
    username: 'education',
    email: 'education@manas360.com',
    phone: '+919876543213',
    password: 'education@123',
    role: 'education',
    full_name: 'Education Admin',
    first_name: 'Education',
    last_name: 'Admin',
  },
  {
    username: 'healthcare',
    email: 'healthcare@manas360.com',
    phone: '+919876543214',
    password: 'healthcare@123',
    role: 'healthcare',
    full_name: 'Healthcare Admin',
    first_name: 'Healthcare',
    last_name: 'Admin',
  },
  {
    username: 'insurance',
    email: 'insurance@manas360.com',
    phone: '+919876543215',
    password: 'insurance@123',
    role: 'insurance',
    full_name: 'Insurance Partner',
    first_name: 'Insurance',
    last_name: 'Partner',
  },
  {
    username: 'government',
    email: 'government@manas360.com',
    phone: '+919876543216',
    password: 'government@123',
    role: 'government',
    full_name: 'Government Admin',
    first_name: 'Government',
    last_name: 'Admin',
  },
  {
    username: 'admin',
    email: 'admin@manas360.com',
    phone: '+919876543217',
    password: 'admin@123',
    role: 'admin',
    full_name: 'System Admin',
    first_name: 'System',
    last_name: 'Admin',
  },
];

async function seedTestUsers() {
  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Create or clear test users
    console.log('Creating/updating test users...\n');

    for (const user of TEST_USERS) {
      try {
        // Hash password
        const passwordHash = await bcrypt.hash(user.password, 10);

        // Check if user exists
        const checkQuery = `
          SELECT id FROM users WHERE email = $1 OR phone_number = $2
        `;
        const checkResult = await client.query(checkQuery, [user.email, user.phone]);

        let result;
        if (checkResult.rows.length > 0) {
          // Update existing user
          const updateQuery = `
            UPDATE users
            SET 
              password_hash = $1,
              full_name = $2,
              first_name = $3,
              last_name = $4,
              is_verified = TRUE,
              updated_at = NOW()
            WHERE email = $5 OR phone_number = $6
            RETURNING id, email, role
          `;
          result = await client.query(updateQuery, [
            passwordHash,
            user.full_name,
            user.first_name,
            user.last_name,
            user.email,
            user.phone,
          ]);
          console.log(
            `✓ Updated ${user.role.toUpperCase()}: ${user.email} (${user.username}/${user.password})`
          );
        } else {
          // Insert new user
          const insertQuery = `
            INSERT INTO users (
              email,
              phone_number,
              password_hash,
              role,
              full_name,
              first_name,
              last_name,
              is_verified,
              is_active,
              created_at,
              updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, TRUE, NOW(), NOW())
            RETURNING id, email, role
          `;
          result = await client.query(insertQuery, [
            user.email,
            user.phone,
            passwordHash,
            user.role,
            user.full_name,
            user.first_name,
            user.last_name,
          ]);
          console.log(
            `✓ Created ${user.role.toUpperCase()}: ${user.email} (${user.username}/${user.password})`
          );
        }
      } catch (err) {
        console.error(`✗ Error seeding ${user.role}:`, err.message);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('TEST LOGIN CREDENTIALS');
    console.log('='.repeat(80) + '\n');

    // Display all credentials
    console.log('User Type        | Email                      | Username   | Password');
    console.log('-'.repeat(80));

    for (const user of TEST_USERS) {
      console.log(
        `${user.role.padEnd(16)} | ${user.email.padEnd(26)} | ${user.username.padEnd(10)} | ${user.password}`
      );
    }

    console.log('\n' + '='.repeat(80));
    console.log('TESTING GUIDE');
    console.log('='.repeat(80) + '\n');

    console.log('1. OTP LOGIN (Non-Admin Users):');
    console.log('   - Universal auth endpoint: POST /api/auth/send-otp');
    console.log('   - Send: { "email_or_phone": "patient@manas360.com" }');
    console.log('   - Get OTP from email or backend logs');
    console.log('   - Verify: POST /api/auth/verify-otp with OTP code\n');

    console.log('2. ADMIN LOGIN (Admin Only):');
    console.log('   - Primary factor: POST /api/auth/admin-login');
    console.log('   - Send: { "email": "admin@manas360.com", "password": "admin@123" }');
    console.log('   - Get HOTP code from authenticator app or backend logs');
    console.log('   - MFA verify: POST /api/auth/admin-login/verify-mfa\n');

    console.log('3. PASSWORD LOGIN (Optional, if endpoint exists):');
    console.log('   - Some endpoints may support password-based login');
    console.log('   - Use credentials above with password hashed in bcrypt\n');

    console.log('Note: All users are marked as verified (is_verified=TRUE)');
    console.log('      All users are marked as active (is_active=TRUE)\n');

    await client.end();
    console.log('✓ Done!\n');
  } catch (error) {
    console.error('✗ Error:', error);
    await client.end();
    process.exit(1);
  }
}

// Run seed
seedTestUsers();
