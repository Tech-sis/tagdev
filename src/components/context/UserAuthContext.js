/* eslint-disable prettier/prettier */
import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  async function signUp(email, password, firstName, lastName) {
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

  function logIn(email, password) {
    console.log(email, password);
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    signUp,
    logIn,
    logOut,
    googleSignIn,
    forgotPassword
  };

  return <userAuthContext.Provider value={{ value }}>{children}</userAuthContext.Provider>;
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
