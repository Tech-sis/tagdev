import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';

// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// import { useUserAuth } from '../../../context/UserAuthContext';

import { onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, signUp } from '../../../firebase';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(signUp);
    setError('');

    try {
      // await signUp(email, password);
      // console.log(signUp);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNo: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema
    // onSubmit: () => {
    //   navigate('/dashboard', { replace: true });
    // }
  });

  const { errors, touched, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            type="number"
            label="Phone Number"
            value={phoneNo}
            onChange={(event) => setPhoneNo(event.target.value)}
            {...getFieldProps('phoneNo')}
            error={Boolean(touched.phoneNo && errors.phoneNo)}
            helperText={touched.phoneNo && errors.phoneNo}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
