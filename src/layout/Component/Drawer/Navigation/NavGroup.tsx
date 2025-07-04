// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

// project imports
import NavItem from './NavItem';

// third-party
import { FormattedMessage } from 'react-intl';

// types
import { NavItemType } from 'types/menu';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

interface Props {
  item: NavItemType;
}

export default function NavGroup({ item }: Props) {
  const navCollapse = item.children?.map((menu) => {
    switch (menu.type) {
      case 'item':
        return <NavItem key={menu.id} item={menu} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title && (
          <Typography variant="subtitle1" color="text.primary" sx={{ pl: 3, mb: 1.5 }}>
            <FormattedMessage id={item.title as string} />
          </Typography>
        )
      }
      sx={{ mb: 1 }}
    >
      {navCollapse}
    </List>
  );
}
