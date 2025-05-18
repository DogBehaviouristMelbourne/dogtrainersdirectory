const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK with service account
const serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Read sample data from file
const sampleData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../src/data/trainers.json'),
  'utf8'
));

// Import data to Firestore
async function importData() {
  const batch = db.batch();
  
  console.log(`Importing ${sampleData.length} trainers...`);
  
  sampleData.forEach(trainer => {
    // Create a reference for this trainer document
    const trainerRef = db.collection('trainers').doc(trainer.id);
    
    // Add additional fields
    const enrichedTrainer = {
      ...trainer,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      approved: true,
      premium: trainer.id === 't1' ? true : false, // Make the first trainer premium
    };
    
    // Add to batch
    batch.set(trainerRef, enrichedTrainer);
  });
  
  // Commit the batch
  try {
    await batch.commit();
    console.log('Sample data imported successfully!');
  } catch (error) {
    console.error('Error importing sample data:', error);
  }
}

// Execute import
importData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });