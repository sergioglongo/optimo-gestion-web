import { useEffect } from 'react';
// material-ui
import { Select, MenuItem, SelectChangeEvent, Stack } from '@mui/material'; // Import Stack
import { useTheme } from '@mui/material/styles'; // Import useTheme

// project import
import { openDashboardDrawer } from 'store/slices/menu';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectConsorcio } from 'store/slices/consorcio';
import { RootState } from 'store';
import Avatar from 'components/@extended/Avatar'; // Import Avatar
import { HomeOutlined } from '@ant-design/icons'; // Import HomeOutlined

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const ConsorciosSelect = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme(); // Get theme object
  const { consorciosList: consorcios, selectedConsorcio } = useAppSelector((state: RootState) => state.consorcio);

  useEffect(() => {
    // Si hay exactamente un consorcio y no está seleccionado, selecciónalo automáticamente.
    if (consorcios.length === 1 && selectedConsorcio?.id !== consorcios[0].id) {
      dispatch(selectConsorcio(String(consorcios[0].id)));
    }
  }, [consorcios, selectedConsorcio, dispatch]);

  const handleConsorcioChange = (event: SelectChangeEvent<string>) => {
    const consorcioId = event.target.value as string;
    dispatch(selectConsorcio(consorcioId));
    dispatch(openDashboardDrawer({ isDashboardDrawerOpened: true }));
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <Avatar
        src={selectedConsorcio?.imagen || ''}
        alt="Consorcio Image"
        sx={{
          width: 32, // Adjust width to match select height
          height: 32, // Adjust height to match select height
          bgcolor: theme.palette.grey[200], // Placeholder background
          color: theme.palette.grey[600] // Placeholder icon color
        }}
      >
        {!selectedConsorcio?.imagen && <HomeOutlined />}
      </Avatar>
      <Select
        id="consorcios-select"
        value={selectedConsorcio ? String(selectedConsorcio.id) : ''}
        onChange={handleConsorcioChange}
        sx={{
          width: 200,
          bgcolor: theme.palette.primary.main, // Primary background color
          fontWeight: 700,
          color: theme.palette.primary.contrastText, // White text color
          '& .MuiSelect-select': {
            p: 0.8
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main // Ensure border color matches background
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.dark // Darker border on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.dark // Darker border when focused
          },
          '& .MuiSvgIcon-root': {
            color: theme.palette.primary.contrastText // White arrow icon
          }
        }}
      >
        {consorcios.map((consorcio) => (
          <MenuItem key={consorcio.id} value={String(consorcio.id)}>
            {consorcio.nombre}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};

export default ConsorciosSelect;
