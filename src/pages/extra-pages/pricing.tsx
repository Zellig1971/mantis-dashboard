import { useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import Logo from 'components/logo';
import MainCard from 'components/MainCard';
import StandardLogo from './price/Standard';
import StandardPlusLogo from './price/StandardPlus';

// assets
import CheckOutlined from '@ant-design/icons/CheckOutlined';

// plan list
const plans = [
  {
    active: false,
    icon: <StandardLogo />,
    title: 'Standard',
    description:
      'Create one end product for a client, transfer that end product to your client, charge them for your services. The license is then transferred to the client.',
    price: 69,
    permission: [0, 1]
  },
  {
    active: true,
    icon: <StandardPlusLogo />,
    title: 'Standard Plus',
    description:
      'Create one end product for a client, transfer that end product to your client, charge them for your services. The license is then transferred to the client.',
    price: 129,
    permission: [0, 1, 2, 3]
  },
  {
    active: false,
    icon: <Logo to="#" isIcon sx={{ width: 36, height: 36 }} />,
    title: 'Extended',
    description:
      'Create one end product for a client, transfer that end product to your client, charge them for your services. The license is then transferred to the client.',
    price: 599,
    permission: [0, 1, 2, 3, 5]
  }
];

const planList = [
  'One End Product', // 0
  'No attribution required', // 1
  'TypeScript', // 2
  'Figma Design Resources', // 3
  'Create Multiple Products', // 4
  'Create a SaaS Project', // 5
  'Resale Product', // 6
  'Separate sale of our UI Elements?' // 7
];

export default function Pricing() {
  const [timePeriod, setTimePeriod] = useState(true);

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Alert variant="outlined" severity="info" sx={{ borderColor: 'info.main' }}>
          <AlertTitle sx={{ color: 'info.main', fontWeight: 500 }}>Note</AlertTitle>
          <Typography>
            The pricing provided is for demonstration purposes only. For actual product pricing, please refer to the official.{' '}
            <Link
              sx={{ textDecoration: 'none', color: 'info.main' }}
              variant="subtitle1"
              target="_blank"
              href="https://mui.com/store/items/mantis-react-admin-dashboard-template/"
            >
              pricing page
            </Link>
          </Typography>
        </Alert>
      </Grid>
      <Grid size={12}>
        <MainCard>
          <Stack sx={{ gap: 2, width: { xs: '95%', sm: '70%' } }}>
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
              <Typography variant="subtitle1" color={timePeriod ? 'text.secondary' : 'text.primary'}>
                Billed Yearly
              </Typography>
              <Switch
                checked={timePeriod}
                onChange={() => setTimePeriod(!timePeriod)}
                sx={{ m: 0 }}
                slotProps={{ input: { 'aria-label': 'container' } }}
              />
              <Typography variant="subtitle1" color={timePeriod ? 'text.primary' : 'text.secondary'}>
                Billed Monthly
              </Typography>
            </Stack>
            <Typography color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
          </Stack>
        </MainCard>
      </Grid>
      <Grid container spacing={3} size={12}>
        {plans.map((plan, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <MainCard sx={{ pt: 1.75 }}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Stack direction="row" sx={{ gap: 2, alignItems: 'center', textAlign: 'center' }}>
                    <Box height={36} sx={{ '& svg': { height: 1 } }}>
                      {plan.icon}
                    </Box>
                    <Typography variant="h4">{plan.title}</Typography>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Typography>{plan.description}</Typography>
                </Grid>
                <Grid size={12}>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'flex-end' }}>
                    {timePeriod && <Typography variant="h2">${plan.price}</Typography>}
                    {!timePeriod && <Typography variant="h2">${plan.price * 12 - 99}</Typography>}
                    <Typography variant="h6" color="text.secondary">
                      Lifetime
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Button variant={plan.active ? 'contained' : 'outlined'} fullWidth>
                    Order Now
                  </Button>
                </Grid>
                <Grid size={12}>
                  <List
                    component="ul"
                    sx={(theme) => ({ m: 0, p: 0, '&> li': { px: 0, py: 0.625, '& svg': { fill: theme.palette.success.dark } } })}
                  >
                    {planList.map((list, i) => (
                      <ListItem
                        key={i}
                        sx={(theme) => ({
                          ...(!plan.permission.includes(i) && { opacity: 0.4, '& >div> svg': { fill: theme.palette.secondary.light } })
                        })}
                        divider
                      >
                        <ListItemIcon>
                          <CheckOutlined />
                        </ListItemIcon>
                        <ListItemText primary={list} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
