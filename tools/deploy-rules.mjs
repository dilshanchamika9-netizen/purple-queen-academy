// Publishes firestore.rules with the Admin SDK (Firebase Rules API).
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
const src = readFileSync('firestore.rules', 'utf8');
const rs = await admin.securityRules().releaseFirestoreRulesetFromSource(src);
console.log('Rules published:', rs.name);
