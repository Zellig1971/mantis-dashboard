import { ReactNode } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'components/@extended/Avatar';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import StarFilled from '@ant-design/icons/StarFilled';
import StarOutlined from '@ant-design/icons/StarOutlined';

// ==============================|| PRODUCT DETAILS - REVIEW ||============================== //

interface ReviewProps {
  avatar: string;
  date: Date | string;
  name: string;
  rating: number;
  review: string;
}

export default function ProductReview({ avatar, date, name, rating, review }: ReviewProps) {
  return (
    <Grid size={12}>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Avatar alt={name} src={avatar && getImageUrl(`${avatar}`, ImagePath.USERS)} />
        <Stack sx={{ gap: 2 }}>
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="subtitle1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {date as ReactNode}
            </Typography>
            <Rating
              size="small"
              name="simple-controlled"
              value={rating < 4 ? rating + 1 : rating}
              icon={<StarFilled style={{ fontSize: 'inherit' }} />}
              emptyIcon={<StarOutlined style={{ fontSize: 'inherit' }} />}
              precision={0.1}
              readOnly
            />
          </Stack>
          <Typography variant="body2">{review}</Typography>
        </Stack>
      </Stack>
    </Grid>
  );
}
