import { useState, SyntheticEvent, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import OtpInput from 'react-otp-input';
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'api/snackbar';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import BugFilled from '@ant-design/icons/BugFilled';

// types
import { SnackbarProps } from 'types/snackbar';
import { StringColorProps } from 'types/password';

// ============================|| AWS - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
  const { awsResetPassword } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [level, setLevel] = useState<StringColorProps>();

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          otp: '',
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          otp: Yup.string().max(255).required('Verification Code is required'),
          password: Yup.string().max(255).required('Password is required'),
          confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .test('confirmPassword', 'Both Password must be match!', (confirmPassword, yup) => yup.parent.password === confirmPassword)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await awsResetPassword?.(values.otp, values.password)
              .then(() => {
                setSubmitting(false);
                openSnackbar({
                  open: true,
                  message: 'Password Reset Successfully',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  }
                } as SnackbarProps);
                setTimeout(() => {
                  navigate(auth ? `/${auth}/login?auth=aws` : '/login', { replace: true });
                }, 1500);

                // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
                // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
                // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
                // github issue: https://github.com/formium/formik/issues/2430
              })
              .catch((err: any) => {
                setStatus({ success: false });
                setErrors({ submit: err });
                setSubmitting(false);
              });
          } catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue, isSubmitting }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  {touched && errors && errors.submit && (
                    <Alert color="error" variant="border" icon={<BugFilled twoToneColor={theme.palette.error.main} />}>
                      {errors?.submit}
                    </Alert>
                  )}
                  <InputLabel htmlFor="verification-code">Enter Verification Code</InputLabel>
                  <Box
                    sx={(theme) => ({
                      '& input': {
                        border: '1px solid',
                        borderColor: 'divider',
                        ...(touched.otp && errors.otp && { borderColor: 'error.main' }),
                        '&:focus-visible': {
                          outline: 'none !important',
                          borderColor: 'primary.main',
                          boxShadow: theme.customShadows.primary,
                          ...(touched.otp && errors.otp && { borderColor: 'error.main', boxShadow: theme.customShadows.error })
                        }
                      }
                    })}
                  >
                    <OtpInput
                      value={values.otp}
                      onChange={(otp) => setFieldValue('otp', otp)}
                      inputType="tel"
                      shouldAutoFocus
                      renderInput={(props, index) => (
                        <input
                          {...props}
                          onKeyDown={(e) => {
                            if (e.key === 'Tab') {
                              e.preventDefault();
                            } else if (e.key === 'Backspace' && !props.value) {
                              const previousInput = document.getElementById(`otp-input-${index - 1}`);
                              if (previousInput) {
                                previousInput.focus();
                              }
                            } else if (e.key !== 'Backspace') {
                              const nextInput = document.getElementById(`otp-input-${index + 1}`);
                              if (nextInput && props.value) {
                                setTimeout(() => {
                                  nextInput.focus();
                                }, 0);
                              }
                            }
                            props.onKeyDown?.(e);
                          }}
                        />
                      )}
                      numInputs={6}
                      containerStyle={{ justifyContent: 'space-between', margin: -8 }}
                      inputStyle={{ width: '100%', margin: '8px', padding: '10px', outline: 'none', borderRadius: 4 }}
                    />
                  </Box>
                </Stack>
                {touched.otp && errors.otp && (
                  <FormHelperText error id="helper-text-password-reset">
                    {errors.otp}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-reset">Create New Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-reset"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    onBlur={handleBlur}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-reset">
                    {errors.password}
                  </FormHelperText>
                )}
                {strength !== 0 && (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid>
                        <Typography variant="subtitle1" fontSize="0.75rem">
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="confirm-password-reset">Confirm Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="confirm-password-reset"
                    type="password"
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter confirm password"
                  />
                </Stack>
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText error id="helper-text-confirm-password-reset">
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Reset Password
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid size={12}>
                <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <Typography>Did not receive the email? Check spam folder or</Typography>
                  <Typography
                    component={Link}
                    to={auth ? `/${auth}/forgot-password` : '/forgot-password'}
                    variant="body1"
                    sx={{ textDecoration: 'none' }}
                    color="primary"
                  >
                    Resend code
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthResetPassword;
