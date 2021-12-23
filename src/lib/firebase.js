import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// import { seedDatabase } from '../seed.js';

export const config = {
  apiKey: 'AIzaSyAv_odzzEijejii9zetXT1MZwfSIdRRGNU',
  authDomain: 'ucabgram-23c3d.firebaseapp.com',
  projectId: 'ucabgram-23c3d',
  storageBucket: 'ucabgram-23c3d.appspot.com',
  messagingSenderId: '466646537860',
  appId: '1:466646537860:web:492b113e5ef2df6fe4d4d1',
};

export const firebase = Firebase.initializeApp(config);
export const { FieldValue } = Firebase.firestore;

// seedDatabase(firebase);
