import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
// material
import { Stack, Button, Divider, Typography } from '@mui/material';
// import { useUserAuth } from '../../context/UserAuthContext';
import { googleSignIn } from '../../firebase';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate('/dashboard');
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

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Icon icon={facebookFill} color="#1877F2" height={24} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Icon icon={twitterFill} color="#1C9CEA" height={24} />
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
