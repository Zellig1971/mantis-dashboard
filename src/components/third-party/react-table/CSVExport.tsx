// material-ui
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// third-party
import { CSVLink } from 'react-csv';
import { Headers } from 'react-csv/lib/core';

// assets
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';

// ==============================|| CSV EXPORT ||============================== //

interface CSVExportProps {
  data: never[] | any[];
  filename: string;
  headers?: Headers;
}

export default function CSVExport({ data, filename, headers }: CSVExportProps) {
  return (
    <CSVLink data={data} filename={filename} headers={headers}>
      <Tooltip title="CSV Export">
        <Box sx={{ color: 'text.secondary' }}>
          <DownloadOutlined style={{ fontSize: '24px', marginTop: 4, marginRight: 4, marginLeft: 4 }} />
        </Box>
      </Tooltip>
    </CSVLink>
  );
}
