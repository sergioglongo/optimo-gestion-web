import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import {
  setContainer,
  setLocalization,
  setMode,
  setPresetColor,
  setDirection,
  setMiniDrawer,
  setMenuOrientation,
  setFontFamily
} from 'store/slices/config';
import { FontFamily, I18n, MenuOrientation, PresetColor, ThemeDirection, ThemeMode } from 'types/config';

const useConfig = () => {
  const dispatch = useDispatch();
  const { container, i18n, mode, presetColor, themeDirection, miniDrawer, menuOrientation, fontFamily } = useSelector(
    (state: RootState) => state.config
  );

  return {
    container,
    i18n,
    mode,
    presetColor,
    themeDirection,
    miniDrawer,
    menuOrientation,
    fontFamily,
    onChangeContainer: () => dispatch(setContainer()),
    onChangeLocalization: (lang: I18n) => dispatch(setLocalization(lang)),
    onChangeMode: (mode: ThemeMode) => dispatch(setMode(mode)),
    onChangePresetColor: (theme: PresetColor) => dispatch(setPresetColor(theme)),
    onChangeDirection: (direction: ThemeDirection) => dispatch(setDirection(direction)),
    onChangeMiniDrawer: (miniDrawer: boolean) => dispatch(setMiniDrawer(miniDrawer)),
    onChangeMenuOrientation: (menuOrientation: MenuOrientation) => dispatch(setMenuOrientation(menuOrientation)),
    onChangeFontFamily: (fontFamily: FontFamily) => dispatch(setFontFamily(fontFamily))
  };
};

export default useConfig;
