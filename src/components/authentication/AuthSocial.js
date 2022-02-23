/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
// material
import { Stack, Button, Divider, Typography } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { googleSignIn, db, auth } from '../../firebase';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userRef = collection(db, 'users');

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      const user = auth.currentUser;
      console.log(user);
      await addDoc(userRef, {
        createdAt: new Date(),
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        userType: 'customer'
      });
      navigate('/dashboard/app');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={handleGoogleSignIn}
        >
          <Icon icon={googleFill} color="#DF3E30" height={24} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
