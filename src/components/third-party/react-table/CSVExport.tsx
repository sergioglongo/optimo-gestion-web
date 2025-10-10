import { type FC } from 'react';
// material-ui
import { Tooltip } from '@mui/material';

// third-party
import { CSVLink } from 'react-csv';

// assets
import IconButton from 'components/@extended/IconButton';
import type { Headers } from 'react-csv/lib/core';
import { FaFileDownload } from 'react-icons/fa'; // The icon itself
import { type IconBaseProps } from 'react-icons'; // The props type for the icon
// ==============================|| CSV EXPORT ||============================== //

interface CSVExportProps {
  data: never[] | any[];
  filename: string;
  headers?: Headers;
}

const DownloadIcon = FaFileDownload as FC<IconBaseProps>;

const CSVExport = ({ data, filename, headers }: CSVExportProps) => {
  return (
    <CSVLink data={data} filename={filename} headers={headers}>
      <Tooltip title="CSV Export">
        <IconButton color="secondary" variant="light" aria-label="Export to CSV">
          <DownloadIcon size={20} />
        </IconButton>
      </Tooltip>
    </CSVLink>
  );
};

export default CSVExport;
