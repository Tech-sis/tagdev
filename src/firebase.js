/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import sidebarConfig from './layouts/dashboard/SidebarConfig';

const firebaseConfig = {
  apiKey: 'AIzaSyAF1xJWRo8VtDMAZLW9N7J_c7Au6sRmMwM',
  authDomain: 'order-app-9863d.firebaseapp.com',
  projectId: 'order-app-9863d',
  storageBucket: 'order-app-9863d.appspot.com',
  messagingSenderId: '758539270283',
  appId: '1:758539270283:web:03df620fe6d519c97f7c8e',
  measurementId: 'G-0XPWL9NV7L'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// eslint-disable-next-line react-hooks/rules-of-hooks
// const [user, setUser] = useState(null);
// onAuthStateChanged(auth, (currentUser) => {
//   setUser(currentUser);
// });

export async function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function googleSignIn() {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
}

export function logIn(email, password) {
  console.log(email, password);
  return signInWithEmailAndPassword(auth, email, password);
}
export function logOut() {
  return signOut(auth);
}
export function forgotPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

onAuthStateChanged(auth, (currentUser) => {
  console.log(currentUser);
  // sidebarConfig(currentUser);
  // setUser(currentUser);
});

export default app;
