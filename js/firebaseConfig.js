import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyButK7uMm3_aQ9Fg2QB3Z4FHJIcsokQna4',
    authDomain: 'joystick-junction.firebaseapp.com',
    projectId: 'joystick-junction',
    storageBucket: 'joystick-junction.appspot.com',
    messagingSenderId: '979900202205',
    appId: '1:979900202205:web:3ee13f2d90aade6c4eaf34',
    measurementId: 'G-DQ4JM5ZECY',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
