import { randomBytes, scryptSync } from "crypto";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run studio:hash -- \"your password\"");
  console.error("The password is not written to disk by this script.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
process.stdout.write(`scrypt$16384$8$1$${salt}$${hash}\n`);
