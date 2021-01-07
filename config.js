import * as firebase from 'firebase'
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyB3srBRYbV80G1f86oZSxQXmY4yRmTubXQ",
  authDomain: "wireless-library-86698.firebaseapp.com",
  projectId: "wireless-library-86698",
  storageBucket: "wireless-library-86698.appspot.com",
  messagingSenderId: "646422699399",
  appId: "1:646422699399:web:75d2c721cb85a200e40722",
  measurementId: "G-DTHWGJT868"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();