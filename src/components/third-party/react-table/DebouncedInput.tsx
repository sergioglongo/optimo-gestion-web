import { useEffect, useState, ChangeEvent, FC, KeyboardEvent } from 'react';

// material-ui
import { OutlinedInput, OutlinedInputProps, InputAdornment, IconButton } from '@mui/material';

// assets
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

// types
interface Props extends OutlinedInputProps {
  value: string | number;
  onFilterChange: (value: string | number) => void;
  debounce?: number;
}

// ==============================|| FILTER - INPUT ||============================== //

export const DebouncedInput: FC<Props> = ({
  value: initialValue,
  onFilterChange,
  debounce = 500,
  size,
  startAdornment = <SearchOutlined />,
  ...props
}) => {
  const [value, setValue] = useState<number | string>(initialValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  const handleClear = () => {
    setValue('');
    onFilterChange(''); // Limpia el filtro inmediatamente
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [value]);

  return (
    <OutlinedInput
      {...props}
      value={value}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      sx={{ minWidth: 100 }}
      {...(startAdornment && { startAdornment })}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="clear search"
            onClick={handleClear}
            edge="end"
            size="small"
            sx={{ visibility: value ? 'visible' : 'hidden' }} // Controla la visibilidad
          >
            <CloseOutlined />
          </IconButton>
        </InputAdornment>
      }
      {...(size && { size })}
    />
  );
};

export default DebouncedInput;
