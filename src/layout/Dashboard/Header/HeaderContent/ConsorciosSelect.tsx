import { useEffect, useCallback, useRef } from 'react';
// material-ui
import { Select, MenuItem, SelectChangeEvent, Stack } from '@mui/material'; // Import Stack
import { useTheme } from '@mui/material/styles'; // Import useTheme

// project import
import { openDashboardDrawer, setThemeLoading } from 'store/slices/menu';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectConsorcio } from 'store/slices/consorcio';
import { RootState } from 'store';
import Avatar from 'components/@extended/Avatar'; // Import Avatar
import { HomeOutlined } from '@ant-design/icons'; // Import HomeOutlined
import useConfig from 'hooks/useConfig';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const ConsorciosSelect = () => {
  const dispatch = useAppDispatch();
  const selectRef = useRef<HTMLDivElement>(null);
  const theme = useTheme(); // Get theme object
  const { consorciosList: consorcios, selectedConsorcio } = useAppSelector((state: RootState) => state.consorcio);
  const { onChangePresetColor } = useConfig();

  const handleThemeChange = useCallback(
    (consorcioId: string) => {
      const consorcio = consorcios.find((c) => String(c.id) === consorcioId);
      if (consorcio && consorcio.theme) {
        onChangePresetColor(consorcio.theme);
      }
    },
    [consorcios, onChangePresetColor]
  );

  useEffect(() => {
    // Si hay exactamente un consorcio y no está seleccionado, selecciónalo automáticamente.
    if (consorcios.length === 1 && selectedConsorcio?.id !== consorcios[0].id) {
      dispatch(selectConsorcio(String(consorcios[0].id)));
      handleThemeChange(String(consorcios[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consorcios, dispatch]);

  useEffect(() => {
    // Si hay un consorcio seleccionado al cargar, aplica su tema.
    // Esto soluciona el problema de que el color no se aplique al iniciar sesión.
    if (selectedConsorcio) {
      dispatch(setThemeLoading(true));
      // Usamos setTimeout para permitir que el loader se renderice antes de la operación de bloqueo
      setTimeout(() => {
        handleThemeChange(String(selectedConsorcio.id));
        dispatch(setThemeLoading(false));
      }, 0);
    }
  }, [selectedConsorcio, handleThemeChange, dispatch]);

  const handleConsorcioChange = (event: SelectChangeEvent<string>) => {
    selectRef.current?.blur(); // Quitar el foco del select
    const newConsorcioId = event.target.value as string;
    dispatch(selectConsorcio(newConsorcioId));
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
        ref={selectRef}
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
