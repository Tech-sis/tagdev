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
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, setDoc, collection } from 'firebase/firestore';

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

export async function signUp(email, password, firstName, lastName) {
  await createUserWithEmailAndPassword(auth, email, password);
  const userCredential = await updateProfile(auth.currentUser, {
    displayName: `${firstName} ${lastName}`
  });
  const { user } = userCredential;
  setDoc(db, `users/${user.uid}`, {
    firstName,
    lastName,
    email,
    password
  }).catch((error) => {
    console.log(error);
  });
}

export function logIn(email, password) {
  console.log(email, password);
  return signInWithEmailAndPassword(auth, email, password);
}

// const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//   const [user, setUser] = useState({});
//   setUser(currentUser);
//   return () => {
//     unsubscribe();
//   };
// });

export function logOut() {
  return signOut(auth);
}

export function googleSignIn() {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
}

export function forgotPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export default app;
