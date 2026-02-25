#!/usr/bin/env node

/**
 * Generate bcrypt hashes for test user passwords
 */

import bcrypt from 'bcryptjs';

const passwords = {
  'patient@123': 'patient',
  'therapist@123': 'therapist',
  'corporate@123': 'corporate',
  'education@123': 'education',
  'healthcare@123': 'healthcare',
  'insurance@123': 'insurance',
  'government@123': 'government',
  'admin@123': 'admin',
};

async function generateHashes() {
  console.log('Generating bcrypt hashes for test users...\n');
  
  for (const [password, role] of Object.entries(passwords)) {
    try {
      const hash = await bcrypt.hash(password, 10);
      console.log(`${role.padEnd(12)} | Password: ${password.padEnd(15)} | Hash: ${hash}`);
    } catch (err) {
      console.error(`Error hashing ${role}:`, err);
    }
  }
}

generateHashes();
