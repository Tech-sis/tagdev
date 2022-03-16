/* eslint-disable prettier/prettier */
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// firebase
import { getDocs, collection } from 'firebase/firestore';
import { auth, db, logOut } from '../../firebase';
// components
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: homeFill,
    linkTo: '/'
  },
  {
    label: 'Profile',
    icon: personFill,
    linkTo: '#'
  },
  {
    label: 'Settings',
    icon: settings2Fill,
    linkTo: '#'
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState([]);
  const [email, setEmail] = useState([]);
  const [photo, setPhoto] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleLogOut = async (e) => {
    e.preventDefault();
    setOpen(false);
    setName([]);
    try {
      await logOut();
      handleClose();
      navigate('/login');
      console.log('logged out');
      localStorage.removeItem('user');
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const docRef = collection(db, 'users');
      const getData = async () => {
        const data = await getDocs(docRef);
        const userData = data.docs
          .map((doc) => (doc.data().uid === user?.uid ? doc.data() : null))
          .filter((element) => element !== null)[0];
        console.log(userData?.userType);

        if (userData?.userType === 'admin') {
          setName(userData?.displayName);
          setEmail(user?.email);
          setPhoto(user?.photoURL);
        } else if (userData?.userType === 'vendor') {
          setName(userData?.companyName);
          setEmail(user?.email);
          setPhoto(user?.photoURL);
        } else if (userData?.userType === 'customer') {
          setName(userData?.displayName);
          setEmail(user?.email);
          setPhoto(user?.photoURL);
        } else {
          setName(user?.displayName);
        }
      };
      getData();
    });
    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={photo} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap sx={{ textTransform: 'capitalize' }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={handleLogOut}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
