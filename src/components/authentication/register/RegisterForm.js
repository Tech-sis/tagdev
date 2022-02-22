/* eslint-disable prettier/prettier */
import * as Yup from 'yup';
import {  useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// logic
import { addDoc, collection } from 'firebase/firestore';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { signUp, auth, db } from '../../../firebase';


// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    phoneNumber: Yup.string().required('Phone number is required')
  });

  // eslint-disable-next-line no-undef
  const userRef = collection(db, 'users');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        await signUp(values.email, values.password);
        const user = auth.currentUser;
        // console.log(user);
        await addDoc(userRef, {
          uid: user.uid,
          displayName: `${values.firstName} ${values.lastName}`,
          email: user.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          userType: 'customer',
          createdAt: new Date().toISOString()
        });
        await updateProfile(auth.currentUser, {
          displayName: `${values.firstName} ${values.lastName}`
        }).then(() => {
          console.log('Profile updated');
        }).catch((error) => {
          console.log(error);
        });
        await sendEmailVerification(auth.currentUser).then(() => {
          console.log('Email sent');
        }).catch((error) => {
          console.log(error);
        });
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      }
    }
  });





  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>
          <TextField
            fullWidth
            autoComplete="phoneNumber"
            type="tel"
            label="Phone number"
            {...getFieldProps('phoneNumber')}
            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
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
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
