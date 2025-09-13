// material-ui
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';

// project import
import { openDashboardDrawer } from 'store/slices/menu';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectConsorcio } from 'store/slices/consorcio';
import { RootState } from 'store';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const ConsorciosSelect = () => {
  const dispatch = useAppDispatch();
  const { consorciosList: consorcios, selectedConsorcio } = useAppSelector((state: RootState) => state.consorcio);

  const handleConsorcioChange = (event: SelectChangeEvent<string>) => {
    const consorcioId = event.target.value as string;
    dispatch(selectConsorcio(consorcioId));
    dispatch(openDashboardDrawer({ isDashboardDrawerOpened: true }));
  };

  return (
    <Select
      id="consorcios-select"
      value={selectedConsorcio ? String(selectedConsorcio.id) : ''}
      onChange={handleConsorcioChange}
      sx={{
        width: 200,
        '& .MuiSelect-select': {
          p: 0.8
        }
      }}
    >
      {consorcios.map((consorcio) => (
        <MenuItem key={consorcio.id} value={String(consorcio.id)}>
          {consorcio.nombre}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ConsorciosSelect;
