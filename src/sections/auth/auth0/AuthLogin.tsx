import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import LockOutlined from '@ant-design/icons/LockOutlined';

// ============================|| AUTH0 - LOGIN ||============================ //

const AuthLogin = () => {
  const { loginAuth } = useAuth();
  const scriptedRef = useScriptRef();

  const [error, setError] = useState(null);
  const loginHandler = async () => {
    try {
      if (loginAuth) await loginAuth();
    } catch (err: any) {
      if (scriptedRef.current) {
        setError(err.message);
      }
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      {error && (
        <Grid size={12}>
          <FormHelperText error>{error}</FormHelperText>
        </Grid>
      )}
      <Grid size={12}>
        <AnimateButton>
          <Button onClick={loginHandler} variant="contained" fullWidth startIcon={<LockOutlined />}>
            Log in with Auth0
          </Button>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default AuthLogin;
