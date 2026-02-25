#!/usr/bin/env node
/**
 * Create admin test user for testing MFA setup
 * Admin: admin@manas360.com / admin@123
 */

import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Client } = pg;

const client = new Client({
  user: process.env.DB_USER || 'chandu',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'manas360_ui_main',
});

async function seedAdmin() {
  try {
    await client.connect();
    console.log('📦 Connected to database');

    const email = 'admin@manas360.com';
    const password = 'admin@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin exists
    const checkResult = await client.query(
      'SELECT id FROM users WHERE email = $1 AND role = $2',
      [email, 'admin']
    );

    if (checkResult.rows.length > 0) {
      console.log('✓ Admin user already exists');
      await client.end();
      return;
    }

    // Create admin user
    const result = await client.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, full_name, is_active, is_verified, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, true, NOW())
       RETURNING id, email, role`,
      [email, hashedPassword, 'admin', 'Admin', 'User', 'Admin User']
    );

    console.log('✅ Admin user created successfully');
    console.log('   Email:', result.rows[0].email);
    console.log('   Password: admin@123');
    console.log('   Role:', result.rows[0].role);
    console.log('\n🔐 MFA is optional - you can login without it, then enable from Settings');

    await client.end();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
