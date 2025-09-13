import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FontFamily, I18n, MenuOrientation, PresetColor, ThemeDirection, ThemeMode } from 'types/config';
import config from 'config';

export interface ConfigState {
  fontFamily: FontFamily;
  i18n: I18n;
  miniDrawer: boolean;
  container: boolean;
  menuOrientation: MenuOrientation;
  mode: ThemeMode;
  presetColor: PresetColor;
  themeDirection: ThemeDirection;
}

const initialState: ConfigState = {
  fontFamily: config.fontFamily,
  i18n: config.i18n,
  miniDrawer: config.miniDrawer,
  container: config.container,
  menuOrientation: config.menuOrientation,
  mode: config.mode,
  presetColor: config.presetColor,
  themeDirection: config.themeDirection
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setContainer(state) {
      state.container = !state.container;
    },
    setLocalization(state, action: PayloadAction<I18n>) {
      state.i18n = action.payload;
    },
    setMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    setPresetColor(state, action: PayloadAction<PresetColor>) {
      state.presetColor = action.payload;
    },
    setDirection(state, action: PayloadAction<ThemeDirection>) {
      state.themeDirection = action.payload;
    },
    setMiniDrawer(state, action: PayloadAction<boolean>) {
      state.miniDrawer = action.payload;
    },
    setMenuOrientation(state, action: PayloadAction<MenuOrientation>) {
      state.menuOrientation = action.payload;
    },
    setFontFamily(state, action: PayloadAction<FontFamily>) {
      state.fontFamily = action.payload;
    }
  }
});

export const { setContainer, setLocalization, setMode, setPresetColor, setDirection, setMiniDrawer, setMenuOrientation, setFontFamily } =
  configSlice.actions;

export default configSlice.reducer;
