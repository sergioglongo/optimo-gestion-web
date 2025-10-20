import { ChangeEvent } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { CardMedia, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

// third-party
import { presetDarkPalettes, presetPalettes, PalettesProps } from '@ant-design/colors';

// assets
import colorLayout from 'assets/images/customization/theme-color.svg';

// types
import { PresetColor, ThemeMode } from 'types/config';
import { firstCapitalized } from 'utils/textFormat';
import { useIntl } from 'react-intl';

interface ColorProps {
  id: PresetColor;
  primary: string;
  lighter: string;
  label: string;
  shadow: string;
}

interface ColorSchemeProps {
  value?: PresetColor;
  onChange?: (color: PresetColor) => void;
}

// ==============================|| CUSTOMIZATION - COLOR SCHEME ||============================== //

const ColorScheme = ({ value, onChange }: ColorSchemeProps) => {
  const theme = useTheme();
  const intl = useIntl();

  const { mode, presetColor: configPresetColor, onChangePresetColor } = useConfig();
  const presetColor = value || configPresetColor;

  const colors: PalettesProps = mode === ThemeMode.DARK ? presetDarkPalettes : presetPalettes;
  const { blue } = colors;
  const colorOptions: ColorProps[] = [
    {
      id: 'default',
      primary: blue[5],
      lighter: blue[0],
      label: firstCapitalized(intl.formatMessage({ id: 'default' })),
      shadow: `0 0 0 2px ${alpha(blue[5], 0.2)}`
    },
    {
      id: 'theme1',
      primary: mode === ThemeMode.DARK ? '#305bdd' : '#3366FF',
      lighter: mode === ThemeMode.DARK ? '#1c2134' : '#D6E4FF',
      label: firstCapitalized(intl.formatMessage({ id: 'theme1' })),
      shadow: `0 0 0 2px ${alpha(mode === ThemeMode.DARK ? '#305bdd' : '#3366FF', 0.2)}`
    },
    {
      id: 'theme2',
      primary: mode === ThemeMode.DARK ? '#655ac8' : '#7265E6',
      lighter: mode === ThemeMode.DARK ? '#222130' : '#EEEDFC',
      label: firstCapitalized(intl.formatMessage({ id: 'theme2' })),
      shadow: `0 0 0 2px ${alpha(mode === ThemeMode.DARK ? '#655ac8' : '#7265E6', 0.2)}`
    },
    {
      id: 'theme3',
      primary: mode === ThemeMode.DARK ? '#0a7d3e' : '#068e44',
      lighter: mode === ThemeMode.DARK ? '#1a231f' : '#E6F3EC',
      label: firstCapitalized(intl.formatMessage({ id: 'theme3' })),
      shadow: `0 0 0 2px ${alpha(mode === ThemeMode.DARK ? '#0a7d3e' : '#068e44', 0.2)}`
    },
    {
      id: 'theme4',
      primary: mode === ThemeMode.DARK ? '#5d7dcb' : '#3c64d0',
      lighter: mode === ThemeMode.DARK ? '#1d212d' : '#f0f6ff',
      label: firstCapitalized(intl.formatMessage({ id: 'theme4' })),
      shadow: `0 0 0 2px ${alpha(mode === ThemeMode.DARK ? '#5d7dcb' : '#3c64d0', 0.2)}`
    },
    {
      id: 'theme5',
      primary: mode === ThemeMode.DARK ? '#d26415' : '#f27013',
      lighter: mode === ThemeMode.DARK ? '#32221a' : '#fff4e6',
      label: firstCapitalized(intl.formatMessage({ id: 'theme5' })),
      shadow: `0 0 0 2px ${alpha(mode === ThemeMode.DARK ? '#d26415' : '#f27013', 0.2)}`
    },
    {
      id: 'theme6',
      primary: mode === ThemeMode.DARK ? '#288d99' : '#2aa1af',
      lighter: mode === ThemeMode.DARK ? '#1c2628' : '#e1f0ef',
      label: firstCapitalized(intl.formatMessage({ id: 'theme6' })),
      shadow: `0 0 0 2px ${alpha(mode === ThemeMode.DARK ? '#288d99' : '#2aa1af', 0.2)}`
    },
    {
      id: 'theme7',
      primary: mode === ThemeMode.DARK ? '#05934c' : '#00a854',
      lighter: mode === ThemeMode.DARK ? '#1a2721' : '#d1e8d99c',
      label: firstCapitalized(intl.formatMessage({ id: 'theme7' })),
      shadow: `0 0 0 2px ${alpha(mode === ThemeMode.DARK ? '#05934c' : '#00a854', 0.2)}`
    },
    {
      id: 'theme8',
      primary: mode === ThemeMode.DARK ? '#058478' : '#009688',
      lighter: mode === ThemeMode.DARK ? '#1a2524' : '#c1d6d066',
      label: firstCapitalized(intl.formatMessage({ id: 'theme8' })),
      shadow: `0 0 0 2px ${alpha(mode === ThemeMode.DARK ? '#058478' : '#009688', 0.2)}`
    }
  ];

  const handlePresetColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value as PresetColor;
    if (onChange) {
      onChange(newColor);
    } else {
      onChangePresetColor(newColor);
    }
  };

  return (
    <RadioGroup row aria-label="payment-card" name="payment-card" value={presetColor} onChange={handlePresetColorChange}>
      <Grid container spacing={2} sx={{ ml: 0 }}>
        {colorOptions.map((color, index) => (
          <Grid item key={index}>
            <FormControlLabel
              control={<Radio value={color.id} sx={{ display: 'none' }} />}
              sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
              label={
                <MainCard
                  content={false}
                  sx={{ bgcolor: presetColor === color.id ? color.lighter : 'secondary.lighter', p: 1 }}
                  border={false}
                  boxShadow
                  shadow={presetColor === color.id ? color.shadow : theme.customShadows.z1}
                >
                  <Stack spacing={1.5} alignItems="center">
                    <CardMedia
                      component="img"
                      src={colorLayout}
                      alt="Vertical"
                      sx={{ border: `1px solid ${color.primary}`, borderRadius: 1, bgcolor: color.primary, width: 40, height: 40 }}
                    />
                    <Typography variant="caption">{color.label}</Typography>
                  </Stack>
                </MainCard>
              }
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

export default ColorScheme;
