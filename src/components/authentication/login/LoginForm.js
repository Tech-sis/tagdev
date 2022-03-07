/* eslint-disable prettier/prettier */
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// firebase
import { logIn, forgotPassword } from '../../../firebase';

// ----------------------------------------------------------------------

// handle auth errors
const mapAuthCodeToMessage = (authCode) => {
  switch (authCode) {
    case 'auth/invalid-email':
      return 'Invalid email';
    case 'auth/invalid-password':
      return 'Invalid password';
    case 'auth/user-not-found':
      return 'User not found';
    default:
      return 'Invalid password';
  }
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        await logIn(values.email, values.password);
        navigate('/dashboard/app');
      } catch (error) {
        setError(mapAuthCodeToMessage(error.code));
      }
    }
  });

  const handlePasswordReset = () => {
    try {
      forgotPassword(values.email);
      console.log('Email sent');
    } catch (err) {
      setError(err.message);
    }
  };

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  useEffect(() => {
    localStorage.getItem('user');
  }, []);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
          <Typography variant="caption" color="error">
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </Typography>
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <Typography variant="caption" color="error">
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" onClick={handlePasswordReset}>
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
