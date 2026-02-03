// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Firebase Configuration
const firebaseConfig = {
  projectId: "digital-hawker-web",
  appId: "1:135976498248:web:0209fb615ccba6810d547d",
  storageBucket: "digital-hawker-web.firebasestorage.app",
  apiKey: "AIzaSyBtB5-SjjekUXiAl80c5AQ7cx2VMrXusJw",
  authDomain: "digital-hawker-web.firebaseapp.com",
  messagingSenderId: "135976498248",
  measurementId: "G-L04BJHVL0P",
  projectNumber: "135976498248",
  version: "2"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Services
const db = firebase.firestore();
const auth = firebase.auth();

// Helper Functions
const InspectionDB = {
  // Get all inspections
  async getAll() {
    const snapshot = await db.collection('inspections').get();
    return snapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data()
    }));
  },

  // Get inspections by date range
  async getByDateRange(startDate, endDate) {
    const snapshot = await db.collection('inspections')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();
    return snapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data()
    }));
  },

  // Add new inspection
  async add(inspectionData) {
    const docRef = await db.collection('inspections').add({
      ...inspectionData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  },

  // Update inspection
  async update(firestoreId, inspectionData) {
    await db.collection('inspections').doc(firestoreId).update({
      ...inspectionData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  // Delete inspection
  async delete(firestoreId) {
    await db.collection('inspections').doc(firestoreId).delete();
  },

  // Listen to real-time updates
  onSnapshot(callback) {
    return db.collection('inspections').onSnapshot(snapshot => {
      const inspections = snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data()
      }));
      callback(inspections);
    });
  }
};

const LoggingDB = {
  // Add inspection log
  async add(logData) {
    const docRef = await db.collection('inspectionLogs').add({
      ...logData,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  },

  // Get logs for a specific stall
  async getByStall(hawkerCentre, stall) {
    const snapshot = await db.collection('inspectionLogs')
      .where('hawkerCentre', '==', hawkerCentre)
      .where('stall', '==', stall)
      .orderBy('timestamp', 'desc')
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};