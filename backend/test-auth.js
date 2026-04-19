const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const AuthService = require('./src/services/AuthService');

async function test() {
  console.log("Testing auth login for admin@devcircle.dev");
  try {
    const res = await AuthService.login({ email: "admin@devcircle.dev", password: "Password123!" });
    console.log("SUCCESS:", res);
  } catch (e) {
    console.log("FAILED:", e.message, e.status);
  }
}
test();
