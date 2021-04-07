
const admin = require('firebase-admin');
admin.initializeApp();
const firestoreDB  = admin.firestore();

module.exports = {firestoreDB,admin}
