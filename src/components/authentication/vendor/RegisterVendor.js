/* eslint-disable prettier/prettier */
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// logic
import { updateProfile, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { signUp, db, auth } from '../../../firebase';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const RegisterSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .min(10, 'Too Short!')
      .max(15, 'Too Long!')
      .required('Phone Number is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    companyName: Yup.string().required('Company Name is required'),
    companyAddress: Yup.string().required('Company Address is required')
  });

  // eslint-disable-next-line no-undef

  const userRef = collection(db, 'users');

  const vendorFormik = useFormik({
    initialValues: {
      phoneNumber: '',
      email: '',
      password: '',
      companyName: '',
      companyAddress: '',
      userType: 'vendor'
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      // console.log(values);
      try {
        await signUp(values.email, values.password);
        const user = auth.currentUser;
        await addDoc(userRef, {
          uid: user.uid,
          email: values.email,
          password: values.password,
          photoURL: user.photoURL,
          phoneNumber: values.phoneNumber,
          companyName: values.companyName,
          companyAddress: values.companyAddress,
          userType: values.userType,
          createdAt: new Date().toISOString()
        });
        await updateProfile(auth.currentUser, {
          displayName: values.companyName
        })
          .then(() => {
            console.log('profile updated');
          })
          .catch((error) => {
            console.log(error);
          });
        await sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log('Email sent');
          })
          .catch((error) => {
            console.log(error);
          });
        navigate('/dashboard/app');
      } catch (err) {
        setError(err.message);
      }
    }
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(vendorFormik.values));
    // console.log(vendorUser);
  }, [vendorFormik.values]);

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = vendorFormik;

  return (
    <FormikProvider value={vendorFormik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="companyName"
            type="text"
            label="Company Name"
            {...getFieldProps('companyName')}
            error={Boolean(touched.companyName && errors.companyName)}
            helperText={touched.companyName && errors.companyName}
          />

          <TextField
            fullWidth
            autoComplete="companyAddress"
            type="text"
            label="Company Address"
            {...getFieldProps('companyAddress')}
            error={Boolean(touched.companyAddress && errors.companyAddress)}
            helperText={touched.companyAddress && errors.companyAddress}
          />
          <TextField
            fullWidth
            autoComplete="phoneNumber"
            type="tel"
            label="Phone Number"
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
