/**
 * Admin Custom Claim Setup Script
 * Usage: node set_admin_claim.js [USER_EMAIL]
 * Example: node set_admin_claim.js admin@example.com
 */

const fs = require("fs");
const path = require("path");

// Load .env if present
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/(^['"]|['"]$)/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

let admin;
try {
  admin = require("firebase-admin");
} catch {
  admin = require("./functions/node_modules/firebase-admin");
}

const projectId = process.env.FIREBASE_PROJECT_ID;
if (!projectId) {
  console.warn("⚠️ Warning: FIREBASE_PROJECT_ID is not defined in .env. Attempting default credentials...");
}

// Initialize Firebase Admin with credentials from environment
if (!admin.apps.length) {
  const adminConfig = {};
  if (projectId) {
    adminConfig.projectId = projectId;
  }
  admin.initializeApp(adminConfig);
}

const targetEmail = process.argv[2] || process.env.ADMIN_EMAIL;

if (!targetEmail) {
  console.error("❌ ERROR: No target admin email specified.");
  console.log("Usage: node set_admin_claim.js <admin_email>");
  console.log("Or set ADMIN_EMAIL in your surya-tex-server/.env file.");
  process.exit(1);
}

async function grantAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ SUCCESS: Admin custom claim { admin: true } set for user ${email} (UID: ${user.uid})`);
    console.log(`The account ${email} now has full administrator permissions.`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ ERROR setting admin claim for "${email}":`, error.message);
    if (error.code === 'auth/user-not-found') {
      console.log(`\n💡 Tip: Please create the user account "${email}" in Firebase Authentication first, then rerun this script.`);
    }
    process.exit(1);
  }
}

grantAdminClaim(targetEmail);
