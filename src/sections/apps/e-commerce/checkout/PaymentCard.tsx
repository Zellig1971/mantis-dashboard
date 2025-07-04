// material-ui
import { Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';

// assets
import visa from 'assets/images/e-commerce/visa.png';
import mastercard from 'assets/images/e-commerce/mastercard.png';

// ==============================|| CHECKOUT PAYMENT - CARD METHOD ||============================== //

interface PaymentCardProps {
  type: string;
  paymentType: string;
  cardHandler: (card: string) => void;
}

export default function PaymentCard({ type, paymentType, cardHandler }: PaymentCardProps) {
  const card = type === 'visa' ? visa : mastercard;

  return (
    <MainCard
      content={false}
      sx={(theme: Theme) => ({
        overflow: 'hidden',
        opacity: paymentType === 'cod' ? 0.5 : 1,
        bgcolor: 'grey.A50',
        maxWidth: 380,
        '&:hover': {
          boxShadow: paymentType === 'cod' ? 'none' : theme.customShadows.primary,
          cursor: paymentType === 'cod' ? 'text' : 'pointer'
        }
      })}
    >
      <Stack sx={{ gap: 8, p: 2 }} onClick={() => cardHandler(type)}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack>
            <Typography variant="h5">{type === 'visa' ? 'Jennifer winget' : 'John Smith'}</Typography>
            <Stack direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
              <Typography variant="h2" color="inherit" sx={{ lineHeight: '0.5rem', fontFamily: 'auto' }}>
                .... .... ....
              </Typography>
              <Typography variant="h5" color="inherit">
                {type === 'visa' ? 5674 : 6790}
              </Typography>
            </Stack>
          </Stack>
          <Box
            sx={{
              backgroundImage: `url(${card})`,
              backgroundSize: 'contain',
              backgroundPosition: 'right',
              width: type === 'visa' ? 24 : 42,
              height: type === 'visa' ? 24 : 36.5
            }}
          />
        </Stack>

        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="caption" color="inherit" sx={{ opacity: 0.3 }}>
              CVV
            </Typography>
            <Typography variant="body2" color="inherit">
              {type === 'visa' ? 678 : 760}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="caption" color="inherit" sx={{ opacity: 0.3 }}>
              Expire Date
            </Typography>
            <Typography variant="body2" color="inherit">
              {type === 'visa' ? '3 / 25' : '10 / 22'}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </MainCard>
  );
}
