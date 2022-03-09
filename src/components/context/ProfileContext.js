import { createContext, useContext, useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';

const userProfileContext = createContext();

export const UserProfileContextProvider = ({ children }) => {
  const [name, setName] = useState([]);
  const [email, setEmail] = useState([]);
  const [photo, setPhoto] = useState('');
  const [role, setRole] = useState([]);
  const [user, setUser] = useState([]);

  const getData = async () => {
    const { currentUser } = auth;
    const docRef = collection(db, 'users');
    const data = await getDocs(docRef);
    console.log(
      data.docs
        .map((doc) => (doc.data().uid === currentUser?.uid ? doc.data() : null))
        .filter((element) => element !== null)
    );
    const userData = data.docs
      .map((doc) => (doc.data().uid === currentUser?.uid ? doc.data() : null))
      .filter((element) => element !== null)[0];
    console.log(
      userData?.displayName,
      userData?.companyName,
      userData?.email,
      userData?.phoneNumber,
      userData?.photoURL,
      userData?.userType
    );

    if (userData?.userType === 'admin') {
      setName(userData?.displayName);
      setEmail(userData?.email);
      setPhoto(userData?.photoURL);
      setRole('admin');
    } else if (userData?.userType === 'vendor') {
      setName(userData?.companyName);
      setEmail(userData?.email);
      setPhoto(userData?.photoURL);
      setRole('vendor');
    } else if (userData?.userType === 'customer') {
      setName(userData?.displayName);
      setEmail(userData?.email);
      setPhoto(userData?.photoURL);
      setRole('customer');
    } else {
      setName(userData?.displayName);
      setEmail(userData?.email);
      setPhoto(userData?.photoURL);
      setRole('customer');
    }

    localStorage.setItem(
      'user',
      JSON.stringify({
        displayName: userData?.displayName,
        email: userData?.email,
        phoneNumber: userData?.phoneNumber,
        photoURL: userData?.photoURL,
        companyName: userData?.companyName
      })
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userProfileContext.Provider value={{ user, name, email, role, photo, getData }}>
      {children}
    </userProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(userProfileContext);
